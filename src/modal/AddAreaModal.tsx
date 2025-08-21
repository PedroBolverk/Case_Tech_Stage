import React, { useState } from 'react';

const AddAreaModal = ({ onClose, onSave }: { onClose: () => void, onSave: (area: any) => void }) => {
  const [area, setArea] = useState({ name: '', description: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setArea({ ...area, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(area);
    onClose();
  };

  return (
    <div className="modal">
      <h2>Adicionar Nova Área</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={area.name}
          onChange={handleChange}
          placeholder="Nome da Área"
        />
        <input
          type="text"
          name="description"
          value={area.description}
          onChange={handleChange}
          placeholder="Descrição"
        />
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default AddAreaModal;
