// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal';
// import styles from '../src/styles/Dashboard.module.css';

// interface Area {
//   id: string;
//   name: string;
//   description: string;

// }

// interface Process {
//   id: string;
//   title: string;
//   status: string;
//   importance: number;
//   subprocesses?: Subprocess[];  // Subprocessos podem ser undefined ou um array

// }

// interface Subprocess {
//   id: string;
//   title: string;
//   status: string;
//   processId: string;  // Associa o subprocesso ao processo pai
// }

// const Dashboard = () => {
//   const [areas, setAreas] = useState<Area[]>([]);
//   const [processos, setProcessos] = useState<Process[]>([]);
//   const [newArea, setNewArea] = useState({ name: '', description: '' });
//   const [newProcess, setNewProcess] = useState({
//     title: '',
//     description: '',
//     status: 'PLANNED',
//     importance: 3,
//     areaId: '',  // Áreas precisam de áreaId para associar o processo à área
//     responsibleId: '',

//   });
//   const [newSubprocess, setNewSubprocess] = useState({ title: '', status: 'PLANNED', processId: '' });
//   const [showForm, setShowForm] = useState(false);
//   const [showProcessModal, setShowProcessModal] = useState(false);  // Modal para novo processo
//   const [showModal, setShowModal] = useState(false);  // Modal para subprocessos
//   const [selectedAreaId, setSelectedAreaId] = useState<string>('');  // Adiciona o estado para armazenar o areaId


//   // Funções de manipuladores
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewArea({ ...newArea, [name]: value });
//   };

//   const handleProcessInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewProcess({ ...newProcess, [name]: value });
//   };
//   const handleProcessSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setNewProcess({ ...newProcess, [name]: value });
//   };
//   const handleSubprocessInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setNewSubprocess({
//       ...newSubprocess,
//       [name]: value,  // Atualizando o estado com o valor alterado
//     });
//   };

//   // Função de submit para adicionar novas áreas
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:4000/api/areas', newArea);
//       const areaWithId = response.data;
//       setAreas([...areas, areaWithId]);
//       setShowForm(false);
//       setNewArea({ name: '', description: '' });
//     } catch (error: unknown) {
//       console.error('Erro ao adicionar área:', error);
//     }
//   };

//   // Função para adicionar um novo processo em uma área específica
//   const handleCreateProcess = async (areaId: string) => {
//     try {
//       console.log('Dados enviados para o backend:', {
//         title: newProcess.title,
//         description: newProcess.description,
//         status: newProcess.status,
//         importance: newProcess.importance,
//         responsibleId: newProcess.responsibleId || null,  // Envia como null se não houver responsável
//       });

//       const response = await axios.post(
//         `http://localhost:4000/api/areas/${areaId}/processes`,
//         {
//           title: newProcess.title,
//           description: newProcess.description,
//           status: newProcess.status,
//           importance: newProcess.importance,
//           responsibleId: newProcess.responsibleId || null,  // Envia como null se não houver responsável
//         }
//       );

//       setProcessos([...processos, response.data]);
//       setShowProcessModal(false);  // Fecha o modal após criar o processo
//       setNewProcess({
//         title: '',
//         description: '',
//         status: 'PLANNED',
//         importance: 3,
//         areaId: '',
//         responsibleId: '',  // Reseta o responsibleId após criação
//       });
//     } catch (error) {
//       console.error('Erro ao criar processo:', error);
//     }
//   };






//   // Função para adicionar um subprocesso a um processo
//   const handleCreateSubprocess = async () => {
//     try {
//       // Verificando os dados antes de enviar
//       console.log("Subprocess Data:", newSubprocess);

//       // Enviar a requisição para criar o subprocesso
//       const response = await axios.post(
//         `http://localhost:4000/api/processes/${newSubprocess.processId}/subprocesses`,  // processId vai na URL
//         {  // Passando os dados corretos no corpo da requisição
//           title: newSubprocess.title,
//           status: newSubprocess.status
//         }
//       );

//       setProcessos(processos.map(process =>
//         process.id === newSubprocess.processId
//           ? {
//             ...process,
//             subprocesses: [...(process.subprocesses || []), response.data]
//           }
//           : process
//       ));

//       setNewSubprocess({ title: '', status: 'PLANNED', processId: '' });
//       setShowModal(false);  // Fechar o modal após salvar
//     } catch (error: unknown) {
//       console.error('Erro ao criar subprocesso', error);
//     }
//   };

//   // Carregar Áreas e Processos
//   useEffect(() => {
//     axios.get('http://localhost:4000/api/areas')
//       .then((response) => setAreas(response.data))
//       .catch((error) => console.error('Erro ao carregar áreas', error));

