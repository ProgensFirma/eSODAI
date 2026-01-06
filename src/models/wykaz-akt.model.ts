import { TBazaOper, TeSodStatus } from './enums.model';

export interface WykazAkt {
  symbol: string;
  poziom: number;
  nazwa: string;
  archM: string;
  archI: string;
  uwagi: string;
  tylkoEZD: boolean;

  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}

export interface WykazAktTreeNode {
  data: WykazAkt;
  children: WykazAktTreeNode[];
  expanded: boolean;
}
