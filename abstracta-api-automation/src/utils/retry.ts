import { APIResponse } from '@playwright/test';

interface RetryOptions {
  retries?: number;
  backoffMs?: number;
  successStatus?: number;
}

export async function retryRequest(
  fn: () => Promise<APIResponse>,
  options: RetryOptions = {},
): Promise<APIResponse> {
  const { retries = 3, backoffMs = 1000, successStatus = 200 } = options;

  let response: APIResponse | undefined;
  for (let attempt = 1; attempt <= retries; attempt++) {
    response = await fn();
    if (response.status() === successStatus) return response;
    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, attempt * backoffMs));
    }
  }
  return response!;
}

