// src/notification.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService implements OnModuleInit {
  async onModuleInit() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('order.confirmation', { durable: false });
    await channel.consume('order.confirmation', async (msg) => {
      if (msg !== null) {
        const order = JSON.parse(msg.content.toString());
        await this.sendEmail(order);
        channel.ack(msg);
      }
    });
  }

  private async sendEmail(order: any) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: order.customerEmail,
      subject: 'Order Confirmation',
      text: `Your order has been placed: ${JSON.stringify(order)}`,
    };

    await transporter.sendMail(mailOptions);
  }
}
