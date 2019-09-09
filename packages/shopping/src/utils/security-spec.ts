import {OpenApiSpec} from '@loopback/rest';

export const SECURITY_SPEC = [{bearerAuth: []}];
export const BEARER_SECURITY_SCHEMA_SPEC = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};

export function addSecuritychema(schema: OpenApiSpec) {
  schema.components = schema.components || {};
  Object.assign(schema.components, BEARER_SECURITY_SCHEMA_SPEC);
  Object.assign(schema, {security: SECURITY_SPEC});
}
