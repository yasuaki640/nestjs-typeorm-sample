import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfigForTest from '../ormconfig.test';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  jest.setTimeout(100000);
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRoot(ormconfigForTest)],
    }).compile();

    app = await moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
    return res;
  });
});
