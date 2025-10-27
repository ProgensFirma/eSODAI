export interface Skrzynka {
  sql: string;
  sqlOrder: string;
  skrzynka: string;
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
  numer: number;
}

export enum TSkrzynki {
  tss_Sprawy = 0,
  tss_SSprTermin = 1,
  tss_SSprPilne = 2,
  tss_SOtrzymane = 3,
  tss_SZwrotne = 4,
  tss_SBiezace = 5,
  tss_SPrzekazane = 6,
  tss_SWykonane = 7,
  tss_SWstrzymane = 8,
  tss_SNadzorGl = 9,
  tss_SNadzorEtap = 10,
  tzs_Zadania = 11,
  tzs_ZZadTermin = 12,
  tzs_ZZadPilne = 13,
  tzs_ZOtrzymane = 14,
  tzs_ZBiezace = 15,
  tzs_ZPrzekazane = 16,
  tzs_ZZlecone = 17,
  tzs_ZZakonczone = 18,
  tks_Koresp = 19,
  tks_KOtrzymana = 20,
  tks_KDoWgladu = 21,
  tks_KZwrotna = 22,
  tks_KBiezaca = 23,
  tks_KPrzekazana = 24,
  tes_korespEle = 25,
  tes_KEleEMail = 26,
  tes_KEleePUAPPrzych = 27,
  tes_KEleePUAPDoWys = 28,
  tes_KEleePUAPWyslana = 29,
  tes_KEleDoreczPrzych = 30,
  tes_KEleDoreczDoWys = 31,
  tes_KEleDoreczWyslana = 32,
  tps_Pisma = 33,
  tps_POtrzymane = 34,
  tps_PDoWgladu = 35,
  tps_PDoWgladu_Wl = 36,
  tps_PDoWgladu_Obc = 37,
  tps_PZwrotne = 38,
  tps_PBiezace = 39,
  tps_PDoPodpisu = 40,
  tps_PDokFinansowe = 41,
  tps_PPrzekazane = 42,
  tps_PWyslane = 43,
  tqs_Skladnica = 44,
  tfs_Foldery = 45,
  tfs_FMojeDok = 46,
  tfs_FRepGlob = 47,
  tfs_FRepPryw = 48,
  tfs_FRepOsob = 49,
  tfs_Pulpit = 50,
  tfs_MojKomp = 51
}

export function isSprawySkrzynka(skrzynka: number): boolean {
  return skrzynka >= TSkrzynki.tss_Sprawy && skrzynka <= TSkrzynki.tss_SNadzorEtap;
}

export interface TreeNode {
  data: Skrzynka;
  children: TreeNode[];
  expanded: boolean;
}