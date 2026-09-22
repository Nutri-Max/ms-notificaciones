import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificacionDocument = Notificacion & Document;

export enum TipoNotificacion {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}

export enum EstadoNotificacion {
  PENDIENTE = 'PENDIENTE',
  ENVIADA = 'ENVIADA',
  FALLIDA = 'FALLIDA',
}

@Schema({ timestamps: true })
export class Notificacion {
  @Prop({ required: true })
  usuarioId: string;

  @Prop({ required: true, enum: TipoNotificacion })
  tipo: TipoNotificacion;

  @Prop({ required: true })
  destinatario: string; // email o numero de telefono

  @Prop({ required: true })
  asunto: string;

  @Prop({ required: true })
  mensaje: string;

  @Prop({ enum: EstadoNotificacion, default: EstadoNotificacion.PENDIENTE })
  estado: EstadoNotificacion;

  @Prop()
  ordenId?: string; // opcional, si la notificacion viene de un evento de compra

  @Prop({ default: Date.now })
  fecha: Date;
}

export const NotificacionSchema = SchemaFactory.createForClass(Notificacion);