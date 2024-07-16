import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NewsService {
  private readonly latestNews = [];
  private readonly highlights = [];

  constructor() {
    this.latestNews = this.loadStats('latestNews.json');
    this.highlights = this.loadStats('highlights.json');
  }

  private loadStats(filename: string) {
    const filePath = path.resolve(__dirname, '../../data', filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  getStats(type: string) {
    switch (type) {
      case 'latest':
        return this.latestNews;
      case 'highlights':
        return this.highlights;
      default:
        return [];
    }
  }
}
