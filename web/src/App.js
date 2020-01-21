import React, { useState, useEffect } from 'react';
import api from './services/api';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevItemShimmer from './components/DevItemShimmer';
import DevFormCreate from './components/DevFormCreate';
import DevFormUpdate from './components/DevFormUpdate';

function App() {
  const [devs, setDevs] = useState([]);
  const [devBeingEdited, setDevBeingEdited] = useState({});

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
      return toast[type](message, options);
    } else {
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

      setDevs([...devs, response.data.dev]);

      callToast(response.data.message, 'success');
    } catch (error) {
      handleApiError(error);
    }
  }

  function showEditForm(data) {
    setDevBeingEdited(data);
  }

  function hideEditForm() {
    setDevBeingEdited({});
  } 
  
  async function handleEditDev(github_username, data) {
    try {
      const response = await api.put(`/devs/${github_username}`, data);

      const newDevs = [...devs];
      const updatedDevIndex = newDevs.findIndex(dev => dev.github_username === github_username);

      newDevs.splice(updatedDevIndex, 1, response.data.dev);

      setDevs(newDevs);
      setDevBeingEdited({});

      callToast(response.data.message, 'success');
    } catch (error) {
      handleApiError(error);
    }
  }

  async function handleDeleteDev(github_username) {
    try {
      const response = await api.delete(`/devs/${github_username}`);
      const newDevs = devs.filter(dev => dev.github_username !== github_username);
  
      setDevs(newDevs);

      callToast(response.data.message, 'success');
    } catch (error) {
      handleApiError(error);
    }
  }

  return (
    <div id="app">
      <aside>
        {Object.entries(devBeingEdited).length === 0 ? (
            <DevFormCreate onSubmit={handleAddDev} />
        ) : (
          <DevFormUpdate 
            onSubmit={handleEditDev} 
            dev={devBeingEdited} 
            onCancelEdition={hideEditForm} 
          />
        )}
      </aside>
      <main>
        <ToastContainer />
        <ul>
          {!devs.length ? (
            <>
              <DevItemShimmer />
              <DevItemShimmer />
              <DevItemShimmer />
              <DevItemShimmer />
              <DevItemShimmer />
              <DevItemShimmer />
              <DevItemShimmer />
              <DevItemShimmer />
            </>
          ) : (
            devs.map(dev => (
              <DevItem 
                key={dev._id} 
                dev={dev} 
                deleteAction={handleDeleteDev}
                editAction={showEditForm}
              />
            ))
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
