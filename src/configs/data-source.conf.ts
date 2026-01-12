import { DataSource } from 'typeorm';
import appConf from './app.conf';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: appConf.PG_HOST,
    port: appConf.PG_PORT,
    username: appConf.PG_USER,
    password: appConf.PG_PASS,
    database: appConf.PG_DB,
    entities: [__dirname + '/../**/*.entity{.ts,.js}', __dirname + '/../commons/bases/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../databases/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: false, // appConf.NODE_ENV !== 'production',
});
