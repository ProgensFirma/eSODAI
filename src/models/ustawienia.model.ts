import { TeSodStatus } from './enums.model';

export interface Ustawienia {
  pieczecObsluga: boolean;
  podpisObsluga: boolean;
  powiadomieniaObsluga: boolean;
  eDoreczObsluga: boolean;
  kSeFObsluga: boolean;
  jednPrzekObsluga: boolean;
  maxRozmiarPliku: number;
  dokumentSpecUpraw: boolean;
  sprawaZamkDolaczPismo: boolean;
  status: TeSodStatus;
  statusDane: string;
}
