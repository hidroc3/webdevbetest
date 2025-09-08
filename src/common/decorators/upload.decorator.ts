import { BadRequestException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export function UploadFile(
  fieldName = 'file',
  allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSizeMB = 2,
) {
  return UseInterceptors(
    FileInterceptor(fieldName, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'storage', 'uploads');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `File type not allowed. Allowed: ${allowedMimeTypes.join(', ')}`,
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: maxSizeMB * 1024 * 1024,
      },
    }),
  );
}
