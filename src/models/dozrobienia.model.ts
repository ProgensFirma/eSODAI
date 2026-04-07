export interface TZadNaDzisItem {
  typ: string;
  numer: number;
  nazwa: string;
  znak: string;
  data: string;
  dotyczy: string;
}

export interface TZadNaDzisResponse {
  dozrobienia: TZadNaDzisItem[];
}

export enum TZadNaDzisTyp {
  Sprawa = 'Sprawa',
  Dokument = 'Dokument',
  EDorecz = 'EDorecz'
}
