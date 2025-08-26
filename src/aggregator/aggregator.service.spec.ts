import { Test, TestingModule } from '@nestjs/testing';
import { aggregatorService } from './aggregator.service';

describe('aggregatorService', () => {
  let service: aggregatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [aggregatorService],
    }).compile();

    service = module.get<aggregatorService>(aggregatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
