import { IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class AssignPermissionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}
