import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import Mock = jest.Mock;

describe('UsersController', () => {
  let service: UsersService;
  let mockRepository: Mock<Repository<User>>;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    mockRepository = module.get(getRepositoryToken(User));
    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

// @ts-ignore
export const repositoryMockFactory: () => Mock<Repository<User>> = jest.fn(
  () => ({
    findOne: jest.fn((id: number) => mockUser),
  }),
);

const mockUser: User = {
  id: 9999,
  firstName: 'testfirst',
  lastName: 'testlast',
  isActive: true,
  createdDate: new Date('1995-12-17T03:24:00'),
  updatedDate: new Date('1995-12-17T03:24:00'),
};
