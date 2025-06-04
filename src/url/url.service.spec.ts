import { UrlService } from './url.service';
import { Url } from './url.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

describe('UrlService', () => {
  let service: UrlService;
  let repo: Repository<Url>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    repo = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  it('should create a short URL with a custom alias', async () => {
    const dto = {
      originalUrl: 'https://example.com',
      alias: 'customAlias',
      shortUrl: 'customAlias',
    };

    const createdUrl = {
      ...dto,
      id: undefined,
      createdAt: new Date(),
    };

    (repo.findOne as jest.Mock).mockResolvedValue(null);

    (repo.create as jest.Mock).mockReturnValue(createdUrl);

    (repo.save as jest.Mock).mockResolvedValue({
      ...createdUrl,
      id: 1,
    });

    const result = await service.shorten(dto);

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { shortUrl: 'customAlias' },
    });
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining(dto));
    expect(repo.save).toHaveBeenCalledWith(createdUrl);
    expect(result.shortUrl).toBe('customAlias');
  });

  it('should redirect to the original URL', async () => {
    const shortUrl = 'customAlias';
    const alias = 'customAlias';
    const originalUrl = 'https://example.com';

    const foundUrl = {
      id: 1,
      originalUrl,
      shortUrl,
      alias,
      createdAt: new Date(),
    };

    (repo.findOne as jest.Mock).mockResolvedValue(foundUrl);

    const result = await service.redirectToOriginalUrl(shortUrl);

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { shortUrl },
    });
    expect(result).toBe(originalUrl);
  });
});
