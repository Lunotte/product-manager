import React, { FC } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Invoice, TInvoice } from './data/types'
import { useDebounce } from '@uidotdev/usehooks'
import InvoicePage from './InvoicePageNg'
import FileSaver from 'file-saver'

interface Props {
  data: Invoice
  setData(data: Invoice): void
}

const Download: FC<Props> = ({ data, setData }) => {
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
          console.info('parsed correctly')
          setData(dParsed)
        } catch (e) {
          console.error(e)
          return
        }
      })
      .catch((err) => console.error(err))
  }

  function handleSaveTemplate() {
    const blob = new Blob([JSON.stringify(debounced)], {
      type: 'text/plain;charset=utf-8',
    })
    FileSaver(blob, title + '.template')
  }

  const title = data.numFacture ? `Facture n°${data.numFacture}` : 'facture';

  return (
    <div className={'download-pdf '}>
      <PDFDownloadLink
        key={JSON.stringify(debounced)}
        document={<InvoicePage pdfMode={true} data={debounced} />}
        fileName={`${title}.pdf`}
        aria-label="Sauvegarder PDF"
        title="Sauvegarder PDF"
        className="download-pdf__pdf"
      ></PDFDownloadLink>
      <p className="text-small">Sauvegarder PDF</p>

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
