import {Provider, inject} from '@loopback/core';
import {
  Authorizer,
  AuthorizationContext,
  AuthorizationMetadata,
  AuthorizationRequest,
  AuthorizationDecision,
} from '@loopback/authorization';
import {inspect} from 'util';
import * as casbin from 'casbin';

// Class level authorizer
export class CasbinAuthorizationProvider implements Provider<Authorizer> {
  constructor(@inject('casbin.enforcer') private enforcer: casbin.Enforcer) {}

  /**
   * @returns authenticateFn
   */
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    // @jannyHou: make sure it's universal for authorizers
    authorizationCtx: AuthorizationContext,
    // @jannyHou: make sure it's universal for authorizers
    metadata: AuthorizationMetadata,
  ) {
    const request: AuthorizationRequest = {
      subject: authorizationCtx.principals[0].name,
      object: metadata.resource || authorizationCtx.resource,
      action: (metadata.scopes && metadata.scopes[0]) || 'execute',
    };

    const allow = await this.enforcer.enforce(
      request.subject,
      request.object,
      request.action,
    );
    if (allow) return AuthorizationDecision.ALLOW;
    else if (allow === false) return AuthorizationDecision.DENY;
    return AuthorizationDecision.ABSTAIN;
  }
}
