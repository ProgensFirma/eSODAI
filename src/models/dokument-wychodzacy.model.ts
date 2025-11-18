import { TBazaOper, TeSodStatus } from './enums.model';

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
    kontrahent: any;
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
    nIP: string;
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
  statusWysylki: string;
  kanalWysylki: string;
  wysylkaEpuap: number;
  wysylkaeDorecz: number;
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
    nIP: string;
    adres: string;
  } | null;
  osoba: {
    numer: number;
    identyfikator: string;
  } | null;
  wysylkaEpuap: number;
  wysylkaeDorecz: number;
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}
