// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {validateCredentials} from '../../services/validator';
import {ShoppingApplication} from '../..';
import {PasswordHasher} from '../../services/hash.password.bcryptjs';
import {UserRepository, Credentials} from '../../repositories';
import {User} from '../../models';
import {HttpErrors} from '@loopback/rest';
import {
  PasswordHasherBindings,
  UserServiceBindings,
  TokenServiceBindings,
} from '../../keys';
import {setupApplication} from './helper';
import {TokenService, UserService} from '@loopback/authentication';
import {securityId} from '@loopback/security';

describe('authentication services', () => {
  let app: ShoppingApplication;

  const user = {
    email: 'unittest@loopback.io',
    password: 'p4ssw0rd',
    firstName: 'unit',
    lastName: 'test',
  };

  let newUser: User;
  let jwtService: TokenService;
  let userService: UserService<User, Credentials>;
  let bcryptHasher: PasswordHasher;

  before(setupApp);
  after(async () => {
    await app.stop();
  });

  let userRepo: UserRepository;
  before(async () => {
    userRepo = await app.get('repositories.UserRepository');
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
    const {email} = newUser;
    const credentials = {email, password: user.password};

    const returnedUser = await userService.verifyCredentials(credentials);

    // create a copy of returned user without password field
    const returnedUserWithOutPassword = Object.assign({}, returnedUser, {
      password: user.password,
    });
    delete returnedUserWithOutPassword.password;

    // create a copy of expected user without password field
    const expectedUserWithoutPassword = Object.assign({}, newUser);
    delete expectedUserWithoutPassword.password;

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
    const {email} = newUser;
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
      [securityId]: newUser.id,
      name: `${newUser.firstName} ${newUser.lastName}`,
    };
    const userProfile = userService.convertToUserProfile(newUser);
    expect(expectedUserProfile).to.deepEqual(userProfile);
  });

  it('user service convertToUserProfile() succeeds without optional fields : firstName, lastName', () => {
    const userWithoutFirstOrLastName = Object.assign({}, newUser);
    delete userWithoutFirstOrLastName.firstName;
    delete userWithoutFirstOrLastName.lastName;

    const userProfile = userService.convertToUserProfile(
      userWithoutFirstOrLastName,
    );
    expect(userProfile[securityId]).to.equal(newUser.id);
    expect(userProfile.name).to.equal('');
  });

  it('user service convertToUserProfile() succeeds without optional field : lastName', () => {
    const userWithoutLastName = Object.assign({}, newUser);
    delete userWithoutLastName.lastName;

    const userProfile = userService.convertToUserProfile(userWithoutLastName);
    expect(userProfile[securityId]).to.equal(newUser.id);
    expect(userProfile.name).to.equal(newUser.firstName);
  });

  it('user service convertToUserProfile() succeeds without optional field : firstName', () => {
    const userWithoutFirstName = Object.assign({}, newUser);
    delete userWithoutFirstName.firstName;

    const userProfile = userService.convertToUserProfile(userWithoutFirstName);
    expect(userProfile[securityId]).to.equal(newUser.id);
    expect(userProfile.name).to.equal(newUser.lastName);
  });

  it('token service generateToken() succeeds', async () => {
    const userProfile = userService.convertToUserProfile(newUser);
    const token = await jwtService.generateToken(userProfile);
    expect(token).to.not.be.empty();
  });

  it('token service verifyToken() succeeds', async () => {
    const userProfile = userService.convertToUserProfile(newUser);
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
    const encrypedPassword = await bcryptHasher.hashPassword(user.password);
    expect(encrypedPassword).to.not.equal(user.password);
  });

  it('password encrypter compare() succeeds', async () => {
    const encrypedPassword = await bcryptHasher.hashPassword(user.password);
    const passwordsAreTheSame = await bcryptHasher.comparePassword(
      user.password,
      encrypedPassword,
    );
    expect(passwordsAreTheSame).to.be.True();
  });

  it('password encrypter compare() fails', async () => {
    const encrypedPassword = await bcryptHasher.hashPassword(user.password);
    const passwordsAreTheSame = await bcryptHasher.comparePassword(
      'someotherpassword',
      encrypedPassword,
    );
    expect(passwordsAreTheSame).to.be.False();
  });

  async function setupApp() {
    const appWithClient = await setupApplication();
    app = appWithClient.app;
    app.bind(PasswordHasherBindings.ROUNDS).to(4);
  }

  async function createUser() {
    bcryptHasher = await app.get(PasswordHasherBindings.PASSWORD_HASHER);
    const encryptedPassword = await bcryptHasher.hashPassword(user.password);
    newUser = await userRepo.create(
      Object.assign({}, user, {password: encryptedPassword}),
    );
    // MongoDB returns an id object we need to convert to string
    newUser.id = newUser.id.toString();
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
