import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Injectable()
export class UploadService {
  async handleFileUpload(file: Express.Multer.File): Promise<any> {
    const results = [];
    const filePath = path.join(__dirname, '../../uploads', file.filename);
    let id = 0;
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          id++;
          const result = Object.keys(data).reduce((acc, key) => {
            acc[key.toLowerCase().replace(' ', '_')] = data[key];
            return acc;
          }, {});
          results.push({
            id,
            ...result,
          });
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async saveData(data: any, fileName: string) {
    const file = fileName.toLowerCase().replace('.csv', '');
    const filePath = path.join(__dirname, '../../data', `${file}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data));
  }
}
