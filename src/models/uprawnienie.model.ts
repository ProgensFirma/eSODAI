import { TUprawPoziom } from './enums.model';

export interface Uprawnienie {
  uprawnienie: string;
  opis: string;
  poziom: TUprawPoziom;
}
