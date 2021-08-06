import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, DeletedAt, AutoIncrement, PrimaryKey, Comment, AllowNull, Unique, Default } from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'users'
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Default(2)
  @Comment('1-> Admin, 2-> User')
  @Column(DataType.TINYINT)
  role: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  first_name: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  last_name: string;

  @Unique('email')
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  country_code: string;

  @AllowNull(false)
  @Column(DataType.STRING(15))
  mobile_number: string;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  password: string;

  @Default(0)
  @Comment('0-> Inactive, 1-> Active')
  @Column(DataType.TINYINT)
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
