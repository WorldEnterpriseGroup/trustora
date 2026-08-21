import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.enum(['EoR 101', 'Operating model', 'Trust & integrity', 'Comparison', 'Workplace', 'Employee experience', 'Technical workforce']),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    readTime: z.string().min(1),
    lede: z.string().min(1),
    imageKey: z.enum(['team-table', 'trustora-team', 'workplace-grid', 'dubai-skyline', 'operations-room', 'remote-work', 'people-at-work', 'remote-call-home', 'coffee-corridor', 'conference-speaker', 'camera-grip-set', 'event-coordinator', 'lab-instrument-research', 'dry-lab-data-review', 'gpu-rnd', 'camera-rnd', 'legal-drafting', 'accessible-remote-call', 'technical-standup', 'hardware-prototyping', 'conference-networking', 'accessible-office-review', 'payroll-benefits-review', 'specialist-ai-lab', 'quantum-physics-team', 'onboarding-across-borders']),
    imageAlt: z.string().min(1),
    imageCaption: z.string().min(1),
    sources: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    related: z.array(z.string()).default([]),
    nextStep: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      label: z.string().min(1),
      href: z.string().regex(/^\/(?:[^/?#]+\/)*[^/?#]+\/$/),
    }),
  }),
});

const careers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/careers' }),
  schema: z.object({
    title: z.string().min(1),
    location: z.string().min(1),
    employmentType: z.literal('Full-Time'),
    department: z.string().min(1),
    reportsTo: z.string().min(1),
    description: z.string().min(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, careers };
