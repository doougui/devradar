import React, { useState, useEffect } from 'react';

function DevFormUpdate({ onSubmit, onCancelEdition, dev }) {
  const [githubUsername, setGithubUsername] = useState(dev.github_username);
  const [name, setName] = useState(dev.name);
  const [techs, setTechs] = useState(dev.techs.join(', '));
  const [bio, setBio] = useState(dev.bio);
  const [latitude, setLatitude] = useState(dev.location.coordinates[1]);
  const [longitude, setLongitude] = useState(dev.location.coordinates[0]);

  useEffect(() => {
    setGithubUsername(dev.github_username);
    setName(dev.name);
    setTechs(dev.techs.join(', '));
    setBio(dev.bio);
    setLatitude(dev.location.coordinates[1]);
    setLongitude(dev.location.coordinates[0]);
  }, [dev]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    await onSubmit(githubUsername, {
      name,
      bio,
      techs,
      latitude,
      longitude,
    });
  }

  function handleCancelClick() {
    onCancelEdition();
  }

  return (
    <>
      <strong>Editando {name}</strong>
      <form onSubmit={handleSubmit}>
        <div className="input-block">
          <label htmlFor="name">Nome</label>
          <input 
            name="name" 
            id="name" 
            required 
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="input-block">
          <label htmlFor="bio">Bio</label>
          <input
            name="bio" 
            id="bio" 
            required 
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>

        <div className="input-block">
          <label htmlFor="techs">Tecnologias</label>
          <input 
            name="techs" 
            id="techs" 
            required 
            value={techs}
            onChange={e => setTechs(e.target.value)}
          />
        </div>

        <div className="input-group">
          <div className="input-block">
            <label htmlFor="latitude">Latitude</label>
            <input 
              type="number" 
              name="latitude" 
              id="latitude" 
              required 
              value={latitude} 
              onChange={e => setLatitude(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="longitude">Longitude</label>
            <input 
              type="number" 
              name="longitude" 
              id="longitude" 
              required 
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
            />
          </div>
        </div>

        <button type="submit">Salvar</button>
        <button type="button" onClick={handleCancelClick} className="cancelEdition">Cancelar</button>
      </form> 
    </>
  );
}

export default DevFormUpdate;
