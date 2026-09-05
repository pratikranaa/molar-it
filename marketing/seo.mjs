/**
 * Shared SEO metadata and JSON-LD helpers for the pre-rendered marketing site.
 *
 * The values in this module describe Molar's public entity. Keep page facts
 * (publication dates, authors, and images) in the page data and pass them to
 * `document()`; do not invent those values in a shared default.
 */

export const SITE_URL = 'https://molar.it';
export const ORGANIZATION_ID = `${SITE_URL}/#org`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const cleanPath = (path = '/') => {
  const value = String(path || '/').trim();
  if (!value || value === '/') return '/';
  const withoutQuery = value.split(/[?#]/, 1)[0];
  const withoutHtml = withoutQuery.replace(/\.html$/i, '');
  return `/${withoutHtml.replace(/^\/+/, '').replace(/\/+$/, '')}`;
};

export const absoluteUrl = (path = '/') => {
  const value = String(path || '/');
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${cleanPath(value)}`;
};

export const socialAssetName = (path = '/') => {
  const normalized = cleanPath(path);
  if (normalized === '/') return 'home.png';
  const slug = normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${slug || 'home'}.png`;
};

export const defaultSocialImage = (path = '/') => `${SITE_URL}/assets/social/${socialAssetName(path)}`;
export const DEFAULT_SOCIAL_IMAGE = defaultSocialImage('/');

const stripTags = value => String(value || '').replace(/<[^>]*>/g, '').trim();

const titleForBreadcrumb = title => stripTags(String(title || '').replace(/\s*\|\s*Molar\s*$/i, ''));

/**
 * Resolve a breadcrumb option into schema.org ListItems. A string is treated
 * as a visible label at the current page; an object may provide `name` and
 * `item` for an explicit hierarchy.
 */
export function breadcrumbItems({path = '/', title = '', breadcrumbs} = {}) {
  const normalizedPath = cleanPath(path);
  if (normalizedPath === '/') return [];

  const supplied = Array.isArray(breadcrumbs) ? breadcrumbs : null;
  const values = supplied?.length
    ? supplied
    : [{name: 'Molar', item: '/'}, {name: titleForBreadcrumb(title), item: normalizedPath}];

  const items = values.map((entry, index) => {
    const value = typeof entry === 'string' ? {name: entry} : (entry || {});
    const name = stripTags(value.name || (index === values.length - 1 ? titleForBreadcrumb(title) : 'Molar'));
    const item = value.item == null
      ? (index === values.length - 1 ? normalizedPath : '/')
      : value.item;
    return {
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absoluteUrl(item),
    };
  }).filter(item => item.name && item.item);

  return items.length > 1 ? items : [];
}

const imageUrl = (image, path = '/') => {
  if (!image) return defaultSocialImage(path);
  if (typeof image === 'string') return absoluteUrl(image);
  if (Array.isArray(image)) return image.map(value => imageUrl(value, path)).filter(Boolean);
  return absoluteUrl(image.url || image.contentUrl || defaultSocialImage(path));
};

const imageList = (image, path = '/') => {
  const value = imageUrl(image, path);
  return Array.isArray(value) ? value : [value];
};

const authorEntity = author => {
  if (!author) return null;
  if (typeof author === 'string') return {'@type': 'Person', name: author};
  if (Array.isArray(author)) return author.map(authorEntity).filter(Boolean);
  if (author['@type']) return author;
  const entity = {'@type': author.type || 'Person', name: author.name};
  if (author.url) entity.url = absoluteUrl(author.url);
  if (author.sameAs) entity.sameAs = Array.isArray(author.sameAs)
    ? author.sameAs.map(absoluteUrl)
    : [absoluteUrl(author.sameAs)];
  return entity.name ? entity : null;
};

export const organizationSchema = () => ({
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Molar',
  legalName: 'Molar Labs',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/assets/molar-mark-apple.png`,
  email: 'pratik@molar.it',
  sameAs: [
    'https://docs.molar.it',
    'https://github.com/pratikranaa/molar-it',
  ],
});

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: 'Molar',
  alternateName: 'Molar Labs',
  publisher: {'@id': ORGANIZATION_ID},
  inLanguage: 'en',
});

/**
 * Build the graph shared by every pre-rendered page. `type: 'BlogPosting'`
 * (or the legacy `Article`) adds the article fields Google expects while
 * retaining the caller's existing WebPage default.
 */
export function structuredData({
  title,
  description,
  path = '/',
  type = 'WebPage',
  image,
  date,
  datePublished,
  dateModified,
  author,
  breadcrumbs,
  section,
  keywords,
} = {}) {
  const url = absoluteUrl(path);
  const article = type === 'Article' || type === 'BlogPosting';
  const page = {
    '@type': article ? 'WebPage' : type,
    '@id': `${url}#webpage`,
    name: title,
    description,
    url,
    isPartOf: {'@id': WEBSITE_ID},
    publisher: {'@id': ORGANIZATION_ID},
    mainEntityOfPage: {'@id': `${url}#webpage`},
    primaryImageOfPage: {'@type': 'ImageObject', url: imageList(image, path)[0]},
    inLanguage: 'en',
  };
  const graph = [organizationSchema(), page];
  if (article) {
    const published = datePublished || date;
    const articleNode = {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: title,
      description,
      url,
      mainEntityOfPage: {'@id': `${url}#webpage`},
      isPartOf: {'@id': WEBSITE_ID},
      publisher: {'@id': ORGANIZATION_ID},
      image: imageList(image, path),
      inLanguage: 'en',
    };
    if (published) articleNode.datePublished = published;
    if (dateModified) articleNode.dateModified = dateModified;
    const entity = authorEntity(author);
    if (entity) articleNode.author = entity;
    if (section) articleNode.articleSection = section;
    if (keywords) articleNode.keywords = keywords;
    graph.push(articleNode);
  }

  if (cleanPath(path) === '/') graph.splice(1, 0, websiteSchema());
  const itemListElement = breadcrumbItems({path, title, breadcrumbs});
  if (itemListElement.length) graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement,
  });
  return {'@context': 'https://schema.org', '@graph': graph};
}

export function metaTags({title, description, path = '/', type = 'WebPage', image, noindex = false} = {}) {
  const url = absoluteUrl(path);
  const socialImage = imageList(image, path)[0];
  const article = type === 'Article' || type === 'BlogPosting';
  return [
    `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:title" content="__TITLE__">`,
    `<meta property="og:description" content="__DESCRIPTION__">`,
    `<meta property="og:type" content="${article ? 'article' : 'website'}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:site_name" content="Molar">`,
    `<meta property="og:image" content="${socialImage}">`,
    `<meta property="og:image:alt" content="__TITLE__">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="__TITLE__">`,
    `<meta name="twitter:description" content="__DESCRIPTION__">`,
    `<meta name="twitter:image" content="${socialImage}">`,
  ].join('');
}
