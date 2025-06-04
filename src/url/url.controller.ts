import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Redirect,
  Delete,
} from '@nestjs/common';

import { UrlService } from './url.service';
import { Url } from './url.entity';
import { UrlDto } from './url.dto';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shorten(@Body() urlDto: UrlDto): Promise<Url> {
    if (!urlDto.originalUrl) {
      throw new Error('Original URL is required');
    }
    return await this.urlService.shorten(urlDto);
  }

  @Get(':shortUrl')
  @Redirect()
  async redirect(@Param('shortUrl') shortUrl: string) {
    const originalUrl = await this.urlService.redirectToOriginalUrl(shortUrl);

    if (!originalUrl) {
      throw new NotFoundException('Short URL not found');
    }

    return { url: originalUrl };
  }

  @Get('info/:shortUrl')
  async getInfo(@Param('shortUrl') shortUrl: string): Promise<Url> {
    const url = await this.urlService.getInfo(shortUrl);
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    return url;
  }

  @Delete('delete/:shortUrl')
  async delete(@Param('shortUrl') shortUrl: string): Promise<void> {
    try {
      await this.urlService.deleteUrl(shortUrl);
    } catch (error) {
      throw new NotFoundException('Short URL not found');
    }
  }
}
