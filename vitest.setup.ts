import { vi } from 'vitest';

vi.mock('$env/static/private', () => ({
  POSTGRES_URL: process.env.POSTGRES_URL
}));
