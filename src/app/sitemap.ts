import { MetadataRoute } from 'next';
import { getAllLocations, generateSlug } from '@/lib/data-utils';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://canadiandatainsights.com';
  
  // Base static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sources`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Dynamic location routes from the CSV dataset
  const locations = await getAllLocations();
  const locationRoutes: MetadataRoute.Sitemap = locations.map((loc) => ({
    url: `${baseUrl}/location/${generateSlug(loc.GEO_NAME)}`,
    lastModified: new Date(),
    // We update data when a new census drops or projections are added
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  // Next.js automatically chunks sitemaps under the hood if it exceeds limits,
  // but < 50k URLs is perfectly fine for a single sitemap file.
  return [...staticRoutes, ...locationRoutes];
}
