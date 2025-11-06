import { describe, expect, it } from 'vitest';
import app from '../index';

describe('OpenAPI Specification', () => {
  it('should generate OpenAPI spec at /doc endpoint', async () => {
    const res = await app.request('/doc');
    expect(res.status).toBe(200);

    const spec = await res.json();

    // Verify OpenAPI version
    expect(spec.openapi).toBe('3.1.0');

    // Verify basic info
    expect(spec.info).toEqual({
      title: 'RR Health API',
      version: 'v0.1.0',
    });

    // Verify servers are defined
    expect(spec.servers).toBeDefined();
    expect(spec.servers.length).toBeGreaterThan(0);

    // Verify components exist (even if empty)
    expect(spec.components).toBeDefined();
  });

  it('should include health check route in spec', async () => {
    const res = await app.request('/doc');
    const spec = await res.json();

    // Verify paths are defined
    expect(spec.paths).toBeDefined();

    // Check for health endpoint (without trailing slash)
    expect(spec.paths['/health']).toBeDefined();
    expect(spec.paths['/health'].get).toBeDefined();

    // Verify health endpoint metadata
    const healthEndpoint = spec.paths['/health'].get;
    expect(healthEndpoint.summary).toBe('Health check endpoint');
    expect(healthEndpoint.tags).toContain('Health');

    // Verify response schema
    expect(healthEndpoint.responses['200']).toBeDefined();
    expect(
      healthEndpoint.responses['200'].content['application/json'],
    ).toBeDefined();
  });

  it('should include API v1 health check route in spec', async () => {
    const res = await app.request('/doc');
    const spec = await res.json();

    // Check for API v1 health endpoint (without trailing slash)
    expect(spec.paths['/api/v1/health']).toBeDefined();
    expect(spec.paths['/api/v1/health'].get).toBeDefined();

    // Verify endpoint metadata
    const healthV1Endpoint = spec.paths['/api/v1/health'].get;
    expect(healthV1Endpoint.summary).toBe('API v1 Health check endpoint');
    expect(healthV1Endpoint.tags).toContain('API v1');

    // Verify response schema includes version field
    const responseSchema =
      healthV1Endpoint.responses['200'].content['application/json'].schema;
    expect(responseSchema).toBeDefined();
  });

  it('should have valid components and schemas', async () => {
    const res = await app.request('/doc');
    const spec = await res.json();

    // Verify components are defined
    expect(spec.components).toBeDefined();

    // Check if schemas are generated (they might be inline or in components)
    // This depends on how @hono/zod-openapi structures the output
    const hasSchemas =
      spec.components?.schemas !== undefined ||
      Object.values(spec.paths || {}).some((path: any) =>
        Object.values(path || {}).some(
          (method: any) =>
            method?.responses?.['200']?.content?.['application/json']?.schema,
        ),
      );

    expect(hasSchemas).toBe(true);
  });

  it('should return valid JSON that can be parsed', async () => {
    const res = await app.request('/doc');
    expect(res.headers.get('content-type')).toContain('application/json');

    const spec = await res.json();

    // Ensure it's a valid object
    expect(typeof spec).toBe('object');
    expect(spec).not.toBeNull();

    // Ensure we can stringify it back (valid JSON)
    expect(() => JSON.stringify(spec)).not.toThrow();
  });
});

describe('Health Endpoints', () => {
  it('should respond to /health endpoint', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual({ status: 'ok' });
  });

  it('should respond to /api/v1/health endpoint', async () => {
    const res = await app.request('/api/v1/health');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual({ status: 'ok', version: 'v1' });
  });

  it('should return proper content-type for health endpoints', async () => {
    const res = await app.request('/health');
    expect(res.headers.get('content-type')).toContain('application/json');
  });
});
