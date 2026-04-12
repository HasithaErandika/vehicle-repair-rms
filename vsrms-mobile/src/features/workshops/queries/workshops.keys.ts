export const workshopKeys = {
  all:         () => ['workshops']                        as const,
  lists:       () => [...workshopKeys.all(), 'list']      as const,
  nearby:      () => [...workshopKeys.all(), 'nearby']    as const,
  mine:        () => [...workshopKeys.all(), 'mine']      as const,
  detail:      (id: string) => [...workshopKeys.all(), id] as const,
  technicians: (id: string) => [...workshopKeys.all(), id, 'technicians'] as const,
};
