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
}

export interface TSprawaInfo {
  numer: number;
  znaksprawy: string;  
  nazwa: string;
  glowna: boolean;
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