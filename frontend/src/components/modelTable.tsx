import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export interface ModelTableColumn {
	field: string;
	header: string;
	body?: (rowData: any) => React.ReactNode;
}

interface ModelTableProps {
	columns: ModelTableColumn[];
	data: any[];
	loading?: boolean;
	paginator?: boolean;
	rows?: number;
	onCreate?: () => void;
	onEdit?: (item: any) => void;
	onDelete?: (item: any) => void;
	selectable?: boolean;
	selection?: any;
	onSelectionChange?: (item: any) => void;
	createLabel?: string;
	editLabel?: string;
}


const ModelTable: React.FC<ModelTableProps> = ({
	columns,
	data,
	loading = false,
	paginator = true,
	rows = 10,
	onCreate,
	onEdit,
	onDelete,
	selectable = true,
	selection,
	onSelectionChange,
	createLabel = 'Crear',
	editLabel = 'Editar',
}) => {
	const columnsWithActions = React.useMemo(() => {
		let cols = [...columns];
		if (onEdit || onDelete) {
			cols = [
				...cols,
				{
					field: '__acciones',
					header: 'Acciones',
					body: (row: any) => (
						<div>
							{onEdit && <button onClick={() => onEdit(row)} style={{ marginRight: 8, color: "green" }}>{editLabel}</button>}
							{onDelete && <button onClick={() => onDelete(row)} style={{ color: 'red' }}>Eliminar</button>}
						</div>
					),
				},
			];
		}
		return cols;
	}, [columns, onEdit, onDelete, editLabel]);

	return (
		<div>
			{onCreate && (
				<button onClick={onCreate} style={{ marginBottom: 16 }}>{createLabel}</button>
			)}
			<DataTable
				value={data}
				loading={loading}
				paginator={paginator}
				rows={rows}
				responsiveLayout="scroll"
				selectionMode={selectable ? "single" : undefined}
				selection={selection}
				onSelectionChange={(e: { value: any; }) => onSelectionChange && onSelectionChange(e.value)}
				dataKey={columns[0]?.field || 'id'}
			>
				{columnsWithActions.map(col => (
					<Column key={col.field} field={col.field} header={col.header} body={col.body} />
				))}
			</DataTable>
		</div>
	);
};

export default ModelTable;
