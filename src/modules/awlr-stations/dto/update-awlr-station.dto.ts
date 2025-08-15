import { PartialType } from '@nestjs/mapped-types';
import { CreateAwlrStationDto } from './create-awlr-station.dto';

export class UpdateAwlrStationDto extends PartialType(CreateAwlrStationDto) {}
