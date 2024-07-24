
  import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

  @Entity()
  export class standings {
    @PrimaryGeneratedColumn()
    id: number;
  }
