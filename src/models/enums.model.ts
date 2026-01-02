//ogólne
export enum TBazaOper {
  tboSelect = 'tboSelect',
  tboDodaj = 'tboDodaj',
  tboZmien = 'tboZmien',
  tboUsun = 'tboUsun',
  tboOdswiez = 'tboOdswiez'
}

export enum TeSodStatus {
  sBrak = 'sBrak',
  sOK = 'sOK',
  sBlad = 'sBlad'
}

export enum TSystem {
  sys_Brak = 'sys_Brak',
  sys_Windows = 'sys_Windows',
  sys_Linux = 'sys_Linux'
}

export enum TDBSerwer {
  bdFD_Brak = 'bdFD_Brak',
  bdFD_FireBird = 'bdFD_FireBird',
  bdFD_SQLServer = 'bdFD_SQLServer'
}

//dokument
export enum TStatusEdycji {
  se_DoWgladu = 'se_DoWgladu',
  se_Zmieniany = 'se_Zmieniany',
  se_DoZatw = 'se_DoZatw',
  se_Niewidoczny = 'se_Niewidoczny'
}

export enum TKanalTyp {
  tk_brak = 'tk_brak',
  tk_papierowy = 'tk_papierowy',
  tk_email = 'tk_email',
  tk_ePuap = 'tk_ePuap',
  tk_eDorecz = 'tk_eDorecz',
  tk_Portal = 'tk_Portal'
}

export enum TStatusPrzek {
  sp_oczek = 'sp_oczek',
  sp_przyj = 'sp_przyj',
  sp_odrzuc = 'sp_odrzuc',
  sp_zwrot = 'sp_zwrot',
  sp_anulprzek = 'sp_anulprzek'
}

//dokument wyjścia
export enum TStatWysylki {
  tw_brak = 'tw_brak',
  tw_niewyslano = 'tw_niewyslano',
  tw_wyslano = 'tw_wyslano',
  tw_anulowano = 'tw_anulowano'
}

//skrzynka
export enum TSODParamTyp {
  ptNieznany = 'ptNieznany',
  ptString = 'ptString',
  ptBoolean = 'ptBoolean',
  ptInteger = 'ptInteger',
  ptNumeric = 'ptNumeric'
}

export enum TSkrzynki {
  tss_Sprawy ='tss_Sprawy',
  tss_SSprTermin ='tss_SSprTermin',
  tss_SSprPilne ='tss_SSprPilne',
  tss_SOtrzymane ='tss_SOtrzymane',
  tss_SZwrotne ='tss_SZwrotne',
  tss_SBiezace ='tss_SBiezace',
  tss_SPrzekazane ='tss_SPrzekazane',
  tss_SWykonane ='tss_SWykonane',
  tss_SWstrzymane ='tss_SWstrzymane',
  tss_SNadzorGl ='tss_SNadzorGl',
  tss_SNadzorEtap ='tss_SNadzorEtap',
  tzs_Zadania ='tzs_Zadania',
  tzs_ZZadTermin ='tzs_ZZadTermin',
  tzs_ZZadPilne ='tzs_ZZadPilne',
  tzs_ZOtrzymane ='tzs_ZOtrzymane',
  tzs_ZBiezace ='tzs_ZBiezace',
  tzs_ZPrzekazane ='tzs_ZPrzekazane',
  tzs_ZZlecone ='tzs_ZZlecone',
  tzs_ZZakonczone ='tzs_ZZakonczone',
  tks_Koresp ='tks_Koresp',
  tks_KOtrzymana ='tks_KOtrzymana',
  tks_KDoWgladu ='tks_KDoWgladu',
  tks_KZwrotna ='tks_KZwrotna',
  tks_KBiezaca ='tks_KBiezaca',
  tks_KPrzekazana ='tks_KPrzekazana',
  tes_korespEle ='tes_korespEle',
  tes_KEleEMail ='tes_KEleEMail',
  tes_KEleePUAPPrzych ='tes_KEleePUAPPrzych',
  tes_KEleePUAPDoWys ='tes_KEleePUAPDoWys',
  tes_KEleePUAPWyslana ='tes_KEleePUAPWyslana',
  tes_KEleDoreczPrzych ='tes_KEleDoreczPrzych',
  tes_KEleDoreczDoWys ='tes_KEleDoreczDoWys',
  tes_KEleDoreczWyslana ='tes_KEleDoreczWyslana',
  tps_Pisma ='tps_Pisma',
  tps_POtrzymane ='tps_POtrzymane',
  tps_PDoWgladu ='tps_PDoWgladu',
  tps_PDoWgladu_Wl ='tps_PDoWgladu_Wl',
  tps_PDoWgladu_Obc ='tps_PDoWgladu_Obc',
  tps_PZwrotne ='tps_PZwrotne',
  tps_PBiezace ='tps_PBiezace',
  tps_PDoPodpisu ='tps_PDoPodpisu',
  tps_PDokFinansowe ='tps_PDokFinansowe',
  tps_PPrzekazane ='tps_PPrzekazane',
  tps_PWyslane ='tps_PWyslane',
  tqs_Skladnica ='tqs_Skladnica',
  tfs_Foldery ='tfs_Foldery',
  tfs_FMojeDok ='tfs_FMojeDok',
  tfs_FRepGlob ='tfs_FRepGlob',
  tfs_FRepPryw ='tfs_FRepPryw',
  tfs_FRepOsob ='tfs_FRepOsob',
  tfs_Pulpit ='tfs_Pulpit',
  tfs_MojKomp ='tfs_MojKomp'
}

