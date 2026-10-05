import { TDokumentInfo, TWydzialInfo, TOsobaInfo } from './typy-info.model';

export interface TDekretacja {
  numer: number;
  dokument: TDokumentInfo | null;
  komPrzyj: TWydzialInfo | null;
  osobaPrzyj: TOsobaInfo | null;
  dekretowal: TOsobaInfo | null;
  uwagi: string;
  innaDoWgladu: boolean;
  inne: TDekretacja[] | null;
}
