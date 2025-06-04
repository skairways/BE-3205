import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Click } from './click.entity';
import { Repository } from 'typeorm';
import { Url } from '../url/url.entity';

@Injectable()
export class ClickService {
  constructor(
    @InjectRepository(Click)
    private clickRepo: Repository<Click>,
  ) {}

  async recordClick(url: Url, ipAddress: string): Promise<Click> {
    const click = this.clickRepo.create({
      ipAddress,
      url,
    });
    return this.clickRepo.save(click);
  }

  async getAnalytics(shortUrl: string) {
    const clicks = await this.clickRepo.find({
      where: { url: { shortUrl } },
      order: { clickedAt: 'DESC' },
      take: 5,
      relations: ['url'],
    });

    const totalClicks = await this.clickRepo.count({
      where: { url: { shortUrl } },
    });

    return {
      totalClicks: totalClicks ?? 0,
      lastIps: clicks.map((click) => click.ipAddress),
    };
  }
}
