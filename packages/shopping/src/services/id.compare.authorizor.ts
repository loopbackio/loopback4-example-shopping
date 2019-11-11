import {AuthorizationContext, AuthorizationMetadata, AuthorizationRequest, AuthorizationDecision} from '@loopback/authorization';
import * as _ from 'lodash';
import { UserProfile } from '@loopback/authentication';

interface MyAuthorizationMetadata extends AuthorizationMetadata {
  currentUser?: UserProfile,
  decision?: AuthorizationDecision
}

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function compareId(
  authorizationCtx: AuthorizationContext,
  metadata: MyAuthorizationMetadata,
) {
  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    currentUser = _.pick(authorizationCtx.principals[0], ['id', 'name', 'email']);
  } else {
    return AuthorizationDecision.DENY;
  }

  // A workaround to bypass the authorizer priority
  // class level authorizer should have higher priority than the instance level one
  // which means the DENY returned in this function will be ignored when the global authorizer
  // says ALLOW
  if (currentUser && currentUser.name == 'customer_service') return AuthorizationDecision.ALLOW;

  const userId = authorizationCtx.invocationContext.args[0];
  return userId == currentUser.id ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;
}