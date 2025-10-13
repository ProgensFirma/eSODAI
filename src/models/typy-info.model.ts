export interface TOsobaInfo {
  numer: number;
  identyfikator: string;
}

export interface TWydzialInfo {
  symbol: string;
  nazwa: string;
  kod: string;
}

export interface TKontrahentInfo {
  numer: number;
  identyfikator: string;
  firma: boolean;
  nip: string;
  adres: string;
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