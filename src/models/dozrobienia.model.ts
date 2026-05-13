import { TSkrzynki } from './enums.model';
import { TBazaOper, TeSodStatus } from './enums.model';

export enum TZadNaDzisTyp {
  Sprawa = 'tzd_sprawa',
  Dokument = 'tzd_dokument',
  EDorecz = 'tzd_edorecz'
}

export interface TZadNaDzisItem {
  numer: number;
  typ: TZadNaDzisTyp;
  skrzynka: TSkrzynki;
  nazwa: string;
  znak: string;
  data: string;
  dotyczy: string;
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}

export interface TZadNaDzisResponse {
  dozrobienia: TZadNaDzisItem[];
}
