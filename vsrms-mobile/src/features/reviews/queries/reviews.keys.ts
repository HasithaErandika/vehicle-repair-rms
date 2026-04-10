export const reviewKeys = {
  all:       () => ['reviews']                  as const,
  mine:      () => [...reviewKeys.all(), 'mine']  as const,
  workshop:  (id: string) => [...reviewKeys.all(), 'workshop', id] as const,
};
