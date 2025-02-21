// components/Cards.js
import Image from 'next/image';
import Card from './Card';
import styles from './Cards.module.scss';
import DownArrow from "../../public/down-arrow.svg";

const cards = [
  { title: 'Card 1', description: 'This is the first card.', link: "http://google.com/search?q=card1" },
  { title: 'Card 2', description: 'This is the second card.', link: "http://google.com/search?q=card2" },
  { title: 'Card 3', description: 'This is the third card.', link: "http://google.com/search?q=card3" },
  { title: 'Card 4', description: 'This is the fourth card.', link: "http://google.com/search?q=card4" },
  { title: 'Card 5', description: 'This is the fifth card.', link: "http://google.com/search?q=card5" },
];

const Cards = () => {
  return (
    <section id="works" className={styles.CardsContainer}>
      <a href="#hero" className={styles.DownArrow}>
        <Image src={DownArrow} alt="Down Arrow" />
      </a>
      <div 
        className={styles.CardsInner} 
        style={{ 
          gridTemplateColumns: `repeat(${cards.length}, 1fr)` 
        }}
        >
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </section>
  );
};

export default Cards;
