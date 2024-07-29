import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class Roster {
  @PrimaryGeneratedColumn()
  id: number;
}
