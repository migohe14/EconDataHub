import { Test, TestingModule } from '@nestjs/testing';
import { aggregatorController } from './aggregator.controller';

describe('aggregatorController', () => {
  let controller: aggregatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [aggregatorController],
    }).compile();

    controller = module.get<aggregatorController>(aggregatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
