import { useCategories } from "./services/categorie.service";
import CrudTable from "./CrudTable";
import { Categorie } from "../models/Categorie";
import { CrudEventProps } from "./services/utile.service";

const Categories: React.FC<CrudEventProps> = ({ onEvent }) => {
    const { categories, setCategories } = useCategories();

    return (
        <CrudTable<Categorie>
            label="une catégorie"
            items={categories}
            setItems={setCategories}
            useAddApi={window.electronAPI.addCategorie}
            useUpdateApi={window.electronAPI.updateCategorie}
            useDeleteApi={window.electronAPI.deleteCategorie}
            onEvent={onEvent}
            addLabel="Catégorie ajoutée"
            updateLabel="Catégorie modifiée"
            deleteLabel="Catégorie supprimée"
        />
    );
};

export default Categories;