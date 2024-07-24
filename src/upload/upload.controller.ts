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
    @Body('gameId') gameId: string,
    @Body('teamId') teamId: string,
  ) {
    const data = await this.uploadService.handleFileUpload(file);
    let fileName = file.originalname;
    if (type) {
      fileName = type;
    }
    if (id) {
      fileName = fileName.concat(`-${id}`);
    }
    if (gameId) {
      fileName = fileName.concat(`-${gameId}`);
    }
    if (teamId) {
      fileName = fileName.concat(`-${teamId}`);
    }
    if (fileName.includes('roster')) {
      this.uploadService.saveRosterData(data, fileName);
    } else if (fileName.includes('batting')) {
      this.uploadService.saveBattingStats(data, fileName);
    } else {
      this.uploadService.saveData(data, fileName);
    }
    return data;
  }
}
