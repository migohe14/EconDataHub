import { Test, TestingModule } from '@nestjs/testing';
import { AgregatorService } from './agregator.service';

describe('AgregatorService', () => {
  let service: AgregatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgregatorService],
    }).compile();

    service = module.get<AgregatorService>(AgregatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
