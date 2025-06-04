import {
  Injectable,
  NotFoundException,
  GoneException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import * as crypto from 'crypto';
import { UrlDto } from './url.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async shorten(urlDto: UrlDto): Promise<Url> {
    const { originalUrl, expiresAt, alias } = urlDto;

    let shortUrl: string;

    if (alias !== null && alias !== undefined) {
      const existingAlias = await this.urlRepository.findOne({
        where: { shortUrl: alias },
      });
      if (existingAlias) {
        throw new BadRequestException('Alias already exists');
      }
      shortUrl = alias;
    } else {
      shortUrl = this.generateShortUrl();
    }

    const newUrl = this.urlRepository.create({
      originalUrl,
      shortUrl,
      alias: alias ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    return await this.urlRepository.save(newUrl);
  }

  private generateShortUrl(): string {
    return crypto.randomBytes(3).toString('hex');
  }

  async getInfo(shortUrl: string): Promise<Url | undefined> {
    return await this.urlRepository.findOne({ where: { shortUrl } });
  }

  async redirectToOriginalUrl(shortUrl: string): Promise<string | undefined> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
      throw new GoneException('This short URL has expired');
    }

    url.clickCount += 1;
    await this.urlRepository.save(url);
    return url.originalUrl;
  }

  async deleteUrl(shortUrl: string): Promise<void> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });

    if (!url) {
      throw new Error('Short URL not found');
    }

    await this.urlRepository.remove(url);
  }
}
