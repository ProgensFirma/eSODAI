import { TBazaOper, TeSodStatus, TSkrzynki } from './enums.model';

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

export interface TSkrzynkaStan {
  osoba: number;
  skrzynka: TSkrzynki;
  archiwum: boolean;
  ilosc: number;
  suma: number;
  skrzynkaDef: number;
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}

export function isSprawySkrzynka(skrzynka: Skrzynka): boolean {
  return skrzynka.typ === 'ts_sprawy';
}

export interface TreeNode {
  data: Skrzynka;
  children: TreeNode[];
  expanded: boolean;
}