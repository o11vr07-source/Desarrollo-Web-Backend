import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { VerificarClienteDto } from './dto/verificar-cliente.dto';
import { ActivarCuentaDto } from './dto/activar-cuenta.dto';
import { RegisterClienteDto } from './dto/register-cliente.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Req() req: Request,
  ) {
    return this.authService.login(
      dto.username,
      dto.password,
      req,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: any) {
    return this.authService.logout(req);
  }

  @Post('verificar-cliente')
  verificarCliente(
    @Body() dto: VerificarClienteDto,
  ) {
    return this.authService.verificarCliente(
      dto.ci,
    );
  }

  @Post('activar-cuenta')
  activarCuenta(
    @Body() dto: ActivarCuentaDto,
  ) {
    return this.authService.activarCuenta(dto);
  }

  @Post('register-cliente')
  registerCliente(
    @Body() dto: RegisterClienteDto,
  ) {
    return this.authService.registerCliente(dto);
  }
}