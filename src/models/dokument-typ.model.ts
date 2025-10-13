import { TDokTypInfo } from './typy-info.model';

export interface DokumentTyp extends TDokTypInfo {
  szablon: string;
  rejestr: string;
  polecenieZaplaty: boolean;
  rWA: string;
  nazwaDomysl: string;
  oper: string;
  status: string;
  statusDane: string;
}
