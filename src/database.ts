const { app } = require('electron');
const Database = require('better-sqlite3');
const path = require('path');

// Crée ou ouvre une base de données SQLite
// const db = new Database(path.join(__dirname, 'data.db'), { verbose: console.log });

// console.log(db);

// function connect() {
//   const dbPath =
//     process.env.NODE_ENV === "development"
//         ? "./demo_table.db"
//         : path.join(process.resourcesPath, "./demo_table.db")
//   return Database(
//     dbPath, { verbose: console.log, fileMustExist: true },
//   );
// }

function connect() {

  const dbPath = app.isPackaged
        ? path.join(process.resourcesPath, 'database.db')
        : path.join(__dirname, '../../', 'database.db')
  
  return Database(
    dbPath, //path.join(__dirname, '../', 'database.db'),
    { verbose: console.log, fileMustExist: true },
  );
}

const db = connect();


// Crée les tables si elles n'existent pas
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subcategories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    subcategory_id INTEGER,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories (id) ON DELETE CASCADE
  );
`);

const dbMethods = {
  getCategories() {
    return db.prepare('SELECT * FROM categories').all();
  },
  addCategory(name: any) {
    const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
    stmt.run(name);
  },
  getSubcategories() {
    return db.prepare('SELECT * FROM subcategories').all();
  },
  addSubcategory(name: any, categoryId: any) {
    const stmt = db.prepare('INSERT INTO subcategories (name, category_id) VALUES (?, ?)');
    stmt.run(name, categoryId);
  },
  getProducts() {
    return db.prepare('SELECT * FROM products').all();
  },
  addProduct(name: any, price: any, subcategoryId: any): void {
    const stmt = db.prepare('INSERT INTO products (name, price, subcategory_id) VALUES (?, ?, ?)');
    stmt.run(name, price, subcategoryId);
  },
};

export default dbMethods;