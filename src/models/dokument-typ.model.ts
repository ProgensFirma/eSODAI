import { TBazaOper, TeSodStatus } from './enums.model';

export interface DokumentTyp {
  nazwa: string;
  szablon: string;
  rejestr: string;
  finansowy: boolean;
  polecenieZaplaty: boolean;
  rWA: string;
  nazwaDomysl: string;
  
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}
