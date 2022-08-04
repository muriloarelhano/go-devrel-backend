import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { MONGODB_CONNECTION } from 'src/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Form], MONGODB_CONNECTION)],
  controllers: [FormsController],
  providers: [FormsService]
})
export class FormsModule {}
