export interface TDokTypInfo {
  nazwa: string;
  finansowy: boolean;
}

export interface TKontrahentInfo {
  numer: number;
  identyfikator: string;
  firma: boolean;
  nIP: string;
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

export interface TZalacznikInfo {
  numer: number;
  plik: string;
}
