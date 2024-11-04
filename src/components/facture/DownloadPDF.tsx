import React, { FC, useContext, useMemo } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Invoice, TInvoice } from './data/types'
import { useDebounce } from '@uidotdev/usehooks'
import InvoicePage from './InvoicePageNg'
import FileSaver from 'file-saver'
import { ContactContext } from '../home'

interface Props {
  data: Invoice
  setData(data: Invoice): void
}

const Download: FC<Props> = ({ data, setData }) => {

  const {contactGlobal} = useContext(ContactContext);
  const debounced = useDebounce(data, 500)

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return

    const file = e.target.files[0]
    file
      .text()
      .then((str: string) => {
        try {
          if (!(str.startsWith('{') && str.endsWith('}'))) {
            str = atob(str)
          }
          const d = JSON.parse(str)
          const dParsed = TInvoice.parse(d)
          setData(dParsed)
        } catch (e) {
          window.electronAPI.logError(e);
          return
        }
      })
      .catch((err) => window.electronAPI.logError(err))
  }

  function handleSaveTemplate() {
    const blob = new Blob([JSON.stringify(debounced)], {
      type: 'text/plain;charset=utf-8',
    })
    FileSaver(blob, title + '.template')
  }
  
  // const title = data.numFacture ? `${data.numFactureLabel} ${data.numFacture}` : data.numFactureLabel;

  /**
   * Si un numéro de facture est défini et si on a un client qui a été défini = numFactureLabel + numFacture + nomComplet,
   * sinon numFctureLabel + numFacture
   * Sinon si client défini alors concat numFactureLabel + numFacture, sinon seulement numFactureLabel
   *  
   * @returns Le titre concaténé aux éléments accessibles
   */
  const title = () => {
    if(data.numFacture) {
      if(contactGlobal && contactGlobal.contact) {
        return `${data.numFactureLabel}${data.numFacture} - ${contactGlobal.contact.nom_complet}`; 
      } else {
        return `${data.numFactureLabel}${data.numFacture}`;
      }
    } else {
      if(contactGlobal && contactGlobal.contact) {
        return `${data.numFactureLabel} - ${contactGlobal.contact.nom_complet}`; 
      }
      return data.numFactureLabel;
    }
  }

  return (
    <div className={'download-pdf '}>
      <PDFDownloadLink
        key={JSON.stringify(debounced)}
        document={<InvoicePage pdfMode={true} data={debounced} contact={contactGlobal?.contact}/>}
        fileName={`${title()}.pdf`}
        aria-label="Générer PDF"
        title="Générer PDF"
        className="download-pdf__pdf"
      ></PDFDownloadLink>
      <p className="text-small">Générer PDF</p>

      <button
        onClick={handleSaveTemplate}
        aria-label="Sauvegarder Template"
        title="Sauvegarder Template"
        className="download-pdf__template_download mt-20"
      />
      <p className="text-small">Sauvegarder Template</p>

      <label className="download-pdf__template_upload mt-20">
        <input type="file" accept=".json,.template" onChange={handleInput} />
      </label>
      <p className="text-small">Upload Template</p>
    </div>
  )
}

export default Download
