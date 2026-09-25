import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [NotificacionesModule, EmailModule],
  providers: [RabbitmqService],
})
export class RabbitmqModule {}