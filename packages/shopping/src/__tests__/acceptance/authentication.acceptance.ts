// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {TokenService, UserService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {HttpErrors} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {expect} from '@loopback/testlab';
import _ from 'lodash';
import {Suite} from 'mocha';
import {ShoppingApplication} from '../..';
import {PasswordHasherBindings, UserServiceBindings} from '../../keys';
import {UserWithPassword, User} from '../../models';
import {Credentials, UserRepository} from '../../repositories';
import {
  UserManagementService,
  PasswordHasher,
  validateCredentials,
} from '../../services';
import {setupApplication} from './helper';

describe('authentication services', function (this: Suite) {
  this.timeout(5000);
  let app: ShoppingApplication;

  const userData = {
    email: 'unittest@loopback.io',
    firstName: 'unit',
    lastName: 'test',
    roles: ['customer'],
  };

  const userPassword = 'p4ssw0rd';

  let user: User;
  let jwtService: TokenService;
  let userService: UserService<User, Credentials>;
  let bcryptHasher: PasswordHasher;
  let userManagementService: UserManagementService;

  before(setupApp);
  after(async () => {
    if (app != null) await app.stop();
  });

  let userRepo: UserRepository;
  before(async () => {
    userRepo = await app.get('repositories.UserRepository');
    userManagementService = await app.get('services.user.service');
  });

  before(clearDatabase);
  before(createUser);
  before(createTokenService);
  before(createUserService);

  it('validateCredentials() succeeds', () => {
    const credentials = {email: 'dom@example.com', password: 'p4ssw0rd'};
    expect(() => validateCredentials(credentials)).to.not.throw();
  });

  it('validateCredentials() fails with invalid email', () => {
    const expectedError = new HttpErrors.UnprocessableEntity('invalid email');
    const credentials = {email: 'domdomdom', password: 'p4ssw0rd'};
    expect(() => validateCredentials(credentials)).to.throw(expectedError);
  });

  it('validateCredentials() fails with invalid password', () => {
    const expectedError = new HttpErrors.UnprocessableEntity(
      'password must be minimum 8 characters',
    );
    const credentials = {email: 'dom@example.com', password: 'p4ss'};
    expect(() => validateCredentials(credentials)).to.throw(expectedError);
  });

  it('user service verifyCredentials() succeeds', async () => {
    const {email} = user;
    const credentials = {email, password: userPassword};

    const returnedUser = await userService.verifyCredentials(credentials);

    // create a copy of returned user without password field
    const returnedUserWithOutPassword = _.omit(returnedUser, 'password');

    // create a copy of expected user without password field
    const expectedUserWithoutPassword = _.omit(user, 'password');

    expect(returnedUserWithOutPassword).to.deepEqual(
      expectedUserWithoutPassword,
    );
  });

  it('user service verifyCredentials() fails with user not found', async () => {
    const credentials = {email: 'idontexist@example.com', password: 'p4ssw0rd'};

    const expectedError = new HttpErrors.Unauthorized(
      'Invalid email or password.',
    );

    await expect(userService.verifyCredentials(credentials)).to.be.rejectedWith(
      expectedError,
    );
  });

  it('user service verifyCredentials() fails with incorrect credentials', async () => {
    const {email} = user;
    const credentials = {email, password: 'invalidp4ssw0rd'};
    const expectedError = new HttpErrors.Unauthorized(
      'Invalid email or password.',
    );

    await expect(userService.verifyCredentials(credentials)).to.be.rejectedWith(
      expectedError,
    );
  });

  it('user service convertToUserProfile() succeeds', () => {
    const expectedUserProfile = {
      [securityId]: user.id,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      roles: ['customer'],
    };
    const userProfile = userService.convertToUserProfile(user);
    expect(userProfile).to.deepEqual(expectedUserProfile);
  });

  it('user service convertToUserProfile() succeeds without optional fields : firstName, lastName', () => {
    const userWithoutFirstOrLastName = Object.assign({}, user);
    delete userWithoutFirstOrLastName.firstName;
    delete userWithoutFirstOrLastName.lastName;

    const userProfile = userService.convertToUserProfile(
      userWithoutFirstOrLastName,
    );
    expect(userProfile[securityId]).to.equal(user.id);
    expect(userProfile.name).to.equal('');
  });

  it('user service convertToUserProfile() succeeds without optional field : lastName', () => {
    const userWithoutLastName = Object.assign({}, user);
    delete userWithoutLastName.lastName;

    const userProfile = userService.convertToUserProfile(userWithoutLastName);
    expect(userProfile[securityId]).to.equal(user.id);
    expect(userProfile.name).to.equal(user.firstName);
  });

  it('user service convertToUserProfile() succeeds without optional field : firstName', () => {
    const userWithoutFirstName = Object.assign({}, user);
    delete userWithoutFirstName.firstName;

    const userProfile = userService.convertToUserProfile(userWithoutFirstName);
    expect(userProfile[securityId]).to.equal(user.id);
    expect(userProfile.name).to.equal(user.lastName);
  });

  it('token service generateToken() succeeds', async () => {
    const userProfile = userService.convertToUserProfile(user);
    const token = await jwtService.generateToken(userProfile);
    expect(token).to.not.be.empty();
  });

  it('token service verifyToken() succeeds', async () => {
    const userProfile = userService.convertToUserProfile(user);
    const token = await jwtService.generateToken(userProfile);
    const userProfileFromToken = await jwtService.verifyToken(token);

    expect(userProfileFromToken).to.deepEqual(userProfile);
  });

  it('token service verifyToken() fails', async () => {
    const expectedError = new HttpErrors.Unauthorized(
      `Error verifying token : invalid token`,
    );
    const invalidToken = 'aaa.bbb.ccc';
    await expect(jwtService.verifyToken(invalidToken)).to.be.rejectedWith(
      expectedError,
    );
  });

  it('password encrypter hashPassword() succeeds', async () => {
    const encrypedPassword = await bcryptHasher.hashPassword(userPassword);
    expect(encrypedPassword).to.not.equal(userPassword);
  });

  it('password encrypter compare() succeeds', async () => {
    const encrypedPassword = await bcryptHasher.hashPassword(userPassword);
    const passwordsAreTheSame = await bcryptHasher.comparePassword(
      userPassword,
      encrypedPassword,
    );
    expect(passwordsAreTheSame).to.be.True();
  });

  it('password encrypter compare() fails', async () => {
    const encrypedPassword = await bcryptHasher.hashPassword(userPassword);
    const passwordsAreTheSame = await bcryptHasher.comparePassword(
      'someotherpassword',
      encrypedPassword,
    );
    expect(passwordsAreTheSame).to.be.False();
  });

  async function setupApp() {
    const appWithClient = await setupApplication();
    app = appWithClient.app;
    app.bind(PasswordHasherBindings.ROUNDS).to(2);
  }

  async function createUser() {
    bcryptHasher = await app.get(PasswordHasherBindings.PASSWORD_HASHER);
    const userWithPassword = new UserWithPassword(userData);
    userWithPassword.password = userPassword;
    user = await userManagementService.createUser(userWithPassword);
  }

  async function clearDatabase() {
    await userRepo.deleteAll();
  }

  async function createTokenService() {
    jwtService = await app.get(TokenServiceBindings.TOKEN_SERVICE);
  }

  async function createUserService() {
    userService = await app.get(UserServiceBindings.USER_SERVICE);
  }
});
