import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notificacion,
  NotificacionDocument,
  EstadoNotificacion,
} from '../schemas/notificacion.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectModel(Notificacion.name)
    private notificacionModel: Model<NotificacionDocument>,
    private emailService: EmailService,
  ) {}

  async crear(datos: Partial<Notificacion>): Promise<Notificacion> {
    const nueva = new this.notificacionModel(datos);

    if (nueva.tipo === 'EMAIL') {
      try {
        await this.emailService.enviarCorreo(
          nueva.destinatario,
          nueva.asunto,
          nueva.mensaje,
        );
        nueva.estado = EstadoNotificacion.ENVIADA;
      } catch (error) {
        nueva.estado = EstadoNotificacion.FALLIDA;
      }
    } else {
      nueva.estado = EstadoNotificacion.ENVIADA;
    }

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