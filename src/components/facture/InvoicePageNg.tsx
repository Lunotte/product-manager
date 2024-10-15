import { FC, useState, useEffect, Profiler } from 'react'
import { Invoice, ProductLine } from './data/types'
import { initialInvoice, initialProductLine } from './data/initialData'
import EditableInput from './EditableInput'
import EditableTextarea from './EditableTextarea'
import Document from './Document'
import Page from './Page'
import View from './View'
import Text from './Text'
import { Font } from '@react-pdf/renderer'
import Download from './DownloadPDF'
import EditableCalendarInput from './EditableCalendarInput'
// import EditableCalendarInput from './EditableCalendarInput'
import { format } from 'date-fns/format'

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
  // produits: Produit[],
  pdfMode?: boolean
  onChange?: (invoice: Invoice) => void
}

const InvoicePageNg: FC<Props> = ({ data, pdfMode, onChange }) => {

  const [invoice, setInvoice] = useState<Invoice>(data ? { ...data } : { ...initialInvoice })
  const [subTotal, setSubTotal] = useState<number>()
  const [saleTax, setSaleTax] = useState<number>()

  const dateFormat = 'MMM dd, yyyy';

  const handleChange = (name: keyof Invoice, value: string | number) => {
    if (name !== 'productLines') {
      const newInvoice = { ...invoice }

      if (name === 'logoWidth' && typeof value === 'number') {
        newInvoice[name] = value
      } else if (name !== 'logoWidth' && typeof value === 'string') {
        newInvoice[name] = value
      }
      // console.log(newInvoice);
      
      setInvoice(newInvoice)
    }
  }

  const handleProductLineChange = (index: number, name: keyof ProductLine, value: string) => {
    const productLines = invoice.productLines.map((productLine: any, i: any) => {
      if (i === index) {
        const newProductLine = { ...productLine }

        if (name === 'description') {
          newProductLine[name] = value
        }
        else if(name === 'date'){
          console.log(newProductLine, name, value);
          
          newProductLine[name] = value.toString()
          console.log(newProductLine);
          
        }
        else {
          if (
            value[value.length - 1] === '.' ||
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

    setInvoice({ ...invoice, productLines })
  }

  const handleRemove = (i: number) => {
    const productLines = invoice.productLines.filter((_: any, index: any) => index !== i)

    setInvoice({ ...invoice, productLines })
  }

  const handleAdd = () => {
    const productLines = [...invoice.productLines, { ...initialProductLine }]

    setInvoice({ ...invoice, productLines })
  }

  const calculateAmount = (quantity: string, rate: string) => {
    const quantityNumber = parseFloat(quantity)
    const rateNumber = parseFloat(rate)
    const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

    return amount.toFixed(2)
  }

  useEffect(() => {
    let subTotal = 0

    invoice.productLines.forEach((productLine: any) => {
      const quantityNumber = parseFloat(productLine.quantity)
      const rateNumber = parseFloat(productLine.rate)
      const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

      subTotal += amount
    })

    setSubTotal(subTotal)
  }, [invoice.productLines])

  useEffect(() => {
    // const match = invoice.taxLabel.match(/(\d+)%/)
    // const taxRate = match ? parseFloat(match[1]) : 0
    const taxRate = parseFloat(invoice.tax);
    const saleTax = subTotal ? (subTotal * taxRate) / 100 : 0

    setSaleTax(saleTax)
  }, [subTotal, invoice.tax])

  useEffect(() => {
    if (onChange) {
      onChange(invoice)
    }
  }, [onChange, invoice])

  // console.log(invoice);
  

  return (
    <Document pdfMode={pdfMode}>
      <Page className="invoice-wrapper" pdfMode={pdfMode}>
        {!pdfMode && <Download data={invoice} setData={(d: any) => setInvoice(d)} />}

        <View className="flex" pdfMode={pdfMode}>
          <View className="w-60" pdfMode={pdfMode}>
            <EditableInput
              className="fs-16 bold"
              placeholder="Your Company"
              value={invoice.logo}
              onChange={(value: any) => handleChange('companyName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Your Company"
              value={invoice.companyName}
              onChange={(value: any) => handleChange('companyName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Your Company"
              value={invoice.companyCp}
              onChange={(value: any) => handleChange('companyCp', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Your Name"
              value={invoice.name}
              onChange={(value: any) => handleChange('name', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="Company's Address"
              value={invoice.companyAddress}
              onChange={(value: any) => handleChange('companyAddress', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="City, State Zip"
              value={invoice.companyAddress2}
              onChange={(value: any) => handleChange('companyAddress2', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="City, State Zip"
              value={invoice.companyCountry}
              onChange={(value: any) => handleChange('companyAddress2', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              className="fs-11"
              placeholder="City, State Zip"
              value={invoice.iban}
              onChange={(value: any) => handleChange('companyAddress2', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-40" pdfMode={pdfMode}>
            <EditableInput
              className="right bold fs-11"
              placeholder="Invoice"
              value={invoice.title}
              onChange={(value: any) => handleChange('title', value)}
              pdfMode={pdfMode}
            />
          </View>
        </View>

        <View className="flex mt-20" pdfMode={pdfMode}>
          <View className="w-60" pdfMode={pdfMode}>
            <View className="flex w-100" pdfMode={pdfMode}>
              <View className="w-20" pdfMode={pdfMode}>
                <EditableInput
                  className="bold fs-11"
                  value={invoice.billTo}
                  onChange={(value: any) => handleChange('billTo', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-80" pdfMode={pdfMode}>
                <EditableInput
                  className="bold fs-11"
                  placeholder='21/09/20833'
                  value={invoice.clientName}
                  onChange={(value: any) => handleChange('clientName', value)}
                  pdfMode={pdfMode}
                />
              </View>
            </View>
          </View>
          <View className="w-40" pdfMode={pdfMode}>
            <View className="flex" pdfMode={pdfMode}>
              <View className="w-100" pdfMode={pdfMode}>
                <EditableInput
                  className="bold right fs-11"
                  value={invoice.invoiceTitleLabel}
                  onChange={(value: any) => handleChange('invoiceTitleLabel', value)}
                  pdfMode={pdfMode}
                />
              </View>
            </View>
            <View className="flex" pdfMode={pdfMode}>
              <View className="w-100" pdfMode={pdfMode}>
                <EditableInput
                  className="bold right fs-11"
                  value={invoice.invoiceDateLabel}
                  onChange={(value: any) => handleChange('invoiceDateLabel', value)}
                  pdfMode={pdfMode}
                />
              </View>
            </View>
            <View className="flex" pdfMode={pdfMode}>
              <View className="w-100" pdfMode={pdfMode}>
                <EditableInput
                  className="bold right fs-11"
                  value={invoice.invoiceDueDateLabel}
                  onChange={(value: any) => handleChange('invoiceDueDateLabel', value)}
                  pdfMode={pdfMode}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="mt-20 bg-dark flex" pdfMode={pdfMode}>
          <View className="w-5 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold fs-10"
              value={invoice.productLineDate}
              onChange={(value: any) => handleChange('productLineDate', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-48 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold fs-10"
              value={invoice.productLineDescription}
              onChange={(value: any) => handleChange('productLineDescription', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-15 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold right fs-10"
              value={invoice.productLineQuantity}
              onChange={(value: any) => handleChange('productLineQuantity', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-7 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold right fs-10"
              value={invoice.productLineUnite}
              onChange={(value: any) => handleChange('productLineUnite', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-7 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold right fs-10"
              value={invoice.productLineQuantityRate}
              onChange={(value: any) => handleChange('productLineQuantityRate', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-18 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold right fs-10"
              value={invoice.productLineQuantityAmount}
              onChange={(value: any) => handleChange('productLineQuantityAmount', value)}
              pdfMode={pdfMode}
            />
          </View>
        </View>

        {invoice.productLines.map((productLine: any, i: any) => {
          return pdfMode && productLine.description === '' ? (
            <Text key={i}></Text>
          ) : (
            <View key={i} className="row flex" pdfMode={pdfMode}>
              <View className="w-5" pdfMode={pdfMode}>
                {/* <EditableCalendarInput
                  value={productLine.date}
                  onChange={(date) =>
                    handleProductLineChange(
                      i, 
                      'date',
                      date && !Array.isArray(date) ? format(date, dateFormat) : '',
                    )
                  }
                  pdfMode={pdfMode}
                /> */}
                <EditableInput
                  className="dark right"
                  value={productLine.date}
                  onChange={(value: any) => handleProductLineChange(i, 'date', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-48 p-2-8" pdfMode={pdfMode}>
                <EditableTextarea
                  className="dark"
                  rows={2}
                  placeholder="Enter item name/description"
                  value={productLine.description}
                  onChange={(value: any) => handleProductLineChange(i, 'description', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-15 p-2-8" pdfMode={pdfMode}>
                <EditableInput
                  className="dark right"
                  value={productLine.quantity}
                  onChange={(value: any) => handleProductLineChange(i, 'quantity', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-7 p-2-8" pdfMode={pdfMode}>
                <EditableInput
                  className="dark right"
                  value={productLine.unite}
                  onChange={(value: any) => handleProductLineChange(i, 'unite', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-7 p-5-8" pdfMode={pdfMode}>
                <EditableInput
                  className="dark right"
                  value={productLine.rate}
                  onChange={(value: any) => handleProductLineChange(i, 'rate', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-18 p-2-8" pdfMode={pdfMode}>
                <Text className="dark right" pdfMode={pdfMode}>
                  {calculateAmount(productLine.quantity, productLine.rate)}
                </Text>
              </View>
              {!pdfMode && (
                <button
                  className="link row__remove"
                  aria-label="Remove Row"
                  title="Remove Row"
                  onClick={() => handleRemove(i)}
                >
                  <span className="icon icon-remove bg-red"></span>
                </button>
              )}
            </View>
          )
        })}

        <View className="flex" pdfMode={pdfMode}>
          <View className="w-50 mt-10" pdfMode={pdfMode}>
            {!pdfMode && (
              <button className="link" onClick={handleAdd}>
                <span className="icon icon-add bg-green mr-10"></span>
                Add Line Item
              </button>
            )}
          </View>
          <View className="w-50 mt-10" pdfMode={pdfMode}>
            <View className="flex" pdfMode={pdfMode}>
              <View className="w-70 right p-5" pdfMode={pdfMode}>
                <EditableInput
                  className="fs-11"
                  value={invoice.subTotalLabel}
                  onChange={(value: any) => handleChange('subTotalLabel', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-30 p-5" pdfMode={pdfMode}>
                <Text className="right bold dark fs-11" pdfMode={pdfMode}>
                  {subTotal?.toFixed(2)}
                </Text>
              </View>
            </View>
            <View className="flex" pdfMode={pdfMode}>
              <View className="w-50 right p-5" pdfMode={pdfMode}>
                <EditableInput
                  className="fs-11"
                  value={invoice.taxLabel}
                  onChange={(value: any) => handleChange('taxLabel', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-50 right p-5" pdfMode={pdfMode}>
                <EditableInput
                  className="right fs-11"
                  value={invoice.tax}
                  onChange={(value: any) => handleChange('tax', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-30 p-5" pdfMode={pdfMode}>
                <Text className="right bold dark fs-11" pdfMode={pdfMode}>
                  {saleTax?.toFixed(2)}
                </Text>
              </View>
            </View>
            <View className="flex bg-gray p-5" pdfMode={pdfMode}>
              <View className="w-70 p-5" pdfMode={pdfMode}>
                <EditableInput
                  className="bold fs-11"
                  value={invoice.totalLabel}
                  onChange={(value: any) => handleChange('totalLabel', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-30 p-5 flex" pdfMode={pdfMode}>
                <Text className="right bold dark w-auto fs-11" pdfMode={pdfMode}>
                  {(typeof subTotal !== 'undefined' && typeof saleTax !== 'undefined'
                    ? subTotal + saleTax
                    : 0
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-20" pdfMode={pdfMode}>
          <EditableTextarea
            className="w-100 pied-page"
            rows={3}
            value={invoice.notes}
            onChange={(value: any) => handleChange('notes', value)}
            pdfMode={pdfMode}
          />
        </View>
        <View className="mt-10 w-100 bg-gray" pdfMode={pdfMode}>
          <View className="w-70 center-2" pdfMode={pdfMode}>
            <EditableTextarea
              className="pied-page-2"
              rows={2}
              value={invoice.term}
              onChange={(value: any) => handleChange('term', value)}
              pdfMode={pdfMode}
            />
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default InvoicePageNg
