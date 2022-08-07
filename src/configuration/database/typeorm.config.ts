import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class TypeOrmConfigOptions implements TypeOrmOptionsFactory {
  createTypeOrmOptions(
    _connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } =
      process.env
    if (!process.env.DB_USER || !process.env.DB_PASS) {
      console.log(
        'Error with database connection, environment variables is not found',
      )
    }
    return {
      type: 'postgres',
      host: DB_HOST,
      port: parseInt(DB_PORT) || 5432,
      username: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      migrations: [`${__dirname}/../../**/*.migration{.ts,.js}`],
      entities: [User],
      synchronize: true
    }
  }
}
