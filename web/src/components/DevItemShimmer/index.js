import React from 'react';

import './styles.css';

function DevItemShimmer() {
  return (
    <li className="dev-item-loading">
      <header>
        <div className="img"></div>
        <div className="user-info">
          <div className="info"></div>
          <div className="info"></div>
        </div>
      </header>

      <div className="text"></div>
      <div className="buttons">
        <div className="github"></div>

        <div className="actions">
          <div className="edit"></div>
          <div className="delete"></div>
        </div>
      </div>
    </li>
  );
}

export default DevItemShimmer;