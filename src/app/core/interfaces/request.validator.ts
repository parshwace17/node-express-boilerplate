import { IsString, IsOptional, IsIn } from 'class-validator';

export class PAGINATION {
    @IsOptional() @IsString() pageNumber: string;
    @IsOptional() @IsString() recordPerPage: string;
    @IsOptional() @IsString() orderBy: string;
    @IsOptional() @IsString() @IsIn(['asc', 'desc', 'ASC', 'DESC']) orderDir: string;
    @IsOptional() @IsString() cb: string;
}
