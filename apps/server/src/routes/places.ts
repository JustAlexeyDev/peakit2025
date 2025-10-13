import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { z } from 'zod';

export const placesRouter = Router();

placesRouter.get('/', async (req, res) => {
  const { q, take = '20', skip = '0' } = req.query as Record<string, string>;
  const where = q ? { name: { contains: q, mode: 'insensitive' as const } } : {};
  const [items, total] = await Promise.all([
    prisma.place.findMany({ where, take: Number(take), skip: Number(skip), orderBy: { name: 'asc' } }),
    prisma.place.count({ where })
  ]);
  res.json({ items, total });
});

placesRouter.get('/:id', async (req, res) => {
  const place = await prisma.place.findUnique({ where: { id: req.params.id } });
  if (!place) return res.status(404).json({ error: 'Not found' });
  res.json(place);
});

const upsertSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  category: z.string().min(1)
});

placesRouter.post('/', requireAuth, requireAdmin, async (req, res) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = await prisma.place.create({ data: parsed.data });
  res.status(201).json(created);
});

placesRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.place.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(updated);
});

placesRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await prisma.place.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

