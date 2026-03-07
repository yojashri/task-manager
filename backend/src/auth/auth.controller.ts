import { Controller, Post, Body, Req, Res, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import type { Request, Response } from 'express'

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() data: any) {
    return this.authService.signup(data)
  }

  @Post('login')
  async login(
    @Body() data: any,
    @Res({ passthrough: true }) res: Response
  ) {

    const result = await this.authService.login(data)

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return {
      accessToken: result.accessToken,
      user: result.user
    }
  }

  @Get('users')
  getUsers() {
    return this.authService.getUsers()
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies.refreshToken
    return this.authService.refresh(refreshToken)
  }

  @Post('logout')
  logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {

    const token = req.cookies.refreshToken

    res.clearCookie("refreshToken")

    return this.authService.logout(token)
  }
}