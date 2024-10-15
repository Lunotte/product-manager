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
  logo: 'SARL E. PIGOUCHET',
  logoWidth: 100,
  title: 'Ozeville, le ' + genererDate(),
  companyName: 'N°13 Les landes',
  companyCp: '50310 OZEVILLE',
  name: 'Tél: 02.33.41.24.96 - FAX: 02.33.41.39.50',
  companyAddress: 'Mail: eugene.pigouchet@orange.fr',
  companyAddress2: 'SIRET 425 001 708 00014',
  companyCountry: 'N° TVA INTERCOMMUNAUTAIRE: FR 82425001708',
  iban: 'IBAN: FR76 1380 7006 1561 0219 8859 193 SWIFT: CCBPFRPPNAN',
  billTo: 'FACTURE N° ',
  clientName: '',
  clientAddress: '',
  clientAddress2: '',
  clientCountry: 'United States',
  invoiceTitleLabel: 'M. BEAUGRAND Benjamin',
  invoiceTitle: '',
  invoiceDateLabel: '36 Rue des Landes',
  invoiceDate: '',
  invoiceDueDateLabel: '50310 Ozeville',
  invoiceDueDate: '',
  productLineDate: 'DATE',
  productLineDescription: 'DÉSIGNATION',
  productLineQuantity: 'QUANTITÉ',
  productLineUnite: 'UNITÉ',
  productLineQuantityRate: 'UNITE H.T',
  productLineQuantityAmount: 'MONTANT H.T',
  productLines: [
    {
      description: 'Brochure Design',
      quantity: '2',
      rate: '100.00',
    },
    // { ...initialProductLine },
    // { ...initialProductLine },
  ],
  subTotalLabel: 'MONTANT H.T. EN EUROS',
  taxLabel: 'TVA',
  tax: '20',
  totalLabel: 'MONTANT T.T.C EN EUROS',
  currency: '$',
  notesLabel: 'CONDITIONS DE REGLEMENT',
  notes: 'CONDITIONS DE REGLEMENT: Sauf accord préalable, nos factures sont payables comptant, sans escompte. Tout retard de paiement entraînera une pénalité au taux pratiqué par la Banque Centrale Européenne pour ses opérations de refinancement majoré de 10 points, et au paiement d’une indemnité forfaitaire pour frais de recouvrement d’un montant de 40 € selon l’article L441-6 du Code du Commerce, ainsi qu’une clause pérale de 15% sur les sommes dues, à titre de préjudice.',
  termLabel: 'Terms & Conditions',
  term: 'VENTES DE TOUS MATERIAUX DE CONSTRUCTION - TRANSPORTS FABRICATION - VENTE ET POSE DE MENUISERIES BOIS, ALU ET PVC',
}
