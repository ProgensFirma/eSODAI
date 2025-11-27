import { TSkrzynki } from './enums.model';

export interface Skrzynka {
  sql: string;
  sqlOrder: string;
  skrzynka: TSkrzynki;
  poziom: number;
  typ: string;
  nazwa: string;
  zliczana: boolean;
  ilosc: number;
  suma: number;
  zmiana: boolean;
  doWgl: boolean;
  doUsun: boolean;
  korEl: boolean;
  skrDef: number;
  dokFinPoziom: number;
  dokFinZmiana: boolean;
}

export function mapSkrzynkaToNumber(skrzynkaNazwa: TSkrzynki): number {
  return skrzynkaNazwa;
}

export function isSprawySkrzynka(skrzynka: Skrzynka | number): boolean {
  if (typeof skrzynka === 'number') {
    return skrzynka >= TSkrzynki.tss_Sprawy && skrzynka <= TSkrzynki.tss_SNadzorEtap;
  }
  return skrzynka.typ === 'ts_sprawy';
}

export interface TreeNode {
  data: Skrzynka;
  children: TreeNode[];
  expanded: boolean;
}