import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';
import { Countries } from './countries.model';

@Table({
    timestamps: true,
    tableName: 'states',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
})
export class States extends Model<States> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: string;

    @AllowNull(false)
    @Column(DataType.STRING(60))
    name: string;

    @ForeignKey(() => Countries)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    country_id: number;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @BelongsTo(() => Countries)
    country: Countries;
}