export const SECURITY_SPEC = [{bearerAuth: []}];
export const SECURITY_SPEC_OPERATION = [{basicAuth: []}];
export const SECURITY_SCHEMA_SPEC = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
  basicAuth: {
    type: 'http',
    scheme: 'basic',
  },
};
