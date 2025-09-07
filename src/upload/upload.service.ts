import { Injectable, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { promises as fsp } from 'fs';

@Injectable()
export class UploadService {
  private uploadPath = join(__dirname, '..', '..', 'storage', 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  validateFile(
    file: Express.Multer.File,
    allowedMimes: string[],
    maxSize: number,
  ) {
    if (!allowedMimes.includes(file.mimetype as string)) {
      throw new BadRequestException(`File type ${file.mimetype} not allowed`);
    }
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds ${maxSize / 1024 / 1024} MB`,
      );
    }
  }

  async saveLocal(file: Express.Multer.File): Promise<string> {
    this.validateFile(file, ['image/jpeg', 'image/png'], 2 * 1024 * 1024);

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = join(this.uploadPath, filename);

    await fsp.writeFile(filepath, file.buffer as Buffer);

    return `/uploads/${filename}`;
  }
}
