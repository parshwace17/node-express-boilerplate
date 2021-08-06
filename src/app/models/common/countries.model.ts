import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, HasMany, AutoIncrement, PrimaryKey, AllowNull } from 'sequelize-typescript';
import { States } from './states.model';

@Table({
  timestamps: true,
  tableName: 'countries',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
})
export class Countries extends Model<Countries> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING(16))
  phone_code: number;

  @Column(DataType.STRING(191))
  emoji: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @HasMany(() => States, { onDelete: 'CASCADE', hooks: true })
  states: States[];
}
