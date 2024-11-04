import { FC } from 'react'
import { Text } from '@react-pdf/renderer'
import compose from './styles/compose'

interface Props {
  className?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  pdfMode?: boolean
}

const ContactPdf: FC<Props> = ({ className, value, pdfMode }) => {
  return (
    <>
      {pdfMode ? (
        <Text style={compose('span ' + (className ? className : ''))}>{value}</Text>
      ) : (
        <span 
          className={'input ' + (className ? className : '')}>{value}</span>
        // <input
        //   type="text"
        //   className={'input ' + (className ? className : '')}
        //   placeholder={placeholder || ''}
        //   value={value || ''}
        //   onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        // />
      )}
    </>
  )
}

export default ContactPdf
