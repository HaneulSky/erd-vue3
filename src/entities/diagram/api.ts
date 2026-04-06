import { api } from '@/shared/api/client';
import type { CreateDiagramDto, DiagramDto } from './types';

export const diagramApi = {
  create: (dto: CreateDiagramDto) => api.post<DiagramDto>('/diagrams', dto),

  list: () => api.get<DiagramDto[]>('/diagrams'),

  update: (dto: DiagramDto) => api.put<DiagramDto>('/diagrams', dto),

  delete: (id: number) => api.delete(`/diagrams/${id}`),
};
