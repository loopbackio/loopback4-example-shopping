// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingKey} from '@loopback/core';
import {
  RepositoryMixin,
  SchemaMigrationOptions,
  model,
  property,
} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {MyAuthenticationSequence} from './sequence';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {
  TokenServiceBindings,
  UserServiceBindings,
  TokenServiceConstants,
  PasswordHasherBindings,
} from './keys';
import {JWTService} from './services/jwt-service';
import {MyUserService} from './services/user-service';
import _ from 'lodash';
import path from 'path';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BcryptHasher} from './services/hash.password.bcryptjs';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';
import {SECURITY_SCHEME_SPEC} from './utils/security-spec';
import {AuthorizationComponent} from '@loopback/authorization';
import {
  ProductRepository,
  UserRepository,
  ShoppingCartRepository,
  OrderRepository,
} from './repositories';
import YAML = require('yaml');
import fs from 'fs';
import {User} from './models';

/**
 * Information from package.json
 */
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');

@model()
export class NewUser extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class ShoppingApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options?: ApplicationConfig) {
    super(options);

    /*
       This is a workaround until an extension point is introduced
       allowing extensions to contribute to the OpenAPI specification
       dynamically.
    */
    this.api({
      openapi: '3.0.0',
      info: {title: pkg.name, version: pkg.version},
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      servers: [{url: '/'}],
    });

    this.setUpBindings();

    // Bind authentication component related elements
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    // authentication
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    // Set up the custom sequence
    this.sequence(MyAuthenticationSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {
    // Bind package.json to the application context
    this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }

  async start() {
    // Use `databaseSeeding` flag to control if products/users should be pre
    // populated into the database. Its value is default to `true`.
    if (this.options.databaseSeeding !== false) {
      await this.migrateSchema();
    }
    return super.start();
  }

  async migrateSchema(options?: SchemaMigrationOptions) {
    await super.migrateSchema(options);

    // Pre-populate products
    const productRepo = await this.getRepository(ProductRepository);
    await productRepo.deleteAll();
    const productsDir = path.join(__dirname, '../fixtures/products');
    const productFiles = fs.readdirSync(productsDir);

    for (const file of productFiles) {
      if (file.endsWith('.yml')) {
        const productFile = path.join(productsDir, file);
        const yamlString = fs.readFileSync(productFile, 'utf8');
        const product = YAML.parse(yamlString);
        await productRepo.create(product);
      }
    }

    // Pre-populate users
    const passwordHasher = await this.get(
      PasswordHasherBindings.PASSWORD_HASHER,
    );
    const userRepo = await this.getRepository(UserRepository);
    await userRepo.deleteAll();
    const usersDir = path.join(__dirname, '../fixtures/users');
    const userFiles = fs.readdirSync(usersDir);

    for (const file of userFiles) {
      if (file.endsWith('.yml')) {
        const userFile = path.join(usersDir, file);
        const yamlString = YAML.parse(fs.readFileSync(userFile, 'utf8'));
        const input = new NewUser(yamlString);
        const password = await passwordHasher.hashPassword(input.password);
        input.password = password;
        const user = await userRepo.create(_.omit(input, 'password'));

        await userRepo.userCredentials(user.id).create({password});
      }
    }

    // Delete existing shopping carts
    const cartRepo = await this.getRepository(ShoppingCartRepository);
    await cartRepo.deleteAll();

    // Delete existing orders
    const orderRepo = await this.getRepository(OrderRepository);
    await orderRepo.deleteAll();
  }
}
