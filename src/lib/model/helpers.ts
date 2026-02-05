interface PostgresError extends Error {
  code: string;
  constraint?: string;
}

export function isPostgresError(error: unknown): error is PostgresError {
  return error instanceof Error && 'code' in error;
}

export function formatPgArray(arr: string[]): string {
  return `{${arr.join(',')}}`;
}
