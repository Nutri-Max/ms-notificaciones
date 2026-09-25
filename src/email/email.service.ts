import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async enviarCorreo(destinatario: string, asunto: string, mensaje: string) {
    try {
      await this.transporter.sendMail({
        from: `"NutriMax" <${this.configService.get<string>('EMAIL_USER')}>`,
        to: destinatario,
        subject: asunto,
        text: mensaje,
      });
      console.log('Correo enviado a:', destinatario);
    } catch (error) {
      console.error('Error enviando correo:', error);
    }
  }
}