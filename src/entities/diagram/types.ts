export interface CreateDiagramDto {
  name: string;
}

export interface DiagramDto {
  id: number;
  name: string;
  tables?: unknown[];
}
