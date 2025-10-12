export interface DokumentTyp {
  nazwa: string;
  finansowy: boolean;
}

export interface Kontrahent {
  numer: number;
  identyfikator: string;
  firma: boolean;
  nIP: string;
}

export interface Osoba {
  numer: number;
  identyfikator: string;
}

export interface Wydzial {
  stanowisko: boolean;
  symbol: string;
  nazwa: string;
  kod: string;
}

export interface DaneFinansowe {
  poziom: number;
  dataWystawienia: string;
  dataSprzedazy: string;
  dataPlatnosci: string;
  dataZaplaty: string;
  dataVAT: string;
  brutto: number;
  netto: number;
  vAT: number;
}

export interface Zalacznik {
  numer: number;
  plik: string;
}

export interface Dokument {
  numer: number;
  archiwum: boolean;
  dokGlowny: number;
  wersja: string;
  aktualny: boolean;
  statusEdycji: string;
  doWgladu: boolean;
  typ: DokumentTyp;
  szablon: string | null;
  nazwa: string;
  opis: string;
  sprawa: any;
  rejestr: string;
  rejestrNumer: number;
  rejestrRok: number;
  rejestrNrPozycji: string;
  dataWplywu: string;
  godzinaWplywu: number;
  numerNaDok: string;
  dataNaDok: string;
  kanalWe: string;
  domKanalWy: string;
  kontrahent: Kontrahent;
  przekazujacy: Osoba;
  przekazujacyWydzial: Wydzial;
  dataPrzekazania: string;
  prowadzacy: Osoba;
  prowadzacyWydzial: Wydzial;
  odpowiedzialny: Osoba;
  dataPrzyjecia: string;
  uprawPoziom: string;
  statusPrzek: string;
  dataAlert: string;
  dataPlan: string;
  daneFinansowe: DaneFinansowe | null;
  grupa1: string;
  grupa2: string;
  grupa3: string;
  publiczny: boolean;
  dokGuid: string;
  jrwa: string;
  zalaczniki: Zalacznik[];
  oper: string;
  status: string;
  statusDane: string;
}