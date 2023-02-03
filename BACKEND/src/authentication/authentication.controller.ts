import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { JwtAuthenticationGuard, LocalAuthGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';
import { codeDto, loginDto, SignDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { TFAService } from './twilio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

const storage = multer.memoryStorage();

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly usersService: UsersService,
    private readonly tfaService: TFAService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async addToCache(key: string, item: string): Promise<any> {
    await this.cacheManager.set(key, item, 300);
  }

  async getFromCache(key: string) {
    const value = await this.cacheManager.get(key);
    const str: string = value as string;
    return str;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('who')
  who(@Request() req: any) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Get()
  auth() {
    console.log(`authentication.controller: auth(42auth)`);
  }

  @Get('redirect')
  redirect(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    console.log(`authentication.controller: redirect(signin) ---> SUCCESS`);
    return res.redirect('http://localhost:3000');
  }

  @Post('data')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async getFile(@Req() req: ExpressRequest) {
    if (req.file && req.body.user) {
      const user = await this.usersService.uploadFile(
        req.body?.user,
        req.file?.buffer,
        req.file?.originalname,
        req.file?.mimetype,
        req.file?.size,
      );
      if (user) {
        return user;
      }
      return null;
    }
  }

  @Post('signup')
  async signup(@Res() res: ExpressResponse, @Body() user: SignDto) {
    const newUser = await this.usersService.signUp(user);
    if (newUser) {
      console.log(
        `authentication.controller: signUp(${newUser.login}) ---> SUCCESS`,
      );
      return res.send(newUser);
    }
    console.log(`authentication.controller: signUp(${user.login}) ---> FAIL`);
    return res.status(401);
  }

  @Post('signin')
  async signIn(@Res() res: ExpressResponse, @Body() body: loginDto) {
    const foundUser = await this.usersService.findOneByLogin(body.login);
    if (foundUser) {
      //const { phoneNumber } = foundUser;
      //const code = Math.floor(1000 + Math.random() * 9000);
      // await this.tfaService.sendSms(
      //   phoneNumber,
      //   `Your verification code is: ${code}`,
      // );
      // await this.addToCache(body.login, Number(code).toString());
      //console.log(`authentication.controller: signin(${body}) ---> SUCCESS`);
      const cookie = await this.authService.login(body);
      return res.send({ foundUser, cookie });
    }
    console.log(`authentication.controller: signin(${body}) ---> FAIL`);
    return res.status(401);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('code')
  async tfaCode(
    @Request() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Body() body: codeDto,
  ) {
    const value = await this.getFromCache(body.login);
    if (value.localeCompare(body.code) !== 0) {
      return res.status(401);
    }
    return req.user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('signout')
  logout(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    const { user } = req;
    res.setHeader('Set-Cookie', '');
    console.log(`authentication.controller: signout(${user})`);
    return res.redirect('http://localhost:3000/signin');
  }
}
