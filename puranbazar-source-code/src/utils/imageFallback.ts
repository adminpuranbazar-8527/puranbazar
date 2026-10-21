/**
 * Image normalization and fallback resolver for PuranBazar marketplace.
 * Ensures all image paths (local public images, base64 data URIs, CDN URLs)
 * display perfectly in both development and production (e.g. Vercel) environments.
 */

// Production-ready static images deployed in /public/images/
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  mobile: '/images/hero_phone_marketplace_1790186011665.jpg',
  computer: '/images/hero_laptop_tech_1790186025559.jpg',
  vehicles: '/images/hero_motorcycle_bike_1790186037701.jpg',
  electronics: '/images/hero_electronics_tv_1790186061763.jpg',
  furniture: '/images/hero_furniture_sofa_1790186048999.jpg',
  property: '/images/hero_furniture_sofa_1790186048999.jpg',
  fashion: '/images/hero_phone_marketplace_1790186011665.jpg',
  others: '/images/hero_laptop_tech_1790186025559.jpg'
};

export const DEFAULT_AD_FALLBACK = '/images/puranbazar_logo_1790267897787.jpg';

/**
 * Normalizes an image path:
 * Converts legacy `/src/assets/images/...` paths into live `/images/...` paths so
 * Vercel and production builds load them seamlessly without 404 errors.
 */
export function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('/src/assets/images/')) {
    return trimmed.replace('/src/assets/images/', '/images/');
  }
  if (trimmed.startsWith('src/assets/images/')) {
    return trimmed.replace('src/assets/images/', '/images/');
  }
  return trimmed;
}

/**
 * Resolves the display image for an ad with fallback hierarchy.
 */
export function getAdImageWithFallback(images?: string[], categoryId?: string): string {
  if (images && images.length > 0) {
    for (const img of images) {
      if (img && typeof img === 'string' && img.trim().length > 0) {
        return normalizeImageUrl(img);
      }
    }
  }
  if (categoryId && CATEGORY_FALLBACK_IMAGES[categoryId]) {
    return CATEGORY_FALLBACK_IMAGES[categoryId];
  }
  return DEFAULT_AD_FALLBACK;
}

/**
 * Handles image load errors gracefully by switching to a reliable local fallback.
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, categoryId?: string) {
  const fallback = (categoryId && CATEGORY_FALLBACK_IMAGES[categoryId]) || DEFAULT_AD_FALLBACK;
  if (e.currentTarget.src !== fallback && !e.currentTarget.src.endsWith(fallback)) {
    e.currentTarget.src = fallback;
  }
}
