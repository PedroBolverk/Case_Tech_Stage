// components/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useModal } from '../hooks/useModal'; // Usando o hook para controlar a modal
import styles from '../styles/Login.module.css'; // Importando o CSS Module para Login
import RegisterModal from '../modal/Register';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { openModal, closeModal, isModalOpen } = useModal(); // Usando o hook para abrir a modal

  // Função para login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        email,
        password,
      });
     
    //   console.log('Login bem-sucedido:', response.data)

   
      localStorage.setItem('token', response.data.access_token);

      router.push('/Dashboard');
    } catch (err) {
      setError('Credenciais inválidas!');
    }
  };

  return (
    <div className={styles['login-container']}>
      <h2 className={styles.heading}>Login</h2>
      <form onSubmit={handleLogin}>
        <div className={styles['form-group']}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" className={styles.button}>Entrar</button> {/* Usando a classe local 'button' */}
      </form>
      <button onClick={openModal} className={styles['secondary-button']}>Cadastre-se</button> {/* Usando a classe local 'secondary-button' */}

      {/* Modal de Cadastro */}
      {isModalOpen && <RegisterModal onClose={closeModal} />}
    </div>
  );
};

export default Login;
