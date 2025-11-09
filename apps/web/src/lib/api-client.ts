import {
  UserDataResponse,
  UserDataPostResponse,
  UserGoalsResponse,
  MetricSchemaResponse,
  CreateMetricResponse,
} from '@repo/api/types';
import { createLogger } from '@repo/logger';

const logger = createLogger('api-client');

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
const apiKey = process.env.API_KEY || '';

/**
 * Custom API Error class for better error handling
 */
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handles fetch responses and throws appropriate errors
 */
async function handleResponse<T>(
  response: Response,
  endpoint: string,
): Promise<T> {
  if (!response.ok) {
    const errorMessage = `API Error: ${response.status} ${response.statusText}`;
    logger.error({
      msg: errorMessage,
      endpoint,
      status: response.status,
      statusText: response.statusText,
    });

    throw new ApiError(errorMessage, response.status, endpoint);
  }

  try {
    return await response.json();
  } catch (error) {
    logger.error({
      msg: 'Failed to parse API response',
      endpoint,
      error,
    });
    throw new ApiError('Invalid response format from API', 500, endpoint);
  }
}

export const api = {
  user: {
    async get(userId: string): Promise<UserDataResponse> {
      const endpoint = `/api/v1/user/${userId}`;
      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          'x-api-key': apiKey,
        },
        next: { revalidate: 60, tags: ['metric', `metric:${userId}`] },
      });
      return handleResponse<UserDataResponse>(response, endpoint);
    },
    async post(data: {
      userId: string;
      metricTypeId: number;
      value: number;
      measuredAt: string;
      source: string;
    }): Promise<UserDataPostResponse> {
      const endpoint = '/api/v1/user';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(data),
      });
      return handleResponse<UserDataPostResponse>(response, endpoint);
    },
    measurements: {
      async getById({
        userId,
        measurementId,
        startDate,
        endDate,
      }: {
        userId: string;
        measurementId: number;
        startDate?: string;
        endDate?: string;
      }): Promise<UserDataResponse> {
        const params: URLSearchParams = new URLSearchParams();
        if (startDate) {
          params.append('startDate', startDate);
        }
        if (endDate) {
          params.append('endDate', endDate);
        }

        const endpoint = `/api/v1/user/${userId}/measurements/${measurementId}?${params.toString()}`;
        const response = await fetch(`${apiUrl}${endpoint}`, {
          headers: {
            'x-api-key': apiKey,
          },
          next: {
            revalidate: 60,
            tags: ['metric', `metric:${userId}:${measurementId}`],
          },
        });
        return handleResponse<UserDataResponse>(response, endpoint);
      },
    },
    goals: {
      async get(userId: string): Promise<UserGoalsResponse> {
        const endpoint = `/api/v1/user/${userId}/goals`;
        const response = await fetch(`${apiUrl}${endpoint}`, {
          headers: {
            'x-api-key': apiKey,
          },
          next: { revalidate: 60, tags: ['metric', `metric:${userId}`] },
        });
        return handleResponse<UserGoalsResponse>(response, endpoint);
      },
    },
  },
  metrics: {
    async get(): Promise<MetricSchemaResponse> {
      const endpoint = '/api/v1/metrics';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          'x-api-key': apiKey,
        },
        next: { revalidate: 60, tags: ['metric', `metric`] },
      });
      return handleResponse<MetricSchemaResponse>(response, endpoint);
    },
    async getById(id: number): Promise<MetricSchemaResponse> {
      const endpoint = `/api/v1/metrics/${id}`;
      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          'x-api-key': apiKey,
        },
        next: { revalidate: 60, tags: ['metric', `metric:${id}`] },
      });
      return handleResponse<MetricSchemaResponse>(response, endpoint);
    },
    async post(data: {
      name: string;
      unit: string;
      description: string;
    }): Promise<CreateMetricResponse> {
      const endpoint = '/api/v1/metrics';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(data),
      });
      return handleResponse<CreateMetricResponse>(response, endpoint);
    },
  },
};
