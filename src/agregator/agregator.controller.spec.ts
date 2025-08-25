import { Test, TestingModule } from '@nestjs/testing';
import { AgregatorController } from './agregator.controller';

describe('AgregatorController', () => {
  let controller: AgregatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgregatorController],
    }).compile();

    controller = module.get<AgregatorController>(AgregatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
