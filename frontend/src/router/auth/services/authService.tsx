import type { Usuario } from '../../../utils/types';
const API_URL = 'http://localhost:3000/auth';

export async function login({ username, password }: Pick<Usuario, 'username'> & { password: string }) {
	const res = await fetch(`${API_URL}/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password }),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
	if (data.token) localStorage.setItem('token', data.token);
	return data;
}

export async function register({ username, email, password }: Pick<Usuario, 'username' | 'email'> & { password: string }) {
	const res = await fetch(`${API_URL}/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, email, password }),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message || 'Error al registrarse');

	if (data.token) localStorage.setItem('token', data.token);
	return data;
}

export function logout() {
	localStorage.removeItem('token');
}
