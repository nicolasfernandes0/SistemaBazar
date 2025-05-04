const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do banco de dados
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao SQLite');
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL
            )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela:', err.message);
            } else {
                // Inserir usuário admin padrão
                db.get("SELECT * FROM users WHERE username = 'admin'", [], (err, row) => {
                    if (!row) {
                        db.run(
                            "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
                            ['admin', 'admin123', 'admin@example.com']
                        );
                    }
                });
            }
        });
    }
});

// Rota de login
app.post('/api/login', express.json(), (req, res) => {
    const { username, password } = req.body;
    
    db.get(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, user) => {
            if (err || !user) {
                return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
            }
            res.json({ success: true, user });
        }
    );
});

// Rota principal que serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
