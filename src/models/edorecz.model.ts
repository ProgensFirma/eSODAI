export interface EDoreczKontrahent {
  numer: number;
  identyfikator: string;
  firma: boolean;
  nIP: string;
  adres: string;
}

export interface EDoreczZalacznik {
  numer: number;
  plik: string;
}

export interface EDoreczPotwierdzenie {
  id: string;
  typ: string;
  info: string;
  data: string;
}

export interface EDoreczDokument {
  numer: number;
  idObce: string;
  data: string;
  nazwa: string;
  adresatSkrzynka: string;
  adresat: EDoreczKontrahent;
  nadawcaSkrzynka: string;
  nadawca: EDoreczKontrahent;
  tresc: string;
  pobrany: boolean;
  pobranyData: string;
  notatka: string;
  zalaczniki: EDoreczZalacznik[];
  potwierdzenia: EDoreczPotwierdzenie[];
  oper: string;
  status: string;
  statusDane: string;
}

export interface TeDoreczHybryda {
}

export interface EDoreczWyslana {
  numer: number;
  kopertaGlowna: number;
  punktNadawczy: {
    numer: number;
    nazwa: string;
  };
  wyslana: boolean;
  dokument: {
    numer: number;
    typ: {
      nazwa: string;
      finansowy: boolean;
      polecenieZaplaty: boolean;
    };
    nazwa: string;
    rejestrNrPozycji: string;
    kontrahent: EDoreczKontrahent;
  };
  dokWyjscia: {
    numer: number;
    rejestrNrPozycji: string;
  };
  adresatSkrzynka: string;
  adresat: EDoreczKontrahent;
  nadawcaSkrzynka: string;
  nadawca: EDoreczKontrahent;
  tytul: string;
  tresc: string;
  typ: string;
  hybryda: TeDoreczHybryda | null;
  msgId: string;
  taskId: string;
  statusDoreczenia: number;
  statusDoreczeniaOpis: string;
  zalaczniki: EDoreczZalacznik[];
  potwierdzenia: EDoreczPotwierdzenie[];
  oper: string;
  status: string;
  statusDane: string;
}
