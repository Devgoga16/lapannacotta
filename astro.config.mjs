// @ts-check
import { defineConfig } from 'astro/config';

// Dominio para SEO e imagen al compartir. En Vercel se toma solo del dominio de producción;
// cuando tengan dominio propio, agrega la variable SITE_URL en Vercel (ej.: https://lapannacotta.pe).
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : 'https://lapannacotta.pe');

export default defineConfig({
  site,
});
