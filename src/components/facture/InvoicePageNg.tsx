import { FC, useState, useEffect, useContext } from 'react'
import { Invoice, ProductLine } from './data/types'
import { initialInvoice, initialProductLine } from './data/initialData'
import EditableInput from './EditableInput'
import EditableTextarea from './EditableTextarea'
import Document from './Document'
import Page from './Page'
import FView from './FView'
import Text from './Text'
import { Font } from '@react-pdf/renderer'
import Download from './DownloadPDF'
import Footer from './Footer'
import ContactPdf from './ContactPdf'
import { Contact } from '../../models/Contact'
import { IconButton } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

Font.register({
  family: 'Nunito',
  fonts: [
   { src: 'https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKofINeaE.ttf' },
    {
      src: 'https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofA6sKUYevN.ttf',
      fontWeight: 600,
    }, 
  ],
})

interface Props {
  data?: Invoice,
  contact?: Contact,
  setProduitsGlobal?: any,
  produitsFactureGlobal: any,
  setProduitsFactureGlobal?: any,
  pdfMode?: boolean
  onChange?: (invoice: Invoice) => void
}

const InvoicePageNg: FC<Props> = ({ data, pdfMode, onChange, contact, setProduitsGlobal, produitsFactureGlobal, setProduitsFactureGlobal }) => {

  const [invoice, setInvoice] = useState<Invoice>(data ? { ...data } : { ...initialInvoice });
  const [subTotal, setSubTotal] = useState<number>();
  const [saleTax, setSaleTax] = useState<number>();
  // État pour stocker l'index de la ligne sélectionnée
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {

     // On filtre les produits qui ne sont pas dans produitsFactureGlobal
    const produitsSupplementaires = data.productLines.filter((produit: ProductLine) => 
      !produitsFactureGlobal.some((produitFacture: ProductLine) => produitFacture.id === produit.id)
    );
    
    // Fusionner les produits existants avec les nouveaux produits
    const fusionProduit = [...produitsFactureGlobal, ...produitsSupplementaires];
    
    if(!pdfMode){
      setProduitsFactureGlobal(fusionProduit);
    }
  }, [])


  const handleChange = (name: keyof Invoice, value: string | number) => {
    if (name !== 'productLines') {
      const newInvoice = { ...invoice }

      if (name === 'societeWidth' && typeof value === 'number') {
        newInvoice[name] = value
      } else if (name !== 'societeWidth' && typeof value === 'string') {
        newInvoice[name] = value
      }
      setInvoice(newInvoice)
    }
  }

  const handleProductLineChange = (index: number, name: keyof ProductLine, value: string) => {
    const productLines = produitsFactureGlobal.map((productLine: any, i: number) => {
      if (i === index) {
        const newProductLine = { ...productLine }

        if (name === 'description' || name === 'unite') {
          newProductLine[name] = value
        }
        else if(name === 'date'){
          newProductLine[name] = value.toString()
        }
        else {
          if (value[value.length - 1] === '.' ||
            (value[value.length - 1] === '0' && value.includes('.'))
          ) {
            newProductLine[name] = value
          } else {
            const n = parseFloat(value)
            newProductLine[name] = (n ? n : 0).toString()
          }
        }
        return newProductLine
      }
      return { ...productLine }
    })

    setProduitsFactureGlobal(productLines)
  }

  const handleRemove = (i: number) => {
    const productLines = produitsFactureGlobal.filter((_: any, index: number) => index !== i)
    setProduitsFactureGlobal(productLines)
  }

  const handleAdd = () => {
    const productLines = [...produitsFactureGlobal, { ...initialProductLine }]
    setProduitsFactureGlobal(productLines)
  }

  const calculateAmount = (quantity: string, rate: string) => {
    const quantityNumber = parseFloat(quantity)
    const rateNumber = parseFloat(rate)
    const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

    return amount.toFixed(2)
  }

  useEffect(() => {
    let subTotal = 0

    produitsFactureGlobal.forEach((productLine: any) => {
      const quantityNumber = parseFloat(productLine.quantity)
      const rateNumber = parseFloat(productLine.rate)
      const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

      subTotal += amount
    })

    setSubTotal(subTotal)
  }, [produitsFactureGlobal])

  useEffect(() => {
    const match = invoice.tax.match(/(\d+)%/)
    const taxRate = match ? parseFloat(match[1]) : 0
    const saleTax = subTotal ? (subTotal * taxRate) / 100 : 0

    setSaleTax(saleTax)
  }, [subTotal, invoice.tax])

  useEffect(() => {
    if (onChange) {
      onChange(invoice)
    }
  }, [onChange, invoice])


  // Fonction pour gérer la sélection
  const handleRowClick = (index: number) => {
    setSelectedIndex(index);
  };

  // Fonction pour réarranger les lignes
  const rearrangeLines = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= produitsFactureGlobal.length) return; // Empêche les débordements

    const updatedLines = [...produitsFactureGlobal];
    const [movedLine] = updatedLines.splice(fromIndex, 1);
    updatedLines.splice(toIndex, 0, movedLine);

    setProduitsFactureGlobal(updatedLines);
    setSelectedIndex(toIndex); // Met à jour l'index sélectionné
  };

  const handleDuplicate = (i: number) => {
    const duplicateProduct = (produitsFactureGlobal as ProductLine[])[i];
    const listUpdated = [...produitsFactureGlobal, {...duplicateProduct, id: null}];
    setProduitsFactureGlobal(listUpdated);
  }

  const mergeInvoice =  {...invoice, productLines: produitsFactureGlobal};

  return (
    <>
    <Document pdfMode={pdfMode}>
      <Page className="invoice-wrapper body-facture" pdfMode={pdfMode}>
        {!pdfMode && <Download data={mergeInvoice}
                                contact={contact}
                                produitsFactureGlobal={produitsFactureGlobal}
                                setData={(data: Invoice) => {
                                  setProduitsFactureGlobal(data.productLines)
                                  setProduitsGlobal(data.productLines)
                                  setInvoice(data)
                                }} 
          />}

        <FView className="flex" pdfMode={pdfMode}>
          <FView className="w-60" pdfMode={pdfMode}>
            <EditableInput
              className="fs-16 bold"
              placeholder="Logo ou non d’entreprise"
              value={invoice.societe}
              onChange={(value: string) => handleChange('societe', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="La rue"
              value={invoice.entrepriseRue}
              onChange={(value: string) => handleChange('entrepriseRue', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Le code postal"
              value={invoice.entrepriseCp}
              onChange={(value: string | number) => handleChange('entrepriseCp', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Coordonnées Téléphonique"
              value={invoice.coordonneesTelephonique}
              onChange={(value: string) => handleChange('coordonneesTelephonique', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Adresse email"
              value={invoice.entrepriseMail}
              onChange={(value: string) => handleChange('entrepriseMail', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Siret"
              value={invoice.numeroSiret}
              onChange={(value: string | number) => handleChange('numeroSiret', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Numéro Tva Intercommunautaire"
              value={invoice.numTvaIntercom}
              onChange={(value: string | number) => handleChange('numTvaIntercom', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Iban"
              value={invoice.iban}
              onChange={(value: string | number) => handleChange('iban', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Swift"
              value={invoice.swift}
              onChange={(value: string | number) => handleChange('swift', value)}
              pdfMode={pdfMode}
            />
          </FView>
          <FView className="w-40" pdfMode={pdfMode}>
            <EditableInput
              className="right bold fs-11"
              value={invoice.villeLe}
              onChange={(value: string) => handleChange('villeLe', value)}
              pdfMode={pdfMode}
            />
          </FView>
        </FView>

        <FView className="flex mt-20" pdfMode={pdfMode}>
          <FView className="w-70" pdfMode={pdfMode}>
            <FView className="flex w-100" pdfMode={pdfMode}>
              <FView className="w-17" pdfMode={pdfMode}>
                <EditableInput
                  className="bold"
                  value={invoice.numFactureLabel}
                  onChange={(value: string) => handleChange('numFactureLabel', value)}
                  pdfMode={pdfMode}
                />
              </FView>
              <FView className="w-40" pdfMode={pdfMode}>
                <EditableInput
                  className="left bold"
                  placeholder='21/09/20833'
                  value={invoice.numFacture}
                  onChange={(value: string | number) => handleChange('numFacture', value)}
                  pdfMode={pdfMode}
                />
              </FView>
            </FView>
          </FView>
          <FView className="w-30" pdfMode={pdfMode}>
              <ContactPdf className="flex bold" value={contact?.nom_complet} pdfMode={pdfMode} />
              <ContactPdf className="flex bold" value={contact?.adresse} pdfMode={pdfMode} />
              {contact?.adresse_bis && <ContactPdf className="flex bold" value={contact?.adresse_bis} pdfMode={pdfMode} />}
              <ContactPdf className="flex bold" value={contact?.cp?.toString().concat(' ').concat(contact?.ville)} pdfMode={pdfMode} />
          </FView>
        </FView>

        <FView pdfMode={pdfMode} wrap={true}>
          <FView className="mt-20 bg-dark flex" pdfMode={pdfMode}>
            <FView className="w-15 p-4-8" pdfMode={pdfMode}>
              <EditableInput
                className="white bold fs-10"
                value={invoice.productLineDate}
                onChange={(value: string) => handleChange('productLineDate', value)}
                pdfMode={pdfMode}
              />
            </FView>
            <FView className="w-42 p-4-8" pdfMode={pdfMode}>
              <EditableInput
                className="white bold fs-10"
                value={invoice.productLineDescription}
                onChange={(value: string) => handleChange('productLineDescription', value)}
                pdfMode={pdfMode}
              />
            </FView>
            <FView className="w-18 p-4-8" pdfMode={pdfMode}>
              <EditableInput
                className="white bold right fs-10"
                value={invoice.productLineQuantity}
                onChange={(value: string | number) => handleChange('productLineQuantity', value)}
                pdfMode={pdfMode}
              />
            </FView>
            <FView className="w-20 p-4-8" pdfMode={pdfMode}>
              <EditableInput
                className="white bold right fs-10"
                value={invoice.productLineUnite}
                onChange={(value: string | number) => handleChange('productLineUnite', value)}
                pdfMode={pdfMode}
              />
            </FView>
            <FView className="w-15 p-4-8" pdfMode={pdfMode}>
              <EditableInput
                className="white bold right fs-10"
                value={invoice.productLineUniteHT}
                onChange={(value: string | number) => handleChange('productLineUniteHT', value)}
                pdfMode={pdfMode}
              />
            </FView>
            <FView className="w-18 p-4-8" pdfMode={pdfMode}>
              <EditableInput
                className="white bold right fs-10"
                value={invoice.productLineMontantHT}
                onChange={(value: string | number) => handleChange('productLineMontantHT', value)}
                pdfMode={pdfMode}
              />
            </FView>
          </FView>

          {produitsFactureGlobal.map((productLine: any, i: number) => {

            const isSelected = i === selectedIndex; // Vérifier si la ligne est sélectionnée

            return pdfMode && productLine.description === '' ? (
              <Text key={i}></Text>
            ) : (

            <div key={i} onClick={() => handleRowClick(i)}>
              <FView
                className={`row flex ${isSelected ? 'highlight' : ''}`} // Ajout de la classe conditionnelle
                pdfMode={pdfMode}
              >
              {/* <FView key={i} className="row flex" pdfMode={pdfMode}> */}
                <FView className="w-15 fs-11" pdfMode={pdfMode}>
                  <EditableInput
                    className="dark right"
                    value={productLine.date}
                    onChange={(value: string) => handleProductLineChange(i, 'date', value)}
                    pdfMode={pdfMode}
                  />
                </FView>
                <FView className="w-42 p-2-8 fs-11" pdfMode={pdfMode}>
                  <EditableTextarea
                    className="dark"
                    rows={2}
                    placeholder="Entrer nom/description"
                    value={productLine.description}
                    onChange={(value: string) => handleProductLineChange(i, 'description', value)}
                    pdfMode={pdfMode}
                  />
                </FView>
                <FView className="w-18 p-2-8 fs-11" pdfMode={pdfMode}>
                  <EditableInput
                    className="dark right"
                    value={productLine.quantity}
                    onChange={(value: string) => handleProductLineChange(i, 'quantity', value)}
                    pdfMode={pdfMode}
                  />
                </FView>
                <FView className="w-20 p-2-8 fs-11" pdfMode={pdfMode}>
                  <EditableInput
                    className="dark right"
                    value={productLine.unite}
                    onChange={(value: string) => handleProductLineChange(i, 'unite', value)}
                    pdfMode={pdfMode}
                  />
                </FView>
                <FView className="w-15 p-5-8 fs-11" pdfMode={pdfMode}>
                  <EditableInput
                    className="dark right"
                    value={productLine.rate}
                    onChange={(value: string) => handleProductLineChange(i, 'rate', value)}
                    pdfMode={pdfMode}
                  />
                </FView>
                <FView className="w-18 p-2-8 fs-11" pdfMode={pdfMode}>
                  <Text className="dark right" pdfMode={pdfMode}>
                    {calculateAmount(productLine.quantity, productLine.rate)}
                  </Text>
                </FView>

                 {/* Boutons Monter / Descendre */}
                  {!pdfMode && (
                    <div className="row__controls">
                      <button
                        className="link"
                        title="Monter"
                        onClick={(e) => {
                          e.stopPropagation();
                          rearrangeLines(i, i - 1); // Monter l'élément
                        }}
                      >
                        ▲
                      </button>
                      <button
                        className="link"
                        title="Descendre"
                        onClick={(e) => {
                          e.stopPropagation();
                          rearrangeLines(i, i + 1); // Descendre l'élément
                        }}
                      >
                        ▼
                      </button>
                    </div>
                  )}
                  
                {!pdfMode && (
                   <div  className="row__remove">
                      <IconButton aria-label="dupliquer" size="small" onClick={() => handleDuplicate(i)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton aria-label="Supprimer ligne" size="small" onClick={() => handleRemove(i)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                   </div>
                )}
              </FView>
            </div>
            )
          })}

          <FView className="flex" pdfMode={pdfMode}>
            <FView className="w-50 mt-10" pdfMode={pdfMode}>
              {!pdfMode && (

                <IconButton aria-label="add" size="small" onClick={handleAdd}>
                  <AddIcon fontSize="small" />
                </IconButton>
              )}
            </FView>
            <FView wrap={false} className="w-50 mt-10" pdfMode={pdfMode}>
              <FView className="flex" pdfMode={pdfMode}>
                <FView className="w-70 p-5" pdfMode={pdfMode}>
                  <EditableInput
                    className="fs-11"
                    value={invoice.sousTotalMontantHT}
                    onChange={(value: string | number) => handleChange('sousTotalMontantHT', value)}
                    pdfMode={pdfMode}
                  />
                </FView>
                <FView className="w-30 p-5" pdfMode={pdfMode}>
                  <Text className="right bold dark fs-11" pdfMode={pdfMode}>
                    {subTotal?.toFixed(2)}
                  </Text>
                </FView>
              </FView>
              <FView className="flex" pdfMode={pdfMode}>
                <FView className="w-50 p-5" pdfMode={pdfMode}>
                  <EditableInput
                    className="fs-11"
                    value={invoice.taxLabel}
                    onChange={(value: string | number) => handleChange('taxLabel', value)}
                    pdfMode={pdfMode}
                  />
                </FView>
                <FView className="w-50 right p-5" pdfMode={pdfMode}>
                  <EditableInput
                    className="right fs-11"
                    value={invoice.tax}
                    onChange={(value: string | number) => handleChange('tax', value)}
                    pdfMode={pdfMode}
                  />
                </FView>
                <FView className="w-30 p-5" pdfMode={pdfMode}>
                  <Text className="right bold dark fs-11" pdfMode={pdfMode}>
                    {saleTax?.toFixed(2)}
                  </Text>
                </FView>
              </FView>
              <FView className="flex bg-gray p-5" pdfMode={pdfMode}>
                <FView className="w-70 p-5" pdfMode={pdfMode}>
                  <EditableInput
                    className="bold fs-11"
                    value={invoice.totalTTC}
                    onChange={(value: string | number) => handleChange('totalTTC', value)}
                    pdfMode={pdfMode}
                  />
                </FView>
                <FView className="w-30 p-5 flex" pdfMode={pdfMode}>
                  <Text className="right bold dark w-auto fs-11" pdfMode={pdfMode}>
                    {(typeof subTotal !== 'undefined' && typeof saleTax !== 'undefined'
                      ? subTotal + saleTax
                      : 0
                    ).toFixed(2)}
                  </Text>
                </FView>
              </FView>
            </FView>
          </FView>
        </FView>

        <Footer pdfMode={pdfMode} conditionsReglement={invoice.conditionsReglement} term={invoice.term}></Footer>

      </Page>
    </Document>
    </>
  )
}

export default InvoicePageNg
