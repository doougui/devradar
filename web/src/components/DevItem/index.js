import React from 'react';

import './styles.css';

function DevItem({ dev, deleteAction, editAction }) {
  async function handleDeleteClick() {
    await deleteAction(dev.github_username);
  }

  function handleEditClick() {
    editAction(dev);
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
          <button type="button" className="edit" onClick={handleEditClick}>Editar</button>
          <button type="button" className="delete" onClick={handleDeleteClick}>Excluir</button>
        </div>
      </div>
    </li>
  );
}

export default DevItem;