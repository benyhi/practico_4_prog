
const db = require('../models/database');

const getProducts = (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return res.status(500).json({ status: 500, message: 'Error al obtener productos', error: err.message });
        res.json({ data: rows, status: 200, message: 'Productos obtenidos exitosamente' });
    });
}

const getProductById = (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ status: 500, message: 'Error al buscar producto', error: err.message });
        if (!row) return res.status(404).json({ status: 404, message: 'Producto no encontrado' });
        res.json({ data: row, status: 200, message: 'Producto encontrado' });
    });
}

const createProduct = (req, res) => {
    const { name, description, price, stock } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ status: 400, message: 'Faltan campos requeridos (name, price)' });
    }
    db.run('INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)', [name, description || '', price, stock || 0], function(err) {
        if (err) return res.status(500).json({ status: 500, message: 'Error al crear producto', error: err.message });
        res.status(201).json({ status: 201, data: { id: this.lastID, name, description, price, stock }, message: 'Producto creado exitosamente' });
    });
};


const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, price, stock } = req.body;
    db.run('UPDATE products SET name = COALESCE(?, name), description = COALESCE(?, description), price = COALESCE(?, price), stock = COALESCE(?, stock) WHERE id = ?',
        [name, description, price, stock, id],
        function(err) {
            if (err) return res.status(500).json({ status: 500, message: 'Error al actualizar producto', error: err.message });
            if (this.changes === 0) return res.status(404).json({ status: 404, message: 'Producto no encontrado' });
            res.json({ status: 200, message: 'Producto editado exitosamente' });
        }
    );
}

const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id);
    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ status: 500, message: 'Error al eliminar producto', error: err.message });
        if (this.changes === 0) return res.status(404).json({ status: 404, message: 'Producto no encontrado' });
        res.json({ status: 200, message: 'Producto eliminado correctamente' });
    });
}

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
}