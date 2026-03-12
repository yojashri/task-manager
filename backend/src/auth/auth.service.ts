import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}



  // =========================
  // SIGNUP
  // =========================

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



  // =========================
  // LOGIN
  // =========================

  async login(data: any) {

    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const valid = await bcrypt.compare(data.password, user.password)

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Create Access Token
    const accessToken = this.jwtService.sign(
      {
        id: user.id,
        role: user.role
      },
      { expiresIn: '10m' }
    )

    // Create Refresh Token
    const refreshToken = this.jwtService.sign(
      {
        id: user.id
      },
      { expiresIn: '7d' }
    )

    // Hash Refresh Token before storing
    const hashedToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex')

    await this.prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

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



  // =========================
  // REFRESH TOKEN
  // =========================

  async refresh(refreshToken: string) {

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing')
    }

    // Hash incoming token
    const hashedToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex')

    const stored = await this.prisma.refreshToken.findFirst({
      where: { token: hashedToken }
    })

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    // Verify JWT
    const payload = this.jwtService.verify(refreshToken)

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id }
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    // Create new access token
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



  // =========================
  // GET USERS (for teacher dashboard)
  // =========================

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



  // =========================
  // LOGOUT
  // =========================

  async logout(refreshToken: string) {

    if (!refreshToken) {
      return { message: 'Already logged out' }
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex')

    await this.prisma.refreshToken.deleteMany({
      where: { token: hashedToken }
    })

    return {
      message: 'Logged out successfully'
    }
  }

}