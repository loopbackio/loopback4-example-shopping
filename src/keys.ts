import {BindingKey} from '@loopback/context';
import {JWTAuthenticationService} from './services/JWT.authentication.service';
import {HashPassword} from './services/hash.password.bcryptjs';
import {JWTStrategy} from './authentication-strategies/JWT.strategy';

// Discussion point for reviewers:
// What would be the good naming conversion for bindings?
export namespace JWTAuthenticationBindings {
  export const STRATEGY = BindingKey.create<JWTStrategy>(
    'authentication.strategies.jwt.strategy',
  );
  export const SECRET = BindingKey.create<string>('authentication.jwt.secret');
  export const SERVICE = BindingKey.create<JWTAuthenticationService>(
    'services.authentication.jwt.service',
  );
}

export namespace OtherServicesBindings {
  export const HASH_PASSWORD = BindingKey.create<HashPassword>(
    'services.hash_password',
  );
}
