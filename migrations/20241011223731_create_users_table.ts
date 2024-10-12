import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("produitsu", (table) => {
        table.increments("id").primary().unique();
        table.string("nom").notNullable();
        table.float("prix_achat").notNullable();
        table.float("prix_vente").notNullable();
        table.bigint("categorie_id").notNullable();
        table.bigint("fournisseur_id").notNullable();
        table.bigint("unite_id").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("produitsu");
}

