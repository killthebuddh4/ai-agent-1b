import { z } from 'zod';

describe('Server', () => {
  it('should have a heartbeat', async () => {
    const response = await fetch('http://localhost:3000/heartbeat');

    const json = await response.json();

    z.object({
      ok: z.boolean(),
    }).parse(json);
  })
});