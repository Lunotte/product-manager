import { Fournisseur } from "../models/Fournisseur";
import { useFournisseurs } from "./services/fournisseur.service";
import { CrudTable } from "./CrudTable";
import { CrudEventProps } from "./services/utile.service";

const Fournisseurs: React.FC<CrudEventProps> = ({ onEvent }) => {
    const { fournisseurs, setFournisseurs } = useFournisseurs();

    return (
        <CrudTable<Fournisseur>
            label="un fournisseur"
            items={fournisseurs}
            setItems={setFournisseurs}
            useAddApi={window.electronAPI.addFournisseur}
            useUpdateApi={window.electronAPI.updateFournisseur}
            useDeleteApi={window.electronAPI.deleteFournisseur}
            onEvent={onEvent}
            addLabel="Fournisseur ajouté"
            updateLabel="Fournisseur modifié"
            deleteLabel="Fournisseur supprimé"
        />
    );
};

export default Fournisseurs;