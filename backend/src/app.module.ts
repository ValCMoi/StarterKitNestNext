import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/role.guard';

const dotenv = require('dotenv');
dotenv.config()


const configConnectionDB:TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: 3306,// Number(process.env.MYSQL_PORT_EXPOSE),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_USER_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true
}
console.log("Configuration connection")
console.table(configConnectionDB)

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot(configConnectionDB),
    UserModule,
    AuthModule,
    ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
