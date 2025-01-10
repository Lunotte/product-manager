import { Text, View } from "@react-pdf/renderer"
import { FC } from "react"
import compose from "./styles/compose";

interface Props {
    className?: string;
    conditionsReglement: string;
    term: string;
    pdfMode: boolean;
}

const Footer: FC<Props> = ({ pdfMode, conditionsReglement, term}) => {
    return (
      <>
        {pdfMode ? (
          <View style={compose('footer')} fixed>
            <Text style={compose('w-100 pied-page')}>{conditionsReglement}</Text>
            <Text style={compose('footer-center')}>{term}</Text>
            <Text style={compose('page-number')} render={({ pageNumber, totalPages }) => (
              `${pageNumber} / ${totalPages}`
            )} fixed />
          </View>
        ) : (
          <div className="footer">
            <p className="w-100 pied-page">{conditionsReglement}</p>
            <p className="footer-center">{term}</p>
          </div>
        )}
      </>
    )
}

export default Footer