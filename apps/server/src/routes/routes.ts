import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { z } from 'zod';

export const routesRouter = Router();

routesRouter.get('/', async (req, res) => {
  const { q, take = '20', skip = '0' } = req.query as Record<string, string>;
  const where = q ? { title: { contains: q, mode: 'insensitive' as const } } : {};
  const [items, total] = await Promise.all([
    prisma.route.findMany({ where, take: Number(take), skip: Number(skip), orderBy: { title: 'asc' } }),
    prisma.route.count({ where })
  ]);
  res.json({ items, total });
});

routesRouter.get('/:id', async (req, res) => {
  const item = await prisma.route.findUnique({ where: { id: req.params.id }, include: { points: true, places: true } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

const routeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  durationMin: z.number().int().positive(),
  distanceKm: z.number().positive(),
  placeIds: z.array(z.string()).default([]),
  points: z.array(z.object({ order: z.number().int(), latitude: z.number(), longitude: z.number() })).default([])
});

routesRouter.post('/', requireAuth, requireAdmin, async (req, res) => {
  const parsed = routeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { title, description, durationMin, distanceKm, placeIds, points } = parsed.data;
  const created = await prisma.route.create({
    data: {
      title, description, durationMin, distanceKm,
      places: { connect: placeIds.map(id => ({ id })) },
      points: { create: points }
    },
    include: { points: true, places: true }
  });
  res.status(201).json(created);
});

routesRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const parsed = routeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { title, description, durationMin, distanceKm, placeIds, points } = parsed.data;
  const updated = await prisma.route.update({
    where: { id: req.params.id },
    data: {
      title, description, durationMin, distanceKm,
      places: { set: [], connect: placeIds.map(id => ({ id })) },
      points: { deleteMany: {}, create: points }
    },
    include: { points: true, places: true }
  });
  res.json(updated);
});

routesRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await prisma.route.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

