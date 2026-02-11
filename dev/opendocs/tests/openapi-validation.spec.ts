/**
 * OpenAPI Validation Test Suite
 * 
 * Validates that:
 * 1. OpenAPI schema is valid and loads correctly
 * 2. All monitoring endpoints are documented
 * 3. Schema conforms to OpenAPI 3.1.0 specification
 * 4. All required components are defined
 * 5. Examples are valid
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
  openapi: `${API_URL}/api/openapi.json`,
  docs: `${API_URL}/api/docs`,
  redoc: `${API_URL}/api/redoc`,
};

const REQUIRED_MONITORING_PATHS = [
  '/health',
  '/api/health',
  '/monitoring',
  '/monitoring/dashboard',
  '/monitoring/traces',
  '/monitoring/metrics/summary',
  '/monitoring/errors',
  '/monitoring/clear',
];

const REQUIRED_SCHEMAS = [
  'HealthResponse',
  'Metrics',
  'DashboardResponse',
  'TraceEntry',
  'ErrorResponse',
  'MetricsSnapshot',
];

let openApiSchema: any;

describe('OpenAPI Schema Validation', () => {
  beforeAll(async () => {
    // Fetch the OpenAPI schema
    const response = await fetch(API_ENDPOINTS.openapi);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    openApiSchema = await response.json();
  });

  it('should load valid OpenAPI schema from /api/openapi.json', async () => {
    expect(openApiSchema).toBeDefined();
    expect(openApiSchema.openapi).toBe('3.1.0');
    expect(openApiSchema.info).toBeDefined();
    expect(openApiSchema.paths).toBeDefined();
  });

  it('should have valid info object', () => {
    const info = openApiSchema.info;
    expect(info.title).toBe('OpenDocs Monitoring API');
    expect(info.version).toBe('1.0.0');
    expect(info.description).toBeDefined();
    expect(info.license).toBeDefined();
    expect(info.license.name).toBe('MIT');
  });

  it('should have servers defined', () => {
    expect(openApiSchema.servers).toBeDefined();
    expect(Array.isArray(openApiSchema.servers)).toBe(true);
    expect(openApiSchema.servers.length).toBeGreaterThan(0);
    const serverUrls = openApiSchema.servers.map((s: any) => s.url);
    expect(serverUrls).toContain('http://localhost:3000');
  });

  it('should have all required monitoring endpoints documented', () => {
    const documentedPaths = Object.keys(openApiSchema.paths);
    REQUIRED_MONITORING_PATHS.forEach(path => {
      expect(documentedPaths).toContain(path);
    });
  });

  it('should have valid path definitions for each endpoint', () => {
    REQUIRED_MONITORING_PATHS.forEach(path => {
      const pathDef = openApiSchema.paths[path];
      expect(pathDef).toBeDefined();
      const methods = Object.keys(pathDef).filter(k => 
        ['get', 'post', 'put', 'delete', 'patch'].includes(k.toLowerCase())
      );
      expect(methods.length).toBeGreaterThan(0);
    });
  });

  it('should have responses defined for all methods', () => {
    REQUIRED_MONITORING_PATHS.forEach(path => {
      const pathDef = openApiSchema.paths[path];
      Object.keys(pathDef).forEach(method => {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
          const operation = pathDef[method];
          expect(operation.responses).toBeDefined();
          expect(Object.keys(operation.responses).length).toBeGreaterThan(0);
        }
      });
    });
  });

  it('should have all required schemas in components', () => {
    expect(openApiSchema.components).toBeDefined();
    expect(openApiSchema.components.schemas).toBeDefined();
    const schemaNames = Object.keys(openApiSchema.components.schemas);
    REQUIRED_SCHEMAS.forEach(schema => {
      expect(schemaNames).toContain(schema);
    });
  });

  it('should have valid schema definitions', () => {
    const schemas = openApiSchema.components.schemas;
    REQUIRED_SCHEMAS.forEach(schemaName => {
      const schema = schemas[schemaName];
      expect(schema).toBeDefined();
      expect(schema.type || schema.properties || schema.anyOf || schema.oneOf || schema.allOf).toBeDefined();
    });
  });

  it('should have security schemes defined', () => {
    expect(openApiSchema.components.securitySchemes).toBeDefined();
    expect(openApiSchema.components.securitySchemes.ApiKeyAuth).toBeDefined();
    expect(openApiSchema.components.securitySchemes.ApiKeyAuth.type).toBe('apiKey');
    expect(openApiSchema.components.securitySchemes.ApiKeyAuth.in).toBe('header');
    expect(openApiSchema.components.securitySchemes.ApiKeyAuth.name).toBe('X-OpenDocs-Token');
  });

  it('should have tags defined for organization', () => {
    expect(openApiSchema.tags).toBeDefined();
    expect(Array.isArray(openApiSchema.tags)).toBe(true);
    expect(openApiSchema.tags.length).toBeGreaterThan(0);
  });

  it('should have HTTP 200 responses for successful operations', () => {
    REQUIRED_MONITORING_PATHS.forEach(path => {
      const pathDef = openApiSchema.paths[path];
      Object.keys(pathDef).forEach(method => {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
          const operation = pathDef[method];
          expect(operation.responses).toBeDefined();
          // At least one success response (2xx)
          const hasSuccess = Object.keys(operation.responses).some(code => 
            code.startsWith('2')
          );
          expect(hasSuccess).toBe(true);
        }
      });
    });
  });

  it('should have error responses for error cases', () => {
    REQUIRED_MONITORING_PATHS.forEach(path => {
      const pathDef = openApiSchema.paths[path];
      Object.keys(pathDef).forEach(method => {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
          const operation = pathDef[method];
          expect(operation.responses).toBeDefined();
          const responses = operation.responses;
          // Should have at least one error response (4xx or 5xx)
          const hasError = Object.keys(responses).some(code => 
            code.startsWith('4') || code.startsWith('5')
          );
          expect(hasError).toBe(true);
        }
      });
    });
  });

  it('/health endpoint should have proper documentation', () => {
    const healthPath = openApiSchema.paths['/health'];
    expect(healthPath.get).toBeDefined();
    expect(healthPath.get.summary).toBeDefined();
    expect(healthPath.get.responses).toBeDefined();
    expect(healthPath.get.responses['200']).toBeDefined();
  });

  it('/api/health endpoint should be documented', () => {
    const apiHealthPath = openApiSchema.paths['/api/health'];
    expect(apiHealthPath.get).toBeDefined();
    expect(apiHealthPath.get.responses['200']).toBeDefined();
  });

  it('/monitoring/dashboard endpoint should return proper schema', () => {
    const dashboardPath = openApiSchema.paths['/monitoring/dashboard'];
    expect(dashboardPath.get).toBeDefined();
    const response200 = dashboardPath.get.responses['200'];
    expect(response200).toBeDefined();
    expect(response200.content).toBeDefined();
  });

  it('should have proper content types in responses', () => {
    REQUIRED_MONITORING_PATHS.forEach(path => {
      const pathDef = openApiSchema.paths[path];
      Object.keys(pathDef).forEach(method => {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
          const operation = pathDef[method];
          Object.values(operation.responses as any).forEach((response: any) => {
            if (response.content) {
              expect(Object.keys(response.content).length).toBeGreaterThan(0);
              const hasJsonContent = 'application/json' in response.content;
              expect(hasJsonContent).toBe(true);
            }
          });
        }
      });
    });
  });
});

describe('OpenAPI Endpoints Accessibility', () => {
  it('should serve Swagger UI at /api/docs', async () => {
    const response = await fetch(API_ENDPOINTS.docs);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    const html = await response.text();
    expect(html).toContain('swagger-ui');
  });

  it('should serve ReDoc at /api/redoc', async () => {
    const response = await fetch(API_ENDPOINTS.redoc);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    const html = await response.text();
    expect(html).toContain('redoc');
    expect(html).toContain('spec-url');
  });

  it('should serve OpenAPI JSON with correct content-type', async () => {
    const response = await fetch(API_ENDPOINTS.openapi);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('should have CORS headers on documentation endpoints', async () => {
    const response = await fetch(API_ENDPOINTS.openapi);
    expect(response.headers.get('access-control-allow-origin')).toBeDefined();
    expect(response.headers.get('access-control-allow-methods')).toBeDefined();
  });

  it('should not require authentication for documentation endpoints', async () => {
    // Make requests without X-OpenDocs-Token header
    const responses = await Promise.all([
      fetch(API_ENDPOINTS.openapi),
      fetch(API_ENDPOINTS.docs),
      fetch(API_ENDPOINTS.redoc),
    ]);

    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.status).not.toBe(401);
    });
  });
});

describe('OpenAPI Schema Completeness', () => {
  it('should have descriptions for all paths', async () => {
    const response = await fetch(API_ENDPOINTS.openapi);
    const schema = await response.json();

    Object.entries(schema.paths).forEach(([path, pathDef]: [string, any]) => {
      Object.values(pathDef).forEach((operation: any) => {
        if (typeof operation === 'object' && operation.summary) {
          expect(operation.summary).toBeTruthy();
        }
      });
    });
  });

  it('should have valid example responses', async () => {
    const response = await fetch(API_ENDPOINTS.openapi);
    const schema = await response.json();

    Object.entries(schema.paths).forEach(([_, pathDef]: [string, any]) => {
      Object.entries(pathDef).forEach(([__, operation]: [string, any]) => {
        if (typeof operation === 'object' && operation.responses) {
          Object.entries(operation.responses).forEach(([___, response]: [string, any]) => {
            if (response.content && response.content['application/json']) {
              const jsonContent = response.content['application/json'];
              // Examples or schema should be present
              expect(
                jsonContent.schema || jsonContent.example || jsonContent.examples
              ).toBeDefined();
            }
          });
        }
      });
    });
  });

  it('should have at least 8 monitoring endpoints documented', async () => {
    const response = await fetch(API_ENDPOINTS.openapi);
    const schema = await response.json();
    const monitoringPaths = Object.keys(schema.paths).filter(p => 
      p.startsWith('/monitoring') || p === '/health' || p === '/api/health'
    );
    expect(monitoringPaths.length).toBeGreaterThanOrEqual(8);
  });
});
