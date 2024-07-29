import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NewsService {
  private readonly latestNews = [];
  private readonly highlights = [];
  private readonly contentDir = path.resolve(__dirname, '../../content');

  constructor() {
    this.latestNews = this.loadNews('latestNews.json');
    this.highlights = this.loadNews('highlights.json');
  }

  private loadNews(filename: string) {
    const filePath = path.resolve(__dirname, '../../data', filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  async getNews(type: string) {
    switch (type) {
      case 'latest':
        return this.latestNews;
      case 'highlights':
        return this.highlights;
      default:
        return [];
    }
  }

  async getNewsContent(filename: string): Promise<string> {
    const filePath = path.join(this.contentDir, `${filename}.md`);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${filename} not found`);
    }
    return fs.promises.readFile(filePath, 'utf-8');
  }
}
