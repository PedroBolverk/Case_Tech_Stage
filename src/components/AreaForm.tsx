// components/AreaForm.tsx
import { useState } from 'react';
import axios from 'axios';
import { FormEvent } from 'react';  // Importando o tipo para o evento de formulário

const AreaForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {  // Tipando corretamente o evento 'e'
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/areas', { name, description });
      alert('Área criada com sucesso');
    } catch (error) {
      console.error('Erro ao criar área:', error);
      alert('Erro ao criar área');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome da Área:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Criar Área</button>
    </form>
  );
};

export default AreaForm;
