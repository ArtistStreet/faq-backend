import { Test, TestingModule } from '@nestjs/testing';
import { ShopResolver } from './shop.resolver';

describe('ShopResolver', () => {
  let resolver: ShopResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopResolver],
    }).compile();

    resolver = module.get<ShopResolver>(ShopResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
