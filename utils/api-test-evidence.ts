import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { APIResponse } from '@playwright/test';

export interface ApiResponseEvidence {
  operationName: string;
  statusCode: number;
  responseBody: unknown;
}

export interface ExecutionEvidence {
  operationName: string;
  petId?: number;
  statusCode: number | null;
  passed: boolean;
  responseBody: unknown;
  executionTimestamp: string;
  additionalResponses?: ApiResponseEvidence[];
  error?: string;
}

export async function readResponseBody(response: APIResponse): Promise<unknown> {
  const body = await response.text();
  if (!body) {
    return null;
  }

  if (response.headers()['content-type']?.includes('json')) {
    return JSON.parse(body);
  }

  return body;
}

export function requirePetId(responseBody: unknown): number {
  if (
    typeof responseBody !== 'object'
    || responseBody === null
    || !('id' in responseBody)
    || typeof responseBody.id !== 'number'
  ) {
    throw new Error('The pet response did not contain a numeric ID.');
  }

  return responseBody.id;
}

export function recordAdditionalResponse(
  evidence: ExecutionEvidence,
  operationName: string,
  statusCode: number,
  responseBody: unknown,
): void {
  evidence.additionalResponses ??= [];
  evidence.additionalResponses.push({ operationName, statusCode, responseBody });
}

export async function withExecutionEvidence(
  fileName: string,
  operationName: string,
  execute: (evidence: ExecutionEvidence) => Promise<void>,
): Promise<void> {
  const evidence: ExecutionEvidence = {
    operationName,
    statusCode: null,
    passed: false,
    responseBody: null,
    executionTimestamp: new Date().toISOString(),
  };

  try {
    await execute(evidence);
    evidence.passed = true;
  } catch (error) {
    evidence.passed = false;
    evidence.error = error instanceof Error ? error.message : String(error);
    throw error;
  } finally {
    evidence.executionTimestamp = new Date().toISOString();
    const resultsDirectory = path.resolve(__dirname, '..', 'results');
    await mkdir(resultsDirectory, { recursive: true });
    await writeFile(
      path.join(resultsDirectory, fileName),
      `${JSON.stringify(evidence, null, 2)}\n`,
      'utf8',
    );
  }
}
