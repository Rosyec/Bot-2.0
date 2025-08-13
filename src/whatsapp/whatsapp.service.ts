import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly apiUrl: string;
  private readonly phoneNumberId: string;
  private readonly accessToken: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get('WHATSAPP_API_URL') || '';
    this.phoneNumberId =
      this.configService.get('WHATSAPP_PHONE_NUMBER_ID') || '';
    this.accessToken = this.configService.get('WHATSAPP_ACCESS_TOKEN') || '';
  }

  async sendTextMessage(to: string, text: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: {
            body: text,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error.response?.data);
      throw error;
    }
  }

  async sendImageMessage(to: string, imageUrl: string, caption?: string) {
    return axios.post(
      `${this.apiUrl}/${this.phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'video',
        video: {
          link: imageUrl,
          caption: caption || '',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  async sendQuickButtonMessage(to: string, text: string) {
    return axios.post(
      `${this.apiUrl}/${this.phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text,
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: { id: 'btn1', title: '1️⃣ Aceptar' },
              },
              // { type: 'reply', reply: { id: 'btn2', title: '2️⃣ Cancelar' } },
            ],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  async sendListMessage(to: string) {
    return axios.post(
      `${this.apiUrl}/${this.phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'interactive',
        interactive: {
          type: 'list',
          body: { text: 'Selecciona una opción:' },
          action: {
            button: 'Ver opciones',
            sections: [
              {
                title: 'Sección 1',
                rows: [
                  {
                    id: 'opcion1',
                    title: 'Opción 1',
                    description: 'Descripción 1',
                  },
                  {
                    id: 'opcion2',
                    title: 'Opción 2',
                    description: 'Descripción 2',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
