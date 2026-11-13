import axios from 'axios';

import type { AxiosRequestConfig } from 'axios';


const client = axios.create({ timeout: 10_000 });

export async function request<T>(config: AxiosRequestConfig & { url: string }): Promise<T> {
  try {
    const { data } = await client.request<T>(config);

    return data;
  } catch (cause) {
    throw new Error(`Request failed: ${config.method?.toUpperCase() ?? 'GET'} ${config.url}`, {
      cause,
    });
  }
}
