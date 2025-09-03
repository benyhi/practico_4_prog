import React, { useEffect, useState } from "react";
import type { Producto } from "../../../utils/types";
import { Dialog } from 'primereact/dialog';
import ModelTable, { type ModelTableColumn } from "../../../components/modelTable";
import ModelForm, { type ModelFormField } from "../../../components/modelForm";
import {
	getProductos,
	createProducto,
	updateProducto,
	deleteProducto,
} from "../services/productoService";

const formFields: ModelFormField[] = [
	{ name: "name", label: "Nombre", required: true },
	{ name: "description", label: "Descripción" },
	{ name: "price", label: "Precio", type: "number" },
	{ name: "stock", label: "Stock", type: "number", required: true },
];

const TableView: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [productos, setProductos] = useState<Producto[]>([]);
    
	const [editProducto, setEditProducto] = useState<Producto | null>(null);

	const [showForm, setShowForm] = useState(false);
	const [formLoading, setFormLoading] = useState(false);

    const [selected, setSelected] = useState<Producto | null>(null);

	const fetchProductos = async () => {
		setLoading(true);
		try {
			const data = await getProductos();
			setProductos(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProductos();
	}, []);

	const handleCreate = () => {
		setEditProducto(null);
		setShowForm(true);
	};

	const handleEdit = (producto: Producto) => {
		setEditProducto(producto);
		setShowForm(true);
	};
    const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);

	const handleDelete = (producto: Producto) => {
		setProductoToDelete(producto);
	};

	const handleDeleteConfirm = async () => {
		if (!productoToDelete || productoToDelete.id === undefined) return;
		setFormLoading(true);
		try {
			await deleteProducto(productoToDelete.id);
			setProductoToDelete(null);
			fetchProductos();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setFormLoading(false);
		}
	};

	const handleDeleteCancel = () => {
		setProductoToDelete(null);
	};

	const handleFormSubmit = async (values: Partial<Producto>) => {
        console.log(values);

		const parsedValues = {
			...values,
			price: values.price !== undefined ? Number(values.price) : 0,
			stock: values.stock !== undefined && values.stock !== null && (typeof values.stock === "string" ? values.stock !== '' : true) ? Number(values.stock) : 0,
		};
		setFormLoading(true);
		try {
			if (editProducto && editProducto.id) {
				await updateProducto(editProducto.id, parsedValues);
			} else {
				await createProducto(parsedValues as Omit<Producto, "id">);
			}
			setShowForm(false);
			fetchProductos();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setFormLoading(false);
		}
	};

	const columns: ModelTableColumn[] = [
		{ field: "id", header: "ID" },
		{ field: "name", header: "Nombre" },
		{ field: "description", header: "Descripción" },
		{ field: "price", header: "Precio" },
		{ field: "stock", header: "Stock" },
	];

	return (
		<div style={{ padding: 24 }}>
			<h2>Productos</h2>
			{error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
			<ModelTable
				columns={columns}
				data={productos}
				loading={loading}
				onCreate={handleCreate}
				onEdit={handleEdit}
				onDelete={handleDelete}
				selection={selected}
				onSelectionChange={setSelected}
				createLabel="Crear producto"
				editLabel="Editar"
			/>
			{showForm && (
				<div style={{ marginTop: 32 }}>
					<ModelForm
						fields={formFields}
						initialValues={editProducto || {price: 0, stock: 0}}
						onSubmit={handleFormSubmit}
						submitLabel={editProducto ? "Actualizar" : "Crear"}
						loading={formLoading}
					/>
					<button onClick={() => setShowForm(false)} style={{ marginTop: 12 }}>Cancelar</button>
				</div>
			)}
			<Dialog
				header="Confirmar eliminación"
				visible={!!productoToDelete}
				style={{ width: '350px' }}
				onHide={handleDeleteCancel}
				footer={
					<div>
						<button onClick={handleDeleteConfirm} disabled={formLoading} style={{ color: 'red', marginRight: 8 }}>Eliminar</button>
						<button onClick={handleDeleteCancel} disabled={formLoading}>Cancelar</button>
					</div>
				}
				modal
			>
				<span>¿Seguro que deseas eliminar el producto <b>{productoToDelete?.name}</b>?</span>
			</Dialog>
		</div>
	);
};

export default TableView;


