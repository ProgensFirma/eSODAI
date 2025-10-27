import { TOsobaInfo, TWydzialInfo, TKontrahentInfo } from './typy-info.model';

export interface SprawaTyp {
  nazwa: string;
  rWA: string;
}

export interface Sprawa {
  numer: number;
  nazwa: string;
  typ: SprawaTyp;
  znakDef: string;
  znakSprawy: string;
  znak_wydzial: string;
  znak_RWA: string;
  znak_rok: number;
  sprawaGlowna: number;
  etapOstatni: number;
  glowna: boolean;
  dataStart: string;
  dataStop: string;
  terminPlan: string;
  terminAlarm: string;
  dataOtrzymania: string;
  dataPrzyjecia: string;
  dataPrzekazania: string;
  dataOdebrania: string;
  osobaPrzek: TOsobaInfo;
  statusPrzek: string;
  odrzucona: boolean;
  kontrahent: TKontrahentInfo;
  nadzorWydzial: TWydzialInfo;
  nadzorOsoba: TOsobaInfo;
  wykWydzial: TWydzialInfo;
  wykOsoba: TOsobaInfo;
  uprawPoziom: string;
  oper: string;
  status: string;
  statusDane: string;
}
