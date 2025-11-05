import { TBazaOper, TeSodStatus } from './enums.model';

export interface ZalacznikTresc {
  numer: number;
  plik: string;
  dokument: number;
  kolejnosc: number;
  archiuwum: boolean;
  data: string;
  edycja: boolean;
  wersja: number;
  wersjaOpis: string;
  tresc: string;
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}