import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { Notificacion } from '../schemas/notificacion.schema';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post()
  async crear(@Body() datos: Partial<Notificacion>) {
    return this.notificacionesService.crear(datos);
  }

  @Get()
  async obtenerTodas() {
    return this.notificacionesService.obtenerTodas();
  }

  @Get('usuario/:usuarioId')
  async obtenerPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.notificacionesService.obtenerPorUsuario(usuarioId);
  }
}