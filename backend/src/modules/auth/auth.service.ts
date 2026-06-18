import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LogsAccesosService } from '../logs-accesos/logs-accesos.service';
import { EventoLog } from '../logs-accesos/entities/logs-acceso.entity';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Persona } from '../personas/entities/persona.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ActivarCuentaDto } from './dto/activar-cuenta.dto';
import { Rol } from '../roles/entities/rol.entity';
import { RegisterClienteDto } from './dto/register-cliente.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly logsAccesoService: LogsAccesosService,
  ) { }

  private calcularEdad(fecha: Date): number {
    const hoy = new Date();

    let edad =
      hoy.getFullYear() -
      fecha.getFullYear();

    const mes =
      hoy.getMonth() -
      fecha.getMonth();

    if (
      mes < 0 ||
      (mes === 0 &&
        hoy.getDate() < fecha.getDate())
    ) {
      edad--;
    }

    return edad;
  }

  async login(username: string, password: string, req: Request) {
    const ip = req.ip || req.socket.remoteAddress || '';
    const parser = new UAParser(req.headers['user-agent'] || '');
    const ua = parser.getResult();
    const browser = `${ua.browser.name} ${ua.browser.version}`;
    const sistema_operativo = `${ua.os.name} ${ua.os.version}`;

    const user = await this.usuarioRepository.findOne({
      where: { username },
      relations: {
        rol: true,
        persona: true,
      },
    });

    if (!user) {
      await this.logsAccesoService.registrar(EventoLog.LOGIN_FALLIDO, {
        ip, browser, sistema_operativo,
      },);
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!passwordValid) {
      await this.logsAccesoService.registrar(EventoLog.LOGIN_FALLIDO, {
        id_usuario: user.id_usuario, ip, browser, sistema_operativo,
      },);
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      id_usuario: user.id_usuario,
      id_persona: user.id_persona,
      username: user.username,
      rol: user.rol.nombre,
    };

    await this.logsAccesoService.registrar(
      EventoLog.INGRESO,
      {
        id_usuario: user.id_usuario, ip, browser, sistema_operativo,
      },
    );

    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async logout(req: any) {
    const ip = req.ip || req.socket.remoteAddress || '';
    const parser = new UAParser(req.headers['user-agent'] || '');
    const ua = parser.getResult();
    const browser = `${ua.browser.name} ${ua.browser.version}`;
    const sistema_operativo = `${ua.os.name} ${ua.os.version}`;

    const id_usuario = req.user.id_usuario;
  
    await this.logsAccesoService.registrar(
      EventoLog.SALIDA,
      {
        id_usuario,
        ip,
        browser,
        sistema_operativo,
      },
    );
  
    return { message: 'Logout registrado' };
  }

  async verificarCliente(ci: string) {

    const persona = await this.personaRepository.findOne({
      where: {
        ci,
      },
    });
  

    if (!persona) {
      return {
        existe: false,
      };
    }
  
    const cliente = await this.clienteRepository.findOne({
      where: {
        id_persona: persona.id_persona,
      },
      relations: {
        persona: true,
      },
    });
  
    if (!cliente) {
      return {
        existe: false,
      };
    }
  
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_persona: persona.id_persona,
      },
    });
  
    return {
      existe: true,
  
      tieneUsuario: !!usuario,
  
      cliente: {
        id_cliente: cliente.id_cliente,
        id_persona: persona.id_persona,
        nombres: persona.nombres,
        apellidos: persona.apellidos,
        email: cliente.email,
      },
    };
  }

  async activarCuenta(
    dto: ActivarCuentaDto,
  ) {
  
    const rolCliente =
      await this.rolRepository.findOne({
        where: {
          nombre: 'CLIENTE',
        },
      });
  
    if (!rolCliente) {
      throw new NotFoundException(
        'No existe el rol CLIENTE',
      );
    }
  
    return await this.usuariosService.create({
      id_persona: dto.id_persona,
      id_rol: rolCliente.id_rol,
      username: dto.username,
      password: dto.password,
    });
  }

  async registerCliente(dto: RegisterClienteDto) {

    const rolCliente = await this.rolRepository.findOne({
      where: { nombre: 'CLIENTE' },
    });
  
    if (!rolCliente) {
      throw new NotFoundException('Rol CLIENTE no existe');
    }
  
    const cliente = await this.clienteRepository.findOne({
      where: { email: dto.email },
      relations: { persona: true },
    });
  
    if (cliente) {
      throw new BadRequestException(
        'Ya existe un cliente con este email',
      );
    }
  
    const persona = this.personaRepository.create({
      ci: dto.ci,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
      direccion: dto.direccion,
      ciudad: dto.ciudad,
      fecha_nac: dto.fecha_nac as any,
      edad: this.calcularEdad(new Date(dto.fecha_nac)),
      estado: 'ACTIVO',
    });
  
    const personaGuardada =
      await this.personaRepository.save(persona);
  

    const nuevoCliente = this.clienteRepository.create({
      persona: personaGuardada,
      email: dto.email,
      estado: 'ACTIVO',
    });
  
    await this.clienteRepository.save(nuevoCliente);
  
    const usuario = await this.usuariosService.create({
      id_persona: personaGuardada.id_persona,
      id_rol: rolCliente.id_rol,
      username: dto.username,
      password: dto.password,
    });
  
    return {
      cliente: nuevoCliente,
      usuario,
    };
  }

}