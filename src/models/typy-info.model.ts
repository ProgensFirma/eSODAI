import { TAdresTyp } from './enums.model';

export interface TAdresDrukLinia {
  Linia1: string;
  Linia2: string;
}

export interface TAdres {
  Typ: TAdresTyp;
  KodPoczta: string;
  Poczta: string;
  Miejscowosc: string;
  Ulica: string;
  NrDomu: string;
  NrLokalu: string;
}

export interface TAdresPelny extends TAdres {
  Kraj: string;
  Woj: string;
  Powiat: string;
  Gmina: string;
  UlicaTyp: string;
}

export interface TOsobaInfo {
  numer: number;
  identyfikator: string;
}

export interface TWydzialInfo {
  stanowisko: boolean;
  symbol: string;
  nazwa: string;
  kod: string;
}

export interface TKontrahentInfo {
  numer: number;
  identyfikator: string;
  firma: boolean;
  nip: string;
  adres: string | null;
  eDoreczAdres: string;
} 

export interface TSprawaInfo {
  numer: number;
  znaksprawy: string;  
  nazwa: string;
  glowna: boolean;
  zakonczona: boolean;
}

export interface TDokTypInfo {
  nazwa: string;
  finansowy: boolean;
  poleceniezaplaty: boolean;
}

export interface TSzablonInfo {
  numer: number;
  nazwa: string;
  grupa: string;
}

export interface TPodpisDokumentInfo {
  kolejnosc: number;
  podpisal: TOsobaInfo;
  data: string;
}

export interface TZalacznikInfo {
  numer: number;
  plik: string;
}

export interface TJednostka {
  symbol: string;
  nazwa: string;
  kod: string;
  stanowisko: boolean;
  glowne: boolean;
  oper: string;
  status: string;
  statusDane: string;
}

export interface TDokumentInfo {
  numer: number;
  typ: TDokTypInfo;
  nazwa: string;
  rejestrNrPozycji: string;
  kontrahent: TKontrahentInfo | null;
}

export interface TDokWyjsciaInfo {
  numer: number;
  rejestrNrPozycji: string;
}

export interface TPunktNadawczyInfo {
  numer: number;
  nazwa: string;
}