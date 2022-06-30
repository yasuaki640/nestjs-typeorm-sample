import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { UsersModule } from '../src/users/users.module';
import { generateCreateUserDto } from './faker/users-faker';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  jest.setTimeout(50000);
  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          // sqliteで妥協する
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          logging: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('can persist one user', async () => {
    const expected = await postUser(app);
    const getAllRes: { body: User[] } = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(getAllRes.body.length).toBe(1);
    expect(getAllRes.body[0]).toEqual(expected);
  });

  it('can persist multiple users', async () => {
    const expected: User[] = [];
    for (let i = 0; i < 3; i++) {
      expected.push(await postUser(app));
    }

    const getAllRes: { body: User[] } = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(getAllRes.body.length).toBe(3);
    expect(getAllRes.body[0]).toEqual(expected[0]);
    expect(getAllRes.body[1]).toEqual(expected[1]);
    expect(getAllRes.body[2]).toEqual(expected[2]);
  });

  // MEMO CloseしないとJestが終了しない
  afterEach(async () => {
    await app.close();
    await moduleFixture.close();
  });
});

async function postUser(app: INestApplication): Promise<User> {
  const postRes1 = await request(app.getHttpServer())
    .post('/users')
    .send(generateCreateUserDto());

  return postRes1.body;
}
