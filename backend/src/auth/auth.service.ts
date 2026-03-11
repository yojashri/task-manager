import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  
  // SIGNUP
  
  async signup(data: any) {

    const hash = await bcrypt.hash(data.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hash,
        role: data.role,
        teacherId: data.teacherId || null
      }
    })

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      teacherId: user.teacherId
    }
  }

  
  // LOGIN
 // LOGIN

async login(data: any) {

  const user = await this.prisma.user.findUnique({
    where: { email: data.email }
  })

  if (!user) throw new UnauthorizedException('Invalid credentials')

  const valid = await bcrypt.compare(data.password, user.password)

  if (!valid) throw new UnauthorizedException('Invalid credentials')

  // Access Token
  const accessToken = this.jwtService.sign(
    {
      id: user.id,
      role: user.role
    },
    { expiresIn: '10m' }
  )

  // Refresh Token
  const refreshToken = this.jwtService.sign(
    {
      id: user.id
    },
    { expiresIn: '7d' }
  )

  // Store refresh token in DB
  await this.prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  // Return safe user object
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      teacherId: user.teacherId
    }
  }
}
  
  // REFRESH TOKEN
  
  async refresh(refreshToken: string) {

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing')
    }

    // Check token exists in DB
    const stored = await this.prisma.refreshToken.findFirst({
      where: { token: refreshToken }
    })

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    // Verify JWT
    const payload = this.jwtService.verify(refreshToken)

    // Fetch user from DB to get role
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id }
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    // Generate new access token
    const newAccessToken = this.jwtService.sign(
      {
        id: user.id,
        role: user.role
      },
      { expiresIn: '15m' }
    )

    return {
      accessToken: newAccessToken
    }
  }
//updated
  async getUsers() {
  return this.prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      teacherId: true
    }
  })
}
  // LOGOUT
  
  async logout(refreshToken: string) {

    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    })

    return {
      message: 'Logged out successfully'
    }
  }
}