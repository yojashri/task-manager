import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  UseGuards
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { SignupDto } from './dto/signup.dto'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './guards/jwt.guard'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}
  //   ------------------------
  // GET USERS (Protected)
  // ------------------------
  // */

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getUsers() {
    return this.authService.getUsers()
  }

  /*

  /*
  ------------------------
  SIGNUP
  ------------------------
  */

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto)
  }

  /*
  ------------------------
  LOGIN
  ------------------------
  */
  @Throttle({default:{limit: 5, ttl: 60000}}) // 5 requests per minute  
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {

    const result = await this.authService.login(dto)

    // Store refresh token in httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,        // change to true in production (HTTPS)
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return {
      accessToken: result.accessToken,
      user: result.user
    }
  }

  /*
 
  ------------------------
  REFRESH TOKEN
  ------------------------
  */

  @Post('refresh')
  async refresh(@Req() req: Request) {

    const refreshToken = req.cookies.refreshToken

    return this.authService.refresh(refreshToken)
  }

  /*
  ------------------------
  LOGOUT
  ------------------------
  */

  @Post('logout')
  logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {

    const token = req.cookies.refreshToken

    res.clearCookie('refreshToken')

    return this.authService.logout(token)
  }

}