import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UsersController', () => {
  let mockRepository: Repository<User>;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    mockRepository = module.get<Repository<User>>(getRepositoryToken(User));
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll method returns users array.', async () => {
    const expected = generateMockUser(3);
    jest.spyOn(mockRepository, 'find').mockImplementation(async () => expected);

    const res = await controller.findAll();
    expect(res.length).toBe(3);
    expect(res).toEqual(expected);
  });

  it('findOne method returns not found error when specified user does not exists.', async () => {
    jest.spyOn(mockRepository, 'findOne').mockImplementation(async () => null);
    await expect(() => {
      return controller.findOne('1234567890');
    }).rejects.toThrow(); // https://jestjs.io/docs/asynchronous#resolves--rejects
  });

  it('findOne method returns a user.', async () => {
    const user = generateMockUser().pop();
    user.id = 123;

    jest.spyOn(mockRepository, 'findOne').mockImplementation(async () => user);

    expect(await controller.findOne(user.id.toString())).toEqual(user);
  });
});

const generateMockUser = (count = 1) => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.datatype.number(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      isActive: faker.datatype.boolean(),
      createdDate: new Date(),
      updatedDate: new Date(),
    });
  }

  return users;
};
