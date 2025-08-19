// pages/index.tsx
import React from 'react';
import '../styles/Home.module.css'
import Login from '../src/components/Login';

const Home = () => {
  return (
    <div className="container">
      <div className="left-side">
        <Login />
      </div>
      <div className="right-side">
        <img src="img-principal-1024x1024.jpg" alt="Imagem de boas-vindas" />
        <div className="message">
          <h2>Bem-vindo ao Mapeamento de Processos!</h2>
          <p>Faça login ou crie uma conta para começar a mapear os processos da sua empresa.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
