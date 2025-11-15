import { Unite } from "../models/Unite";
import { CrudTable } from "./CrudTable";
import { useUnites } from "./hooks/unite/manage-unite";
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