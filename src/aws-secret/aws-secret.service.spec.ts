import { Test, TestingModule } from '@nestjs/testing';
import { AwsSecretService } from './aws-secret.service';

describe('AwsSecretService', () => {
  let service: AwsSecretService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsSecretService],
    }).compile();

    service = module.get<AwsSecretService>(AwsSecretService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
