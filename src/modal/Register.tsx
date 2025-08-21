import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Register.module.css'

const RegisterModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/auth/register', {
        name,
        email,
        password,
      });
      onClose(); 
      alert('Cadastro realizado com sucesso!');
    } catch (err) {
      setError('Erro ao criar a conta!');
    }
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <h2>Cadastrar Nova Conta</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <button type="submit">Cadastrar</button>
        </form>
        <button onClick={onClose} className={styles['secondary-button']}>Fechar</button>
      </div>
    </div>
  );
};

export default RegisterModal;
