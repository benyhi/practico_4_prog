import type { Producto } from "../../../utils/types";

const API_URL = 'http://localhost:3000/productos';

function getAuthHeaders(): HeadersInit | undefined {
	const token = localStorage.getItem('token');
	console.log("Token:", token);
	return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export const getProductos = async (): Promise<Producto[]> => {
	const res = await fetch(API_URL, {
		headers: {
			...getAuthHeaders(),
		},
	});
	if (!res.ok) throw new Error('Error al obtener productos');
	const data = await res.json();
	return data.data;
};

export const getProductoById = async (id: number): Promise<Producto> => {
	const res = await fetch(`${API_URL}/${id}`, {
		headers: {
			...getAuthHeaders(),
		},
	});
	if (!res.ok) throw new Error('Producto no encontrado');
	const data = await res.json();
	return data.data;
};

export const createProducto = async (producto: Omit<Producto, 'id'>): Promise<Producto> => {
	console.log("Creating producto:", producto);
	const res = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...getAuthHeaders(),
		},
		body: JSON.stringify(producto),
	});
	if (!res.ok) throw new Error('Error al crear producto');
	const data = await res.json();
	return data.data;
};

export const updateProducto = async (id: number, producto: Partial<Producto>): Promise<void> => {
	const res = await fetch(`${API_URL}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			...getAuthHeaders(),
		},
		body: JSON.stringify(producto),
	});
	if (!res.ok) throw new Error('Error al actualizar producto');
};

export const deleteProducto = async (id: number): Promise<void> => {
	const res = await fetch(`${API_URL}/${id}`, {
		method: 'DELETE',
		headers: {
			...getAuthHeaders(),
		},
	});
	if (!res.ok) throw new Error('Error al eliminar producto');
};

