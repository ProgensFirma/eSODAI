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
  ordSkrzynka: number;
  numer?: number;
}

export function mapSkrzynkaToNumber(skrzynkaNazwa: TSkrzynki): number {
  return skrzynkaNazwa;
}

export function isSprawySkrzynka(skrzynka: number): boolean {
  return skrzynka >= TSkrzynki.tss_Sprawy && skrzynka <= TSkrzynki.tss_SNadzorEtap;
}

export interface TreeNode {
  data: Skrzynka;
  children: TreeNode[];
  expanded: boolean;
}