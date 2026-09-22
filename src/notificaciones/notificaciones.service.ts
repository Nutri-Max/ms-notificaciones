import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notificacion,
  NotificacionDocument,
  EstadoNotificacion,
} from '../schemas/notificacion.schema';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectModel(Notificacion.name)
    private notificacionModel: Model<NotificacionDocument>,
  ) {}

  async crear(datos: Partial<Notificacion>): Promise<Notificacion> {
    const nueva = new this.notificacionModel(datos);
    // Aca mas adelante se conectaria un servicio real de envio (email/SMS)
    // Por ahora simulamos que se envia correctamente
    nueva.estado = EstadoNotificacion.ENVIADA;
    return nueva.save();
  }

  async obtenerTodas(): Promise<Notificacion[]> {
    return this.notificacionModel.find().sort({ fecha: -1 }).exec();
  }

  async obtenerPorUsuario(usuarioId: string): Promise<Notificacion[]> {
    return this.notificacionModel
      .find({ usuarioId })
      .sort({ fecha: -1 })
      .exec();
  }
}