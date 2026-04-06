export interface DoZrobieniaItem {
  typ: string;
  numer: number;
  nazwa: string;
  znak: string;
  data: string;
  dotyczy: string;
}

export interface DoZrobieniaResponse {
  dozrobienia: DoZrobieniaItem[];
}

export enum DoZrobieniaTyp {
  Sprawy = 'tss_SSprTermin',
  Dokumenty = 'tps_PBiezace',
  EDorecz = 'tes_KEleDoreczPrzych'
}
