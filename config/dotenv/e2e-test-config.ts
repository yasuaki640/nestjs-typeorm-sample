import * as dotenv from 'dotenv';
import * as path from 'path';

// できれば環境変数を上書きするオプションがほしいところ
// https://github.com/motdotla/dotenv/issues/517
const testEnv = dotenv.config({
  path: path.join(process.cwd(), '.env.testing'),
});

// 明示的に環境変数を上書き
Object.assign(process.env, {
  ...testEnv.parsed,
});
