import { Test, TestingModule } from '@nestjs/testing';
import { FaqResolver } from './faq.resolver';

describe('FaqResolver', () => {
  let resolver: FaqResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaqResolver],
    }).compile();

    resolver = module.get<FaqResolver>(FaqResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
