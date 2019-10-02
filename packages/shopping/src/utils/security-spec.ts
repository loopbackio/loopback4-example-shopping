import { SecuritySchemeObject, ReferenceObject } from "@loopback/openapi-v3";

export const SECURITY_SPEC = [{bearerAuth: []}];
export const SECURITY_SPEC_OPERATION = [{basicAuth: []}];
export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
}
export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
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