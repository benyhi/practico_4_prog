
const db = require('../models/database');

const getUsers = (req, res) => {
    db.all('SELECT id, username, role FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ status: 500, message: 'Error al obtener usuarios', error: err.message });
        res.json({ data: rows, status: 200, message: 'Usuarios obtenidos exitosamente' });
    });
}

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT id, username, role FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ status: 500, message: 'Error al buscar usuario', error: err.message });
        if (!row) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        res.json({ data: row, status: 200, message: 'Usuario encontrado' });
    });
}

const createUser = (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ status: 400, message: 'Faltan campos requeridos (username, password, role)' });
    }
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ status: 400, message: 'El usuario ya existe' });
            }
            return res.status(500).json({ status: 500, message: 'Error al crear usuario', error: err.message });
        }
        res.status(201).json({ status: 201, data: { id: this.lastID, username, role }, message: 'Usuario creado exitosamente' });
    });
};


const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { username, password, role } = req.body;
    db.run('UPDATE users SET username = COALESCE(?, username), password = COALESCE(?, password), role = COALESCE(?, role) WHERE id = ?',
        [username, password, role, id],
        function(err) {
            if (err) return res.status(500).json({ status: 500, message: 'Error al actualizar usuario', error: err.message });
            if (this.changes === 0) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
            res.json({ status: 200, message: 'Usuario editado exitosamente' });
        }
    );
}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ status: 500, message: 'Error al eliminar usuario', error: err.message });
        if (this.changes === 0) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        res.json({ status: 200, message: 'Usuario eliminado correctamente' });
    });
}

module.exports = {
    getUsers,
    getUserById,
    deleteUser,
    createUser,
    updateUser
}