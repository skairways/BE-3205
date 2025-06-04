import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Click } from './click.entity';
import { ClickService } from './click.service';
import { UrlModule } from '../url/url.module';
import { ClickController } from './click.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Click]), forwardRef(() => UrlModule)],
  controllers: [ClickController],
  providers: [ClickService],
  exports: [ClickService],
})
export class ClickModule {}
