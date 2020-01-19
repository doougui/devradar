import React, { useState, useEffect } from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

function App() {
  const [devs, setDevs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, [])
  
  function updateDevList(response) {
    if (response.data.error) {
      return setError(response.data.error);
    }

    setDevs([...devs, response.data]);
  }

  async function handleAddDev(data) {
    const response = await api.post('/devs', data);

    updateDevList(response);
  }

  async function handleDeleteDev(github_username) {
    await api.delete(`/devs/${github_username}`);
    
    const newDevs = devs.filter(dev => dev.github_username !== github_username);

    setDevs(newDevs);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        {error ? <small>{error}</small> : ''}
        <DevForm onSubmit={handleAddDev} />
      </aside>
      <main>
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
