import { ProductLine, Invoice } from './types'

export const initialProductLine: ProductLine = {
  date: '',
  description: '',
  quantity: '1',
  unite: '',
  rate: '0.00',
}

const genererDate = () => {
  const date = new Date();
  return new Intl.DateTimeFormat('fr-FR', {dateStyle: 'long'}).format(date);
}

export const initialInvoice: Invoice = {
  invoiceTitle: '',
  societe: 'SARL E. PIGOUCHET',
  societeWidth: 100,
  villeLe: 'Ozeville, le ' + genererDate(),
  entrepriseRue: 'N°13 Les landes',
  entrepriseCp: '50310 OZEVILLE',
  coordonneesTelephonique: 'Tél: 02.33.41.24.96 - FAX: 02.33.41.39.50',
  entrepriseMail: 'Mail: eugene.pigouchet@orange.fr',
  numeroSiret: 'SIRET 425 001 708 00014',
  numTvaIntercom: 'N° TVA INTERCOMMUNAUTAIRE: FR 82425001708',
  iban: 'IBAN: FR76 1380 7006 1561 0219 8859 193 SWIFT: CCBPFRPPNAN',
  numFactureLabel: 'FACTURE N° ',
  numFacture: '',
  clientCountry: 'United States',
  quiCreeFacture: 'M. BEAUGRAND Benjamin',
  adresseQuiFacture: '36 Rue des Landes',
  adresse2QuiFacture: '50310 Ozeville',
  productLineDate: 'DATE',
  productLineDescription: 'DÉSIGNATION',
  productLineQuantity: 'QUANTITÉ',
  productLineUnite: 'UNITÉ',
  productLineUniteHT: 'UNITE H.T',
  productLineMontantHT: 'MONTANT H.T',
  productLines: [
    // {
    //   description: 'Brochure Design',
    //   quantity: '2',
    //   rate: '100.00',
    // },
    // { ...initialProductLine },
    // { ...initialProductLine },
  ],
  sousTotalMontantHT: 'MONTANT H.T. EN EUROS',
  taxLabel: 'TVA',
  tax: '20%',
  totalTTC: 'MONTANT T.T.C EN EUROS',
  conditionsReglementLabel: 'CONDITIONS DE REGLEMENT',
  conditionsReglement: 'CONDITIONS DE REGLEMENT: Sauf accord préalable, nos factures sont payables comptant, sans escompte. Tout retard de paiement entraînera une pénalité au taux pratiqué par la Banque Centrale Européenne pour ses opérations de refinancement majoré de 10 points, et au paiement d’une indemnité forfaitaire pour frais de recouvrement d’un montant de 40 € selon l’article L441-6 du Code du Commerce, ainsi qu’une clause pérale de 15% sur les sommes dues, à titre de préjudice.',
  term: 'VENTES DE TOUS MATERIAUX DE CONSTRUCTION - TRANSPORTS FABRICATION - VENTE ET POSE DE MENUISERIES BOIS, ALU ET PVC',
}
