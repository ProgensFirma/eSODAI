import { TSkrzynki } from './enums.model';
import { TBazaOper, TeSodStatus } from './enums.model';

export enum TZadNaDzisTyp {
  Sprawa = 'tzd_sprawa',
  Dokument = 'tzd_dokument',
  EDorecz = 'tzd_edorecz',
  PowWyslania = 'tzd_powWyslania',
  DokWyslane = 'tzd_dokWyslane'
}

export interface TZadNaDzisItem {
  numer: number;
  typ: TZadNaDzisTyp;
  skrzynka: TSkrzynki;
  nazwa: string;
  znak: string;
  data: string;
  dotyczy: string;
}

export interface TZadNaDzisStat {
  ilosc: number;
  wyswDla0: boolean;
}

export type TZadNaDzisStats = {
  [key in TZadNaDzisTyp]: TZadNaDzisStat;
};

export interface TZadNaDzisResponse {
  stats: TZadNaDzisStats;
  dozrobienia: TZadNaDzisItem

  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}
