export const appointmentKeys = {
  all:    () => ['appointments']                  as const,
  mine:   () => [...appointmentKeys.all(), 'mine']  as const,
  detail: (id: string) => [...appointmentKeys.all(), id] as const,
};
