export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR');
};