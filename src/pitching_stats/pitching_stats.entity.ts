import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class PitchingStats {
  @PrimaryGeneratedColumn()
  id: number;
}
