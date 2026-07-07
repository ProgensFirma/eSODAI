import { TOsobaInfo, TWydzialInfo, TKontrahentInfo } from './typy-info.model';
import { TBazaOper, TeSodStatus, TSprStatusPrzek } from './enums.model';

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
  dataStop: string | null;
  terminPlan: string;
  terminAlarm: string;
  dataOtrzymania: string | null;
  dataPrzyjecia: string | null;
  dataPrzekazania: string | null;
  dataOdebrania: string | null;
  osobaPrzek: TOsobaInfo;
  statusPrzek: TSprStatusPrzek;
  odrzucona: boolean;
  kontrahent: TKontrahentInfo | null;
  nadzorWydzial: TWydzialInfo;
  nadzorOsoba: TOsobaInfo;
  wykWydzial: TWydzialInfo;
  wykOsoba: TOsobaInfo;
  uprawPoziom: string;
  opis?: string;
  notatkaPrzek?: string;

  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}
