import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = file.originalname;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
    @Body('id') id: string,
  ) {
    const data = await this.uploadService.handleFileUpload(file);
    let fileName = file.originalname;
    if (type) {
      fileName = type;
    }
    if (id) {
      fileName = `${type}-${id}`;
    }
    this.uploadService.saveData(data, fileName);
    return data;
  }
}
