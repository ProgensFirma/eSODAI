import { TBazaOper, TeSodStatus, TStatWysylki } from './enums.model';
import { TZalacznikInfo, TKontrahentInfo } from './typy-info.model';

export interface DokumentWychodzacy {
  numer: number;
  dokument: {
    numer: number;
    typ: {
      nazwa: string;
      finansowy: boolean;
      polecenieZaplaty: boolean;
    };
    nazwa: string;
    rejestrNrPozycji: string;
    kontrahent: TKontrahentInfo | null;
    zalaczniki?: TZalacznikInfo[];
  } | null;
  rejestr: string;
  rejestrNumer: number;
  rejestrRok: number;
  rejestrNrPozycji: string;
  typ: string;
  dataWyjscia: string;
  godzWyjscia: number;
  kontrahent: {
    numer: number;
    identyfikator: string;
    firma: boolean;
    nip: string;
    adres: string;
  } | null;
  wprowadzil: {
    numer: number;
    identyfikator: string;
  };
  wprowadzilData: string;
  wyslal: {
    numer: number;
    identyfikator: string;
  };
  statusWysylki: TStatWysylki;
  kanalWysylki: string;
  wysylkaEpuap: number | null;
  wysylkaeDorecz: number | null;
  doWiadomosci: DoWiadomosc[];
  
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}

export interface DoWiadomosc {
  numer: number;
  kontrahent: {
    numer: number;
    identyfikator: string;
    firma: boolean;
    nip: string;
    adres: string;
  } | null;
  osoba: {
    numer: number;
    identyfikator: string;
  } | null;
  wysylkaEpuap: number | null;
  wysylkaeDorecz: number | null;
  
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}
