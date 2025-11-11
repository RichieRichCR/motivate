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

export const endpoints = {
  user: (userId?: string) => `${apiUrl}/api/v1/user/${userId}`,
  userGoals: (userId: string) => `${apiUrl}/api/v1/user/${userId}/goals`,
  userMeasurements: ({
    userId,
    measurementId,
    startDate,
    endDate,
  }: {
    userId: string;
    measurementId: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const params: URLSearchParams = new URLSearchParams();
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    return `${apiUrl}/api/v1/user/${userId}/measurements/${measurementId}?${params.toString()}`;
  },
  metrics: `${apiUrl}/api/v1/metrics`,
  metricById: (id: number) => `${apiUrl}/api/v1/metrics/${id}`,
};

type FetcherClient = <T>(endpoint: string, options?: RequestInit) => Promise<T>;

export const fetcher: FetcherClient = async <T>(
  url: string,
  options?: RequestInit,
) => {
  console.log('Fetching URL:', url);
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      ...options?.headers,
    },
  });

  return handleResponse<UserDataPostResponse>(response, url) as Promise<T>;
};

export const api = {
  user: {
    async get(userId: string): Promise<UserDataResponse> {
      return fetcher<UserDataResponse>(endpoints.user(userId));
    },
    async post(data: {
      userId: string;
      metricTypeId: number;
      value: number;
      measuredAt: string;
      source: string;
    }): Promise<UserDataPostResponse> {
      const opts = {
        method: 'POST',
        body: JSON.stringify(data),
      };
      return fetcher<UserDataPostResponse>(endpoints.user(), opts);
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
        const opts = {
          next: {
            revalidate: 60,
            tags: ['metric', `metric:${userId}:${measurementId}`],
          },
        };
        return fetcher<UserDataResponse>(
          endpoints.userMeasurements({
            userId,
            measurementId,
            startDate,
            endDate,
          }),
          opts,
        );
      },
    },
    goals: {
      async get(userId: string): Promise<UserGoalsResponse> {
        const opts = {
          next: { revalidate: 60, tags: ['metric', `metric:${userId}`] },
        };
        return fetcher<UserGoalsResponse>(endpoints.userGoals(userId), opts);
      },
    },
  },
  metrics: {
    async get(): Promise<MetricSchemaResponse> {
      const opts = {
        next: { revalidate: 60, tags: ['metric', `metric`] },
      };
      return fetcher<MetricSchemaResponse>(endpoints.metrics, opts);
    },
    async getById(id: number): Promise<MetricSchemaResponse> {
      const opts = {
        next: { revalidate: 60, tags: ['metric', `metric:${id}`] },
      };
      return fetcher<MetricSchemaResponse>(endpoints.metricById(id), opts);
    },
    async post(data: {
      name: string;
      unit: string;
      description: string;
    }): Promise<CreateMetricResponse> {
      const opts = {
        method: 'POST',
        body: JSON.stringify(data),
      };
      return fetcher<CreateMetricResponse>(endpoints.metrics, opts);
    },
  },
};
