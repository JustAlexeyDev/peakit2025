export type Place = {
  id: string;
  slug: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
};

export type Paginated<T> = { items: T[]; total: number };

