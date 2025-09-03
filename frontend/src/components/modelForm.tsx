
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

export interface ModelFormField {
	name: string;
	label: string;
	type?: 'text' | 'number' | 'email' | 'password' | 'select';
	options?: { label: string; value: any }[];
	required?: boolean;
	disabled?: boolean;
}

interface ModelFormProps<T> {
	fields: ModelFormField[];
	initialValues?: Partial<T>;
	onSubmit: (values: Partial<T>) => void;
	submitLabel?: string;
	loading?: boolean;
}

function ModelForm<T>({ fields, initialValues = {}, onSubmit, submitLabel = 'Guardar', loading = false }: ModelFormProps<T>) {
	const [values, setValues] = useState<Partial<T>>(initialValues);

	useEffect(() => {
		setValues(initialValues);
	}, [initialValues]);

	const handleChange = (name: string, value: any) => {
		setValues(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		for (const field of fields) {
			if (field.required) {
				const value = values[field.name as keyof T];
				if (value === undefined || value === null || value === "") {
					alert(`El campo '${field.label}' es obligatorio.`);
					return;
				}
			}
		}
		onSubmit(values);
	};

	return (
		<form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
			{fields.map(field => (
				<div className="p-field" style={{ marginBottom: 16 }} key={field.name}>
					<label htmlFor={`field-${field.name}`}>{field.label}</label>
					{field.type === 'number' ? (
						<InputNumber
							id={`field-${field.name}`}
							value={values[field.name as keyof T] as number | undefined}
							onValueChange={(e) => handleChange(field.name, e.value)}
							required={field.required}
							disabled={field.disabled}
							useGrouping={false}
						/>
					) : field.type === 'select' && field.options ? (
						<Dropdown
							id={`field-${field.name}`}
							value={values[field.name as keyof T]}
							options={field.options}
							onChange={e => handleChange(field.name, e.value)}
							required={field.required}
							disabled={field.disabled}
							placeholder={`Seleccione ${field.label.toLowerCase()}`}
						/>
					) : (
						<InputText
							id={`field-${field.name}`}
							type={field.type || 'text'}
							value={String(values[field.name as keyof T] ?? '')}
							onChange={e => handleChange(field.name, e.target.value)}
							required={field.required}
							disabled={field.disabled}
						/>
					)}
				</div>
			))}
			<Button type="submit" label={loading ? 'Guardando...' : submitLabel} disabled={loading} />
		</form>
	);
}

export default ModelForm;
