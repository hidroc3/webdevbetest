import { PartialType } from '@nestjs/mapped-types';
import { CreateArrStationDto } from './create-arr-station.dto';

export class UpdateArrStationDto extends PartialType(CreateArrStationDto) {}
