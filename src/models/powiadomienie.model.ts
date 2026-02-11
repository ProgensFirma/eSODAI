export interface TOsobaInfo {
  numer: number;
  identyfikator: string;
}

export interface TKontrahentInfo {
  numer: number;
  identyfikator: string;
  firma: boolean;
  nIP: string;
  adres: string;
}

export interface TSprawaInfo {
  numer: number;
  znakSprawy: string;
  nazwa: string;
  glowna: boolean;
}

export interface TDokumentInfo {
  numer: number;
  typ: any;
  nazwa: string;
  rejestrNrPozycji: string;
  kontrahent: any;
}

export interface TPowiadomienie {
  numer: number;
  autor: TOsobaInfo;
  kontrahent: TKontrahentInfo;
  data: string;
  dataWazn: string;
  naglowek: string;
  opis: string;
  pobrano: boolean;
  pobranoData: string;
  potwierdzono: boolean;
  potwierdzonoData: string;
  sprawa: TSprawaInfo | null;
  dokument: TDokumentInfo | null;
  email: string;
  telefon: string;
  sUProg: number;
  sUProgIdDow: string;
  sUTypWew: number;
  sUIdent: string;
  oper: string;
  status: string;
  statusDane: string;
}
