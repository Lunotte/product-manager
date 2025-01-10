import { FC, PropsWithChildren } from 'react'
import { View as PdfView } from '@react-pdf/renderer'
import compose from './styles/compose'

interface Props {
  className?: string
  pdfMode?: boolean
  wrap?: boolean
}

const FView: FC<PropsWithChildren<Props>> = ({ className, pdfMode, children, wrap }) => {
  return (
    <>
      {pdfMode ? (
        <PdfView wrap={wrap} style={compose('view ' + (className ? className : ''))}>{children}</PdfView>
      ) : (
        <div className={'view ' + (className ? className : '')}>{children}</div>
      )}
    </>
  )
}

export default FView
