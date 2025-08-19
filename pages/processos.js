// pages/processos.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const Processos = () => {
  const [processos, setProcessos] = useState([]);
  const areaId = "cmeh3r3ky0003f7r8sqfp6jt6"; // ID da área que você quer carregar

  useEffect(() => {
    // Faz a requisição GET para a API do back-end
    axios
      .get(`http://localhost:4000/processes/?areaId=${areaId}`)
      .then((response) => {
        setProcessos(response.data); // Atualiza o estado com os dados da API
      })
      .catch((error) => {
        console.error("Erro ao carregar processos:", error);
      });
  }, [areaId]); // A dependência áreaId pode ser alterada para carregar diferentes áreas

  return (
    <div>
      <h1>Processos</h1>
      <ul>
        {/* Mapeia os processos recebidos e exibe */}
        {processos.map((processo) => (
          <li key={processo.id}>
            <strong>{processo.title}</strong> <br />
            Status: {processo.status} <br />
            Importância: {processo.importance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Processos;
