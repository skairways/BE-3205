import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Redirect,
  Delete,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { UrlService } from './url.service';
import { Url } from './url.entity';
import { UrlDto } from './url.dto';
import { ClickService } from 'src/click/click.service';
@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly clickService: ClickService,
  ) {}

  @Post('shorten')
  async shorten(@Body() urlDto: UrlDto): Promise<Url> {
    if (!urlDto.originalUrl) {
      throw new Error('Original URL is required');
    }
    return await this.urlService.shorten(urlDto);
  }

  @Get(':shortUrl')
  @Redirect()
  async redirect(@Param('shortUrl') shortUrl: string, @Req() req: Request) {
    const originalUrl = await this.urlService.redirectToOriginalUrl(shortUrl);
    const urlEntity = await this.urlService.findByShortUrl(shortUrl);

    if (!originalUrl) {
      throw new NotFoundException('Short URL not found');
    }

    await this.clickService.recordClick(urlEntity, req.ip);

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
