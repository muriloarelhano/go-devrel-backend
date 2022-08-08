import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from '../../src/forms/forms.service';

describe('FormsService', () => {
  let service: FormsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormsService],
    }).compile();

    service = module.get<FormsService>(FormsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
