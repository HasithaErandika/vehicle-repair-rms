export const recordKeys = {
  all:       () => ['records']                  as const,
  vehicle:   (id: string) => [...recordKeys.all(), 'vehicle', id] as const,
  detail:    (id: string) => [...recordKeys.all(), id] as const,
};
