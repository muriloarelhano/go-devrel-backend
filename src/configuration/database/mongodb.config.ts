import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Form } from "src/forms/entities/form.entity";


@Injectable()
export class MongodbTypeOrmConfigOptions implements TypeOrmOptionsFactory {
  createTypeOrmOptions(
    _connectionName?: string
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const {
      MONGO_DB_HOST,
      MONGO_DB_USER,
      MONGO_DB_PASS,
      MONGO_DB_PORT,
      MONGO_DB_NAME,
      NODE_ENV
    } = process.env;
    if (!process.env.MONGO_DB_USER || !process.env.MONGO_DB_PASS) {
      console.log(
        "Error with mongodb connection, environment variables is not found"
      );
    }

    if (NODE_ENV === 'production') {
      return {
        type: "mongodb",
        url: `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASS}@${MONGO_DB_HOST}/?retryWrites=true`,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        logging: true,
        entities: [Form],
      };
    } else {
      return {
        type: "mongodb",
        host: MONGO_DB_HOST,
        port: parseInt(MONGO_DB_PORT, 10) || 5432,
        username: MONGO_DB_USER,
        password: MONGO_DB_PASS,
        database: MONGO_DB_NAME,
        authSource: "admin",
        useUnifiedTopology: true,
        logging: true,
        entities: [Form],
      };
    }
  }
}
