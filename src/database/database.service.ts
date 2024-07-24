import { Injectable } from '@nestjs/common';
import { createClient } from '@vercel/postgres';

@Injectable()
export class DatabaseService {
  private client;

  constructor() {
    this.client = createClient();
    this.client.connect();
  }

  async query(query: string, params?: any[]) {
    try {
      const res = await this.client.query(query, params);
      return res.rows;
    } catch (err) {
      throw new Error(`Database query failed: ${err.message}`);
    }
  }
}
