import * as casbin from 'casbin';
import * as path from 'path';

export async function createEnforcer() {
  const conf = path.resolve(__dirname, '../fixtures/casbin/rbac_model.conf');
  const policy = path.resolve(__dirname, '../fixtures/casbin/rbac_policy.csv');
  return await casbin.newEnforcer(conf, policy);
}
