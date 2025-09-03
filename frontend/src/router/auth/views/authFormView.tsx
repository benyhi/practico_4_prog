import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { Usuario } from '../../../utils/types';
import { login, register } from '../services/authService';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

interface AuthFormProps {
	onAuth?: (data: Partial<Usuario> & { password: string }, mode: 'login' | 'register') => void;
}

const AuthFormView: React.FC<AuthFormProps> = ({ onAuth }) => {
	const [mode, setMode] = useState<'login' | 'register'>('login');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		console.log(username, email, password)
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			if (mode === 'login') {
				await login({ username, password });
				toast.success('Inicio de sesión exitoso');
			} else {
				await register({ username, email, password });
				toast.success('Registro exitoso');
			}
			if (onAuth) {
				await onAuth(
					mode === 'register'
						? { username, email, password } as Partial<Usuario> & { password: string }
						: { username, password } as Partial<Usuario> & { password: string },
					mode
				);
			}
			setTimeout(() => navigate('/'), 1200);
		} catch (err: any) {
			setError(err.message || 'Error');
			toast.error(err.message || 'Error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ maxWidth: 350, margin: '40px auto' }}>
			<ToastContainer position="top-center" autoClose={2000} />
			<h2>{mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h2>
			<form onSubmit={handleSubmit}>
				<div className="p-field" style={{ marginBottom: 16 }}>
					<label htmlFor="username">Usuario</label>
					<InputText id="username" value={username} onChange={e => setUsername(e.target.value)} autoFocus required />
				</div>
				{mode === 'register' && (
					<div className="p-field" style={{ marginBottom: 16 }}>
						<label htmlFor="email">Email</label>
						<InputText id="email" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
					</div>
				)}
				<div className="p-field" style={{ marginBottom: 16 }}>
					<label htmlFor="password">Contraseña</label>
					<Password id="password" value={password} onChange={e => setPassword(e.target.value)} feedback={false} required toggleMask />
				</div>
				{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
				<Button label={loading ? 'Enviando...' : (mode === 'login' ? 'Entrar' : 'Registrarse')} icon="pi pi-user" type="submit" className="p-mr-2" disabled={loading} />
			</form>
			<Button
				label={mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
				className="p-button-text"
				onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
				style={{ marginTop: 16 }}
			/>
		</div>
	);
};

export default AuthFormView;
