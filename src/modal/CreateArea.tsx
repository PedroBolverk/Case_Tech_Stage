import styles from '../styles/NewPage.module.css';
import React, { useState } from 'react';
import axios from 'axios';

const CreateArea = ({ showModal, setShowModal }: { showModal: boolean, setShowModal: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [newArea, setNewArea] = useState({ name: '', description: '' });
  const [areas, setAreas] = useState<any[]>([]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/areas', newArea);
      setAreas([...areas, response.data]);
      setNewArea({ name: '', description: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao adicionar área:', error);
    }
  };

  return (
    showModal && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalDialog}>
          <h2>Adicionar Área</h2>

          {/* Formulário de criação de área */}
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div>
              <label>Nome da Área</label>
              <input
                type="text"
                placeholder="Nome da Área"
                value={newArea.name}
                onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Descrição</label>
              <input
                type="text"
                placeholder="Descrição"
                value={newArea.description}
                onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                required
              />
            </div>

            <div className={styles.modalButtons}>
              <button type="submit" className={styles.buttonSave}>
                Adicionar Área
              </button>
              <button
                type="button"
                className={styles.buttonClose}
                onClick={() => setShowModal(false)}
              >
                Fechar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateArea;
