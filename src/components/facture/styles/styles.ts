import { CSSClasses } from '../data/types'

const colorDark = '#222'
const colorDark2 = '#666'
const colorGray = '#e3e3e3'
const colorWhite = '#fff'

const styles: CSSClasses = {
  dark: {
    color: colorDark,
  },

  white: {
    color: colorWhite,
  },

  'bg-dark': {
    backgroundColor: colorDark2,
  },

  'bg-gray': {
    backgroundColor: colorGray,
  },

  flex: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },

  'w-auto': {
    flex: 1,
    paddingRight: '8px',
  },

  'ml-30': {
    flex: 1,
  },

  'w-100': {
    width: '100%',
  },

  'w-5': {
    width: '5%',
  },
  'w-7': {
    width: '7%',
  },
  'w-10': {
    width: '10%',
  },
  'w-50': {
    width: '50%',
  },

  'w-55': {
    width: '55%',
  },

  'w-45': {
    width: '45%',
  },

  'w-60': {
    width: '60%',
  },

  'w-20': {
    width: '20%',
  },

  'w-40': {
    width: '40%',
  },

  'w-48': {
    width: '48%',
  },
  'w-70': {
    width: '70%',
  },
  'w-30': {
    width: '30%',
  },
  'w-15': {
    width: '15%',
  },
  'w-17': {
    width: '17%',
  },

  'w-18': {
    width: '18%',
  },

  row: {
    borderBottom: `1px solid ${colorGray}`,
  },

  'mt-40': {
    marginTop: '40px',
  },

  'mt-30': {
    marginTop: '30px',
  },

  'mt-20': {
    marginTop: '20px',
  },

  'mt-10': {
    marginTop: '10px',
  },

  'mb-5': {
    marginBottom: '5px',
  },

  'p-4-8': {
    padding: '4px 8px',
  },

  'p-5': {
    padding: '5px',
  },

  'pb-10': {
    paddingBottom: '10px',
  },
  'pb-5': {
    paddingBottom: '5px',
  },

  center: {
    textAlign: 'center'
  },

  right: {
    textAlign: 'right',
  },

  bold: {
    fontWeight: 'bold',
  },

  'fs-16': {
    fontSize: '16px',
  },

  'fs-11': {
    fontSize: '11px',
  },

  'fs-10': {
    fontSize: '10px',
  },

  'fs-9': {
    fontSize: '9px',
  },
  // 'fs-6': {
  //   fontSize: '6px !important',
  // },

  'fs-45': {
    fontSize: '45px',
  },

  page: {
    fontFamily: 'Nunito',
    fontSize: '13px',
    color: '#555',
    padding: '40px 35px',
  },

  span: {
    padding: '0px 6px 0px 0',
  },

  logo: {
    display: 'block',
  },

  'pied-page': {
    fontSize: '9px'
  },

  'pied-page-2': {
    fontSize: '9px',
    textAlign: 'center'
  },
  'center-2': {
    display: 'flex',
    margin: 'auto'
  },
  // 'invoice-wrapper': {
  //   display: 'flex',
  //   margin: 'auto',
  //   padding: '40px 35px',
  //   boxShadow: '0 0 17px 0 rgba(16, 40, 73, 0.09)'
  // },

}

export default styles