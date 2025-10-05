import { Product, ProductImage, ProductPrice } from '@/types/product';
import { ORIGIN_BASE_URL } from '@/lib/api';

const normalizePrice = (price: any): ProductPrice => {
  if (price && typeof price === 'object') {
    const regular = Number(price.regular ?? price.sale ?? 0);
    const sale = price.sale !== undefined && price.sale !== null ? Number(price.sale) : undefined;
    return {
      regular,
      ...(sale !== undefined ? { sale } : {})
    };
  }

  const numericPrice = Number(price ?? 0);
  return { regular: numericPrice };
};

const toAbsoluteUrl = (url?: string): string => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${ORIGIN_BASE_URL}${url}`;
  return url;
};

const normalizeImages = (images: any, fallbackUrl: string, title: string): ProductImage[] => {
  if (!images) {
    const abs = toAbsoluteUrl(fallbackUrl);
    return abs
      ? [{ url: abs, alt: title || 'Product image', isPrimary: true }]
      : [];
  }

  if (Array.isArray(images)) {
    return images.map((img: any, index: number) => {
      if (!img) return null;
      if (typeof img === 'string') {
        return {
          url: toAbsoluteUrl(img),
          alt: title || 'Product image',
          isPrimary: index === 0
        } satisfies ProductImage;
      }
      return {
        url: toAbsoluteUrl(img.url),
        alt: img.alt || title || 'Product image',
        isPrimary: img.isPrimary ?? index === 0
      } satisfies ProductImage;
    }).filter(Boolean) as ProductImage[];
  }

  if (typeof images === 'string') {
    return [{ url: toAbsoluteUrl(images), alt: title || 'Product image', isPrimary: true }];
  }

  return [];
};

export const transformProduct = (data: any): Product => {
  const id = data?._id || data?.id || '';
  const title = data?.title ?? '';
  const fallbackImage = data?.imageUrl || data?.images?.[0]?.url || '';

  const images = normalizeImages(data?.images, fallbackImage, title);
  const imageUrl = images[0]?.url || toAbsoluteUrl(fallbackImage);

  const price = normalizePrice(data?.price);

  const shortDescription = data?.description?.short ?? data?.shortDescription ?? '';
  const availability = data?.inventory?.availability ?? data?.availability ?? 'Made to Order';
  const leadTime = data?.inventory?.lead_time ?? data?.leadTime ?? '7-10 days';

  return {
    ...data,
    id,
    _id: data?._id ?? id,
    title,
    category: data?.category ?? 'Custom',
    price,
    availability,
    shortDescription,
    description: {
      short: shortDescription,
      full: data?.description?.full ?? data?.description?.long ?? ''
    },
    leadTime,
    sku: data?.sku ?? '',
    imageUrl,
    images,
    inventory: {
      availability,
      quantity: data?.inventory?.quantity ?? data?.quantity ?? 0,
      lead_time: leadTime
    },
    tags: Array.isArray(data?.tags) ? data.tags : [],
    featured: Boolean(data?.featured),
    isActive: data?.isActive !== undefined ? data.isActive : true
  } satisfies Product;
};

export const transformProducts = (items: any[] = []): Product[] =>
  items.map(transformProduct);
