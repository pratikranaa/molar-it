import {readFileSync} from 'node:fs';

// Real logos for the services and tools a page names (assets/brands, provenance in source-manifest.json).
const brands = JSON.parse(readFileSync(new URL('../assets/brands/source-manifest.json', import.meta.url))).assets;

export const brand = (id, cls = 'brand-logo') => brands[id]
  ? `<img class="${cls}" src="/assets/brands/${brands[id].file}" width="20" height="20" alt="" loading="lazy" decoding="async">`
  : '';
