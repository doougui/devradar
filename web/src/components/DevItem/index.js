import React from 'react';

import './styles.css';

function DevItem({ dev, deleteAction }) {
  async function handleDeleteClick() {
    await deleteAction(dev.github_username);
  }

  return (
    <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt={dev.name} />
        <div className="user-info">
          <strong>{dev.name}</strong>
          <span>{dev.techs.join(', ')}</span>
        </div>
      </header>

      <p>{dev.bio}</p>
      <div className="buttons">
        <a className="github" href={`https://github.com/${dev.github_username}`}>Acessar perfil no GitHub</a>

        <div className="actions">
          <button className="edit">Editar</button>
          <button onClick={handleDeleteClick} className="delete">Excluir</button>
        </div>
      </div>
    </li>
  );
}

export default DevItem;