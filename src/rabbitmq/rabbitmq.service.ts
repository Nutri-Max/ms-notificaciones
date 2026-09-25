import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { TipoNotificacion } from '../schemas/notificacion.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: any;
  private channel: any;
  private readonly queue = 'notificaciones.order-confirmed';

  constructor(
    private configService: ConfigService,
    private notificacionesService: NotificacionesService,
    private emailService: EmailService,
  ) {}

  async onModuleInit() {
    const url = this.configService.get<string>('RABBITMQ_URL');
    this.connection = await amqp.connect(url!);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });

    this.channel.consume(this.queue, async (msg: amqp.ConsumeMessage | null) => {
      if (!msg) return;
      try {
        const evento = JSON.parse(msg.content.toString());
        console.log('Evento OrderConfirmed recibido:', evento.pedidoId);

        const asunto = `Confirmación de pedido #${evento.pedidoId} - NutriMax`;
        const mensaje = `¡Gracias por tu compra! Tu pedido #${evento.pedidoId} por un total de $${evento.total} ha sido confirmado.`;

        await this.notificacionesService.crear({
          usuarioId: String(evento.usuarioId),
          tipo: TipoNotificacion.EMAIL,
          destinatario: evento.email || 'sin-email@nutrimax.com',
          asunto,
          mensaje,
          ordenId: String(evento.pedidoId),
        });

        if (evento.email) {
          await this.emailService.enviarCorreo(evento.email, asunto, mensaje);
        }

        this.channel.ack(msg);
      } catch (error) {
        console.error('Error procesando evento OrderConfirmed:', error);
        this.channel.nack(msg, false, false);
      }
    });

    console.log('Escuchando cola:', this.queue);
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}