import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsappService } from './whatsapp.service';
import { Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly configService: ConfigService,
    private whatsappService: WhatsappService,
  ) { }

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') token: string,
    @Res() res: Response,
  ) {
    if (
      mode === 'subscribe' &&
      token === this.configService.get('WEBHOOK_VERIFY_TOKEN')
    ) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  @Post()
  async handleIncomingMessages(@Body() body: any) {
    // Procesar mensajes
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      if (message) {
        await this.handleMessage(message);
      }
    }

    return { status: 'ok' };
  }

  private async handleMessage(message: any) {
    const from: string = message.from;
    const text = message.text?.body as string;

    console.log(`Nuevo mensaje de ${from}: ${text}`);

    const phone: string = from.replaceAll('57', '');

    if (message.type === 'text') {
      if (text.includes("hola")) {
        const customText = "Hola, bienvenido. Que puedo hacer por ti?"
        await this.whatsappService.sendQuickButtonMessage(from, customText);
      }
    }

    if (message.type == 'interactive') {
      if (message.interactive.type == 'button_reply') {
        if (message.interactive.button_reply.id == 'btn1') {
          // if (data !== undefined) {
          //   console.log('RESPONSE: ', message);
          //   console.log('PHONE: ', from);
          //   const captions = `¡Hola nuevamente`;
          //   await this.whatsappService.sendImageMessage(
          //     from,
          //     data.url,
          //     captions,
          //   );
          // }
        }
      }
    }

    if (text) {
      // await this.whatsappService.sendTextMessage(
      //   from,
      //   `Recibí tu mensaje: ${text}`,
      // );
      // await this.whatsappService.sendListMessage(from);
    }
  }
}
