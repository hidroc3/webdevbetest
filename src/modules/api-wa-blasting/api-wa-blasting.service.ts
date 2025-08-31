import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ApiWaBlastingService {
  private readonly WATZAP_API_URL: string;
  private readonly WATZAP_NUMBER_KEY: string;
  private readonly WATZAP_API_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.WATZAP_API_URL = this.configService.get<string>('WATZAP_API_URL')!;
    this.WATZAP_NUMBER_KEY =
      this.configService.get<string>('WATZAP_NUMBER_KEY')!;
    this.WATZAP_API_KEY = this.configService.get<string>('WATZAP_API_KEY')!;
  }

  async sendMessage(dto: SendMessageDto) {
    const request = {
      phone_no: dto.phoneNumber,
      message: dto.message,
    };
    return this.sendRequest('send_message', request);
  }

  private async sendRequest(endpoint: string, request: object) {
    const url = `${this.WATZAP_API_URL}/${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = {
      api_key: this.WATZAP_API_KEY,
      number_key: this.WATZAP_NUMBER_KEY,
      ...request,
    };
    await firstValueFrom(
      this.httpService.post(url, body, { headers }).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(
            {
              message: 'Failed to call Watzap API',
              errors: error.response?.data || error.message,
            },
            error.response?.status || 500,
          );
        }),
      ),
    );
    return;
  }
}
