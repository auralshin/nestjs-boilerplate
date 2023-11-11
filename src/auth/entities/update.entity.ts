import { PartialType } from '@nestjs/swagger';
import { CreateEntity } from './create.entity';

export class UpdateEntity extends PartialType(CreateEntity) {}
