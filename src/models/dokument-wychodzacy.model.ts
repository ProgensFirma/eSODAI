import { TBazaOper, TeSodStatus, TStatWysylki, TKanalTyp } from './enums.model';
import { TZalacznikInfo, TKontrahentInfo, TOsobaInfo, TDokumentInfo, TSprawaInfo } from './typy-info.model';

export interface DokumentWychodzacy {
  numer: number;
  dokument: TDokumentInfo & { zalaczniki?: TZalacznikInfo[] } | null;
  rejestr: string;
  rejestrNumer: number;
  rejestrRok: number;
  rejestrNrPozycji: string;
  typ: string;
  dataWyjscia: string;
  godzWyjscia: number;
  kontrahent: TKontrahentInfo | null;
  wprowadzil: TOsobaInfo;
  wprowadzilData: string;
  wyslal: TOsobaInfo;
  statusWysylki: TStatWysylki;
  kanalWysylki: TKanalTyp;
  wysylkaEpuap: number | null;
  wysylkaeDorecz: number | null;
  sprawa: TSprawaInfo | null;
  doWiadomosci: DoWiadomosc[];

  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}

export interface DoWiadomosc {
  numer: number;
  kontrahent: TKontrahentInfo | null;
  osoba: TOsobaInfo | null;
  wysylkaEpuap: number | null;
  wysylkaeDorecz: number | null;
  
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}
