import { TBazaOper, TeSodStatus } from './enums.model';

export interface TJednPrzek {
  symbol: string;
  nazwa: string;
  eDoreczAdres: string;
  glowna: boolean;
  wlasna: boolean;
  nSSOD: boolean;
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}
