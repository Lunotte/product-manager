import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Categorie } from "./models/Categorie";
import { useEffect, useState } from "react";
import IdNomDialog from "./dialogs/IdNomDialog";

interface CategorieProps {
    // categories: Categorie[];
} 

const Categories: React.FC<CategorieProps> = () => {

    const [categorie, setCategorie] = useState<Categorie>();
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [openCategorieDialog, setOpenCategorieDialog] = useState(false);

    useEffect(() => {
        window.electronAPI.getCategories().then((result) => {
            console.log(result);
            setCategories(result);
        }).catch((err) => {
          console.error(err);
        });
    }, []);

    const handleAddCategorie = (categorie: Categorie) => {
        if(categorie.id){
            window.electronAPI.updateCategorie(categorie.id, categorie.nom).then((result) => {
                setCategories(result);
            }).catch((err) => {
                console.error(err);
            });
        } else {
            window.electronAPI.addCategorie(categorie.nom).then((result) => {
                setCategories(result);
            }).catch((err) => {
                console.error(err);
            });
        }
    };

    const editCategorie = (cat: Categorie) => {
        setOpenCategorieDialog(true);
        setCategorie(cat);
    }

    const closeCategorie = () => {
        setOpenCategorieDialog(false)
        setCategorie(null);
    }
      
    return (
        <div>
            <Button onClick={() => setOpenCategorieDialog(true)}>Ajouter Catégorie</Button>
            <IdNomDialog
                open={openCategorieDialog}
                onClose={() => closeCategorie()}
                onAdd={handleAddCategorie}
                objetToEdit={categorie}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((categorie) => (
                    <TableRow
                        key={categorie.nom}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {categorie.nom}
                        </TableCell>
                        <TableCell align="right">
                            <Button onClick={() => editCategorie(categorie)}>Maj</Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
  }

  export default Categories;