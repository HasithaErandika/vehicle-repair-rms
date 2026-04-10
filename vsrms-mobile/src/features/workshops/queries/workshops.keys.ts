export const workshopKeys = {
  all:    () => ['workshops']                  as const,
  lists:  () => [...workshopKeys.all(), 'list']  as const,
  nearby: () => [...workshopKeys.all(), 'nearby'] as const,
  detail: (id: string) => [...workshopKeys.all(), id] as const,
};
