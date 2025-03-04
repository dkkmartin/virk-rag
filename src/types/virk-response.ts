export interface Root {
  data: VirkData;
}

export interface VirkData {
  antalAnsatte: AntalAnsatte;
  ejerforhold: Ejerforhold;
  foreningsrepraesentanter: unknown[];
  harManuelSignering: boolean;
  historiskStamdata: HistoriskStamdata;
  hovedselskab: unknown;
  oplysningerOmRevisionsvirksomhed: unknown;
  personkreds: Personkreds;
  produktionsenheder: Produktionsenheder;
  sammenhaengendeRegnskaber: unknown[];
  skjulOevrigeDokumenter: boolean;
  stamdata: Stamdata2;
  udvidedeOplysninger: UdvidedeOplysninger;
  virksomhedRegistreringer: unknown[];
  virksomhedsMeddelelser: unknown[];
}

export interface AntalAnsatte {
  kvartalsbeskaeftigelse: unknown[];
  maanedsbeskaeftigelse: unknown[];
}

export interface Ejerforhold {
  aktiveLegaleEjere: unknown[];
  aktiveReelleEjere: unknown[];
  begunstigetGruppeNavn: unknown;
  begunstigetGruppeRetskrav: unknown;
  bestyrelseAnsesSomReelleEjere: boolean;
  ejerregistreringUnderFemProcent: boolean;
  ophoerteLegaleEjere: unknown[];
  ophoerteReelleEjere: unknown[];
  virksomhedHarIkkeKunnetIdentificereReelleEjereLedelseErIndsat: boolean;
  virksomhedHarIkkeReelleEjereOgLedelseErIndsat: boolean;
}

export interface HistoriskStamdata {
  adresse: unknown[];
  bibranche: unknown[];
  branchekode: Branchekode[];
  formaal: unknown[];
  navn: unknown[];
  registreretKapital: unknown[];
  senesteVedtaegtsdato: unknown[];
  status: unknown[];
  tegningsregel: unknown[];
  udenlandskAdresse: unknown[];
  virksomhedsform: unknown[];
}

export interface Branchekode {
  gyldigFra: string;
  gyldigTil: string;
  vaerdi: string;
}

export interface Personkreds {
  ejerborgLink: string;
  ophoerteFad: unknown[];
  personkredser: Personkredser[];
  tegningsregel: unknown;
}

export interface Personkredser {
  personRoller: PersonRoller[];
  rolle: Rolle;
  rolleTekstnogle: string;
}

export interface PersonRoller {
  adresse: string;
  ekstraData: string;
  ekstraDataList: unknown[];
  enhedstype: string;
  id: string;
  personType: string;
  senesteNavn: string;
  sorteringsVaredi: number;
  titlePrefix: unknown[];
}

export interface Rolle {
  declaringClass: string;
  funktionsVaerdi: string[];
  hovedType: string[];
  sorteringsVaerdi: number;
  tekstnogle: string;
}

export interface Produktionsenheder {
  aktiveProduktionsenheder: AktiveProduktionsenheder[];
  ophoerteProduktionsenheder: unknown[];
}

export interface AktiveProduktionsenheder {
  antalAnsatte: unknown;
  historiskStamdata: unknown;
  revisionsvirksomhed: unknown;
  stamdata: Stamdata;
}

export interface Stamdata {
  adresse: string;
  bibrancher: unknown[];
  bygningsnummer: unknown;
  cvrnummer: string;
  email: string;
  helligdagsaabent: boolean;
  hovedbranche: Hovedbranche;
  navn: string;
  ophoersdato: unknown;
  pnummer: string;
  postnummerOgBy: string;
  registreretIHvidvaskregistret: boolean;
  regnskabsperiodeSlut: unknown;
  regnskabsperiodeStart: unknown;
  reklamebeskyttet: boolean;
  startdato: string;
  telefon: unknown;
  udenlandskAdresse: unknown;
  udenlandskAdresseLand: string;
  udenlandskAdresseLandekode: string;
  virksomhedsnavn: unknown;
}

export interface Hovedbranche {
  branchekode: string;
  titel: string;
}

export interface Stamdata2 {
  adresse: string;
  aktiviteterOmfattetAfHvidvaskloven: unknown[];
  bygningsnummer: unknown;
  cvrnummer: string;
  enhedsnummer: string;
  harPseudoCvr: boolean;
  kreditoplysningskode: unknown;
  modervirksomhederVedFranchise: unknown[];
  navn: string;
  omfattetAfHvidvaskloven: boolean;
  ophoersdato: unknown;
  postnummerOgBy: string;
  regnummer: unknown;
  reklamebeskyttet: boolean;
  socialoekonomiskVirksomhed: boolean;
  startdato: string;
  statsligVirksomhed: boolean;
  status: string;
  stiftetFor1900Tekstnogle: unknown;
  udenlandskAdresse: unknown;
  udenlandskAdresseLand: string;
  udenlandskAdresseLandekode: string;
  virkningsdato: string;
  virksomhedsform: string;
  virksomhedsformKode: string;
  visNavnPostfix: boolean;
}

export interface UdvidedeOplysninger {
  bibrancher: unknown[];
  binavne: unknown[];
  boersnoteret: unknown;
  delvistIndbetaltKapital: boolean;
  email: string;
  fax: unknown;
  foersteRegnskabsperiodeSlut: unknown;
  foersteRegnskabsperiodeStart: unknown;
  formaal: unknown;
  hovedbranche: Hovedbranche2;
  kapitalklasser: unknown;
  kommune: string;
  kommunekode: string;
  koncessionsdato: unknown;
  omlaegningsperiodeSlut: unknown;
  omlaegningsperiodeStart: unknown;
  postadresse: unknown;
  registreretKapital: unknown;
  regnskabsaarSlut: unknown;
  regnskabsaarStart: unknown;
  senesteVedtaegtsdato: unknown;
  senesteVedtaegtsdatoFoer1900: boolean;
  stadfaestelsesdato: unknown;
  stadfaestetAf: unknown;
  telefon: unknown;
  telefonSekundaert: unknown;
  udenlandskPostadresse: unknown;
  udenlandskPostadresseLand: unknown;
  udenlandskPostadresseLandekode: unknown;
}

export interface Hovedbranche2 {
  branchekode: string;
  titel: string;
}
