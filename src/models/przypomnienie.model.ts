import { TOsobaInfo, TDokumentInfo, TSprawaInfo } from './typy-info.model';

export enum TPrzypRodzaj {
  tp_przyp = 'tp_przyp',
  tp_oglosz = 'tp_oglosz'
}

export enum TPrzypPowiazanie {
  htBrak = 'htBrak',
  htSprawa = 'htSprawa',
  htDokument = 'htDokument'
}

export interface THarmPrzyp {
  cykliczne: boolean;
}

export interface Przypomnienie {
  numer: number;
  rodzaj: TPrzypRodzaj;
  archiwum: boolean;
  osoba: TOsobaInfo;
  osobaZlec: TOsobaInfo | null;
  typPowiaz: TPrzypPowiazanie;
  dokument: TDokumentInfo | null;
  sprawa: TSprawaInfo | null;
  harmonogram: THarmPrzyp;
  dataCzas: string;
  naglowek: string;
  tresc: string;
  dataPrzyj: string;
  potwierdz: boolean;
}