//     axios.get('http://localhost:4000/api/processes')
//       .then((response) => setProcessos(response.data))
//       .catch((error) => console.error('Erro ao carregar processos', error));
//   }, []);

//   return (
//     <div className={styles.dashboardContainer}>
//       <div className={styles.section}>
//         <h2>Áreas Cadastradas</h2>
//         <button onClick={() => setShowForm(true)} className={styles.button}>+</button>
//         {showForm && (
//           <div className={styles.formContainer}>
//             <h3>Adicionar Nova Área</h3>
//             <form onSubmit={handleSubmit}>
//               <div>
//                 <label>Nome da Área:</label>
//                 <input type="text" name="name" value={newArea.name} onChange={handleInputChange} required />
//               </div>
//               <div>
//                 <label>Descrição:</label>
//                 <input type="text" name="description" value={newArea.description} onChange={handleInputChange} required />
//               </div>
//               <button type="submit">Adicionar</button>
//               <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
//             </form>
//           </div>
//         )}

//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Nome da Área</th>
//               <th>Descrição</th>
//             </tr>
//           </thead>
//           <tbody>
//             {areas.map((area) => (
//               <tr key={area.id}>
//                 <td>{area.name}</td>
//                 <td>{area.description}</td>
//                 <td><button
//                   onClick={() => {
//                     setSelectedAreaId(area.id);  // Define o areaId selecionado
//                     setShowProcessModal(true);    // Abre o modal para adicionar o processo
//                   }}
//                 >
//                   Adicionar Processo
//                 </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal para Adicionar Processo */}
//       {showProcessModal && (
//         <div className={styles.modal}>
//           <h2>Adicionar Novo Processo</h2>
//           <form onSubmit={(e) => { e.preventDefault(); handleCreateProcess(selectedAreaId); }}>
//             <div>
//               <label>Título do Processo:</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={newProcess.title}
//                 onChange={handleProcessInputChange}
//                 required
//               />
//             </div>
//             <div>
//               <label>Descrição do Processo:</label>
//               <input
//                 type="text"
//                 name="description"
//                 value={newProcess.description}
//                 onChange={handleProcessInputChange}
//                 required
//               />
//             </div>
//             <div>
//               <label>Status do Processo:</label>
//               <select
//                 name="status"
//                 value={newProcess.status}
//                 onChange={handleProcessSelectChange}
//               >
//                 <option value="PLANNED">PLANNED</option>
//                 <option value="ACTIVE">ACTIVE</option>
//                 <option value="BLOCKED">BLOCKED</option>
//                 <option value="DONE">DONE</option>
//               </select>
//             </div>
//             <div>
//               <label>Importância:</label>
//               <input
//                 type="number"
//                 name="importance"
//                 value={newProcess.importance}
//                 onChange={handleProcessInputChange}
//                 required
//               />
//             </div>
//             <button type="submit">Salvar</button>
//             <button type="button" onClick={() => setShowProcessModal(false)}>Cancelar</button>
//           </form>
//         </div>
//       )}


//       {/* Fluxograma de Processos */}
//       <div className={styles.section}>
//         <h2>Processos</h2>
//         <div>
//           {processos.map(process => (
//             <div key={process.id} className={styles.card}>
//               <h3>{process.title}</h3>
//               <p>{process.status}</p>
//               <button onClick={() => {
//                 setNewSubprocess({ ...newSubprocess, processId: process.id });
//                 setShowModal(true);
//               }}>Adicionar Subprocesso</button>
//               <div>
//                 {process.subprocesses && process.subprocesses.length > 0 ? (
//                   process.subprocesses.map(sub => (
//                     <div key={sub.id}>
//                       <h4>{sub.title}</h4>
//                       <p>{sub.status}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p>Sem subprocessos</p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal para Adicionar Subprocesso */}
//       {showModal && (
//         <div className={styles.modal}>
//           <h2>Adicionar Subprocesso</h2>
//           <form onSubmit={(e) => { e.preventDefault(); handleCreateSubprocess(); }}>
//             <div>
//               <label>Título do Subprocesso:</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={newSubprocess.title}
//                 onChange={handleSubprocessInputChange}
//                 required
//               />
//             </div>
//             <div>
//               <label>Status do Subprocesso:</label>
//               <select
//                 name="status"
//                 value={newSubprocess.status}
//                 onChange={handleSubprocessInputChange}
//               >
//                 <option value="PLANNED">PLANNED</option>
//                 <option value="ACTIVE">ACTIVE</option>
//                 <option value="BLOCKED">BLOCKED</option>
//                 <option value="DONE">DONE</option>
//               </select>
//             </div>
//             <button type="submit">Salvar</button>
//             <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
