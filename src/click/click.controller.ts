import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ClickService } from './click.service';

@Controller('analytics')
export class ClickController {
  constructor(private readonly clickService: ClickService) {}

  @Get(':shortUrl')
  async getAnalytics(@Param('shortUrl') shortUrl: string) {
    const analytics = await this.clickService.getAnalytics(shortUrl);

    if (!analytics) {
      throw new NotFoundException('Short URL not found or has no clicks');
    }

    return analytics;
  }
}
