import { Unite } from "../models/Unite";
import { useUnites } from "./services/unite.service";
import CrudTable from "./CrudTable";
import { CrudEventProps } from "./services/utile.service";

const Unites: React.FC<CrudEventProps> = ({ onEvent }) => {
    const { unites, setUnites } = useUnites();

    return (
        <CrudTable<Unite>
            label="une unité"
            items={unites}
            setItems={setUnites}
            useAddApi={window.electronAPI.addUnite}
            useUpdateApi={window.electronAPI.updateUnite}
            useDeleteApi={window.electronAPI.deleteUnite}
            onEvent={onEvent}
            addLabel="Unité ajoutée"
            updateLabel="Unité modifiée"
            deleteLabel="Unité supprimée"
        />
    );
};

export default Unites;