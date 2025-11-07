import {
  UserDataResponse,
  UserDataPostResponse,
  UserGoalsResponse,
  MetricSchemaResponse,
  CreateMetricResponse,
} from '@repo/api/types';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
const apiKey = process.env.API_KEY || '';

export const api = {
  user: {
    async get(userId: string): Promise<UserDataResponse> {
      const response = await fetch(`${apiUrl}/api/v1/user/${userId}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.statusText}`);
      }
      return response.json() satisfies Promise<UserDataResponse>;
    },
    async post(data: {
      userId: string;
      metricTypeId: number;
      value: number;
      measuredAt: string;
      source: string;
    }): Promise<UserDataPostResponse> {
      const response = await fetch(`${apiUrl}/api/v1/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.statusText}`);
      }
      return response.json();
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

        const response = await fetch(
          `${apiUrl}/api/v1/user/${userId}/measurements/${measurementId}?${params.toString()}`,
          {
            headers: {
              'x-api-key': apiKey,
            },
          },
        );
        if (!response.ok) {
          throw new Error(
            `Error fetching user measurement: ${response.statusText}`,
          );
        }
        return response.json() satisfies Promise<UserDataResponse>;
      },
    },
    goals: {
      async get(userId: string): Promise<UserGoalsResponse> {
        const response = await fetch(`${apiUrl}/api/v1/user/${userId}/goals`, {
          headers: {
            'x-api-key': apiKey,
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.statusText}`);
        }
        return response.json() satisfies Promise<UserGoalsResponse>;
      },
    },
  },
  metrics: {
    async get(): Promise<MetricSchemaResponse> {
      const response = await fetch(`${apiUrl}/api/v1/metrics`, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching metric types: ${response.statusText}`);
      }
      return response.json() satisfies Promise<MetricSchemaResponse>;
    },
    async getById(id: number): Promise<MetricSchemaResponse> {
      const response = await fetch(`${apiUrl}/api/v1/metrics/${id}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching metric type: ${response.statusText}`);
      }
      return response.json() satisfies Promise<MetricSchemaResponse>;
    },
    async post(data: {
      name: string;
      unit: string;
      description: string;
    }): Promise<CreateMetricResponse> {
      const response = await fetch(`${apiUrl}/api/v1/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Error posting metric type: ${response.statusText}`);
      }
      return response.json() satisfies Promise<CreateMetricResponse>;
    },
  },
};
