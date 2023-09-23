import { messages } from '../i18n';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      messages,
    })
  );
};
