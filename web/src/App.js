import React, { useState, useEffect } from 'react';
import api from './services/api';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  function callToast(message, type = 'default', options = {}) {
    const availableTypes = ['error', 'success', 'info', 'warn'];

    if (availableTypes.includes(type)) {
      return toast[type](message);
    } else if (type === 'default') {
      return toast(message, options);
    }
  }

  function handleApiError(error) {
    if (error.response) {
      callToast(error.response.data.message, 'error');
    } else if (error.request) {
      callToast('Ocorreu um erro inesperado!', 'error');
    } else {
      callToast(error.message, 'error');
    }
  }

  async function handleAddDev(data) {
    try {
      const response = await api.post('/devs', data);

      setDevs([...devs, response.data]);
    } catch (error) {
      handleApiError(error);
    }
  }

  async function handleDeleteDev(github_username) {
    try {
      await api.delete(`/devs/${github_username}`);
      const newDevs = devs.filter(dev => dev.github_username !== github_username);
  
      setDevs(newDevs);
    } catch (error) {
      handleApiError(error);
    }
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>
      <main>
        <ToastContainer />
        <ul>
          {devs.map(dev => (
            <DevItem 
              key={dev._id} 
              dev={dev} 
              deleteAction={handleDeleteDev}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
