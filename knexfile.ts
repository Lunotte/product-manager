// module.exports = {
//   development: {
//     client: 'sqlite3',
//     connection: {
//       filename: './database.db' // Chemin vers votre fichier SQLite
//     },
//     useNullAsDefault: true // Nécessaire pour SQLite avec Knex
//   },
// };
import { Knex } from "knex";

const config: Knex.Config = {
  client: 'sqlite3', // or 'better-sqlite3'
  connection: {
    filename: './database.db',
  },
  useNullAsDefault: true,
  debug: true
};

export default config;