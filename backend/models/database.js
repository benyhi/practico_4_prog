const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) {
    console.error("[DB] ❌ Error al conectar con SQLite:", err.message);
  } else {
    console.log("[DB] ✅ Conectado a SQLite en ./db.sqlite");
  }
});

db.serialize(() => {
  console.log("[DB] 🚀 Iniciando creación/verificación de tablas...");

  setTimeout(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user'
      )
    `,
      (err) => {
        if (err) {
          console.error("[DB] ❌ Error al crear/verificar tabla 'users':", err.message);
        } else {
          console.log("[DB] ✅ Tabla 'users' verificada/creada correctamente");

          const username = "admin";
          const password = "admin";
          const hashedPassword = bcrypt.hashSync(password, 10);

          db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
            if (err) {
              console.error("[DB] ❌ Error al verificar superusuario:", err.message);
            } else if (!row) {
              db.run(
                `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
                [username, "admin@example.com", hashedPassword, "admin"],
                (err) => {
                  if (err) {
                    console.error("[DB] ❌ Error al crear superusuario:", err.message);
                  } else {
                    console.log("[DB] 👑 Superusuario creado: usuario=admin / contraseña=admin");
                  }
                }
              );
            } else {
              console.log("[DB] 👑 Superusuario ya existe, no se creó uno nuevo.");
            }
          });
        }
      }
    );
  }, 1000);

  setTimeout(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0
      )
    `,
      (err) => {
        if (err) {
          console.error("[DB] ❌ Error al crear/verificar tabla 'products':", err.message);
        } else {
          console.log("[DB] ✅ Tabla 'products' verificada/creada correctamente");
        }
      }
    );
  }, 2000);

  setTimeout(() => {
    db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, rows) => {
      if (err) {
        console.error("[DB] ❌ Error al listar tablas:", err.message);
      } else {
        console.log("[DB] 📋 Tablas existentes en la base de datos:");
        rows.forEach((row) => console.log(`   • ${row.name}`));
        console.log("[DB] ✅ Base de datos inicializada correctamente");
      }
    });
  }, 3000);
});

module.exports = db;
