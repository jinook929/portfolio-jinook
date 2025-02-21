// components/Card.js
import React from 'react';
import styles from './Card.module.scss';

const Card = ({ title, description, link }) => {
  return (
    <div className={styles.Card}>
      <h2>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h2>
      {/* <h2>{title}</h2> */}
      <p>{description}</p>
    </div>
  );
};

export default Card;
