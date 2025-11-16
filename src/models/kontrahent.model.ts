import { TBazaOper, TeSodStatus } from './enums.model';

export interface KontaktKontrahenta {
  telefon: string;
  telefon2: string;
  email: string;
  wWW: string;
  epuapAdres: string;
  eDoreczAdres: string;
  sMSZgoda: boolean;
  emailZgoda: boolean;
  epuapZgoda: boolean;
  eDoreczZgoda: boolean;
}

export interface AdresKontrahenta {
  kraj: string;
  woj: string;
  powiat: string;
  gmina: string;
  ulicaTyp: string;
  typ: string;
  kodPoczta: string;
  poczta: string;
  miejscowosc: string;
  ulica: string;
  nrDomu: string;
  nrLokalu: string;
}

export interface KontrahentDetailed {
  numer: number;
  archiwum: boolean;
  identyfikator: string;
  nazwa: string;
  imie: string;
  imie2: string;
  imieOjca: string;
  imieMatki: string;
  dataUrodzenia: string;
  dataZgonu: string;
  firma: boolean;
  grupa: string;
  pesel: string;
  nip: string;
  regon: string;
  kRS: string;
  odID: string;
  kontakt: KontaktKontrahenta;
  opis: string;
  nazwaDluga: string;
  uwagi: string;
  adresStaly: AdresKontrahenta;
  adresKoresp: AdresKontrahenta;
  
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}

export interface KontrahenciResponse {
  data: KontrahentDetailed[];
  wynikIlosc?: number;
}