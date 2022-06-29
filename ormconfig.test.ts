import { DataSourceOptions } from 'typeorm';

const ormconfigForTest: DataSourceOptions = {
  type: 'mysql',
  host: 'db',
  port: parseInt(process.env.DB_PORT, 10),
  username: 'nest',
  password: 'nest',
  database: 'nest',
  synchronize: true,
  logging: true,
  // see https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module
  // see https://stackoverflow.com/questions/63109954/running-e2e-tests-with-jest-nestjs
  entities: [__dirname + '/**/*.entity.{ts.js}'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  timezone: '+09:00',
};

export default ormconfigForTest;
