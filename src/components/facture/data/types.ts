import { CSSProperties } from 'react'
import { z, TypeOf } from 'zod'

export interface ProductLine {
  date: string
  description: string
  quantity: string
  unite: string
  rate: string
}

export const TProductLine = z.object({
  date: z.string(),
  description: z.string(),
  quantity: z.string(),
  unite: z.string(),
  rate: z.string(),
})

export const TInvoice = z.object({
  invoiceTitle: z.string(),
  societe: z.string(),
  societeWidth: z.number(),
  villeLe: z.string(),
  entrepriseRue: z.string(),
  entrepriseCp: z.string(),
  coordonneesTelephonique: z.string(),
  entrepriseMail: z.string(),
  numeroSiret: z.string(),
  numTvaIntercom: z.string(),
  iban: z.string(),
  swift: z.string(),
  numFactureLabel: z.string(),
  numFacture: z.string(),
  productLineDate: z.string(),
  productLineDescription: z.string(),
  productLineQuantity: z.string(),
  productLineUnite: z.string(),
  productLineUniteHT: z.string(),
  productLineMontantHT: z.string(),
  productLines: z.array(TProductLine),
  sousTotalMontantHT: z.string(),
  taxLabel: z.string(),
  tax: z.string(),
  totalTTC: z.string(),
  conditionsReglementLabel: z.string(),
  conditionsReglement: z.string(),
  term: z.string(),
})

export type Invoice = TypeOf<typeof TInvoice>

export interface CSSClasses {
  [key: string]: CSSProperties
}
