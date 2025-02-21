"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import styles from "./WorkGallery.module.scss";
import DownArrow from "../../public/down-arrow.svg";
import Everly1 from "../../public/everly_1.webp";
import Everly2 from "../../public/everly_2.webp";
import Greenleaf1 from "../../public/greenleaf_1.webp";
import Greenleaf2 from "../../public/greenleaf_2.webp";
import Madwell1 from "../../public/madwell_1.webp";
import Madwell2 from "../../public/madwell_2.webp";
import Plum1 from "../../public/plum_1.webp";
import Plum2 from "../../public/plum_2.webp";
import Availability1 from "../../public/availability_1.webp";
import Availability2 from "../../public/availability_2.webp";
import Fernet1 from "../../public/fernet_1.webp";
import Fernet2 from "../../public/fernet_2.webp";
import Visible1 from "../../public/visible_1.webp";
import Visible2 from "../../public/visible_2.webp";
import Signin1 from "../../public/signin_1.webp";
import Signin2 from "../../public/signin_2.webp";

const WorkGallery = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      image1: Fernet1,
      image2: Fernet2,
      link1: 'https://us.fernetbranca.com/',
      link2: 'https://shop.fernetbranca.com/',
      title: 'Fernet Branca',
      techStack: 'Next.js / Headless WP / Shopify',
      description: 'Revamped the brand’s website to engage bartenders and attract newcomers.',
      linkText: 'Awwwards - Honorable Mention',
      linkUrl: 'https://www.awwwards.com/sites/fernet-branca-us/',
    },
    {
      id: 2,
      image1: Greenleaf1,
      image2: Greenleaf2,
      link1: 'https://www.greenleafpetresort.com/',
      link2: 'https://www.greenleafpetresort.com/pet-boarding/#contact-us-boarding',
      title: 'Greenleaf',
      techStack: 'Custom WP Theme / Mailchimp Integration',
      description: 'Helped a legacy pet resort highlight its reimagined, personalized approach to premium pet care.',
    },
    {
      id: 3,
      image1: Madwell1,
      image2: Madwell2,
      link1: 'https://www.madwell.com/',
      link2: 'https://www.madwell.com/about',
      title: 'Madwell',
      techStack: 'Next.js / CSS Animation / Headless WP',
      description: 'Created an branding/marketing agency’s site, showcasing its unique, nontraditional approach.',
    },
    {
      id: 4,
      image1: Plum1,
      image2: Plum2,
      link1: 'https://plumorganics.com/',
      link2: 'https://plumorganics.com/the-feed/#parenting',
      title: 'Plum Organics',
      techStack: 'Custom WP Theme',
      description: 'Redesigned Plum Organics’ website to inspire adventurous healthy eating for kids.',
    },
    {
      id: 5,
      image1: Availability1,
      image2: Availability2,
      title: 'Availability-Sharing App',
      techStack: 'Elixir / Phoenix / Svelte',
      description: 'Developed an on-demand full-stack app with Postgres DB to optimize daily team availability.'
    },
    {
      id: 6,
      image1: Everly1,
      image2: Everly2,
      title: 'Everly',
      techStack: 'Next.js / Prismic CMS / Chart.js',
      description: "Built an interactive website to establish and expand a new life insurance company’s online presence.",
      linkText: 'Case Study',
      linkUrl: 'https://www.madwell.com/project/website',
    },
    {
      id: 7,
      image1: Visible1,
      image2: Visible2,
      title: 'Visible Singles Registry',
      techStack: 'Next.js / Shopify',
      description: "Helped Visible's unconventional registry gain rapid exposure in national news and online media.",
      linkText: 'Shorty Awards - Micro-site Winner',
      linkUrl: 'https://shortyawards.com/15th/match-group-x-visible-partner-to-launch-a-singles-registry',
    },
    {
      id: 8,
      image1: Signin1,
      image2: Signin2,
      title: 'Sign-in App',
      techStack: 'Python / Streamlit / Plotly',
      description: 'Developed an in-house app that tracks weekly sign-in status for individuals and teams in a hybrid work environment.'
    },
  ]);

  const [transitionDirection, setTransitionDirection] = useState('next');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const TOTAL_ITEMS = items.length;
  const TRANSITION_TIME = 1200;
  
  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionDirection('next');
    setItems(prev => [...prev.slice(1), prev[0]]);
    setActiveIndex(activeIndex + 1);
    setTimeout(() => {
      setIsAnimating(false);
    }, TRANSITION_TIME);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionDirection('prev');
    setItems(prev => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    setActiveIndex(activeIndex - 1);
    setTimeout(() => {
      setIsAnimating(false);
    }, TRANSITION_TIME);
  }, [isAnimating]);

  const handleItemClick = useCallback((id) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const clickedIndex = items.findIndex(item => item.id === id);
    const newItems = [...items.slice(clickedIndex), ...items.slice(0, clickedIndex)];
    setItems(newItems);
    setActiveIndex(id - 1);
    setTimeout(() => {
      setIsAnimating(false);
    }, TRANSITION_TIME);
    setTransitionDirection('next');
  }, [items, isAnimating]);

  const getPositiveIndex = (index, length) => {
    return ((index % length) + length) % length;
  };

  const progress = ((activeIndex % items.length + 1) / TOTAL_ITEMS) * 100;

  return (
    <div id="works" className={`${styles.Carousel}`}>
      <div className={`${styles.List}`}>
        {items.map((item, idx) => (
          idx === 0 ?
          <div
            key={item.id}
            className={`${styles.MainItem} ${styles.Item} ${transitionDirection === 'next' ? styles.slideNext : ''} ${transitionDirection === 'prev' ? styles.slidePrev : ''} ${idx === 0 ? styles.Active : ''}`}
          >
            <div className={`${styles.Images}`}>
              <div className={styles.ImgWrapper}>
                {item.link1 ?
                  <Link href={item.link1} target='_blank'><Image className={styles.Img} src={item.image1} alt={item.title} /></Link>
                  :
                  <Image className={styles.Img} src={item.image1} alt={item.title} />
                }
              </div>
              <div className={styles.ImgWrapper}>
                {item.link2 ?
                  <Link href={item.link2} target='_blank'><Image className={styles.Img} src={item.image2} alt={item.title} /></Link>
                  :
                  <Image className={styles.Img} src={item.image2} alt={item.title} />
                }
              </div>
              <div className={`${styles.Content}`}>
                <div className={`${styles.Title}`} data-item={item.id}>{item.title}</div>
                <div className={`${styles.Name}`}>{item.techStack}</div>
                <div className={`${styles.Des}`}>{item.description}</div>
                {item.linkText && <Link
                  href={item.linkUrl}
                  target='_blank'
                  className={styles.LinkBtn}
                >
                  {item.linkText}
                </Link>}
              </div>
            </div>
          </div>
          :
          <button
            key={item.id}
            className={`${styles.ItemButton} ${styles.Item} ${transitionDirection === 'next' ? styles.slideNext : ''} ${transitionDirection === 'prev' ? styles.slidePrev : ''} ${idx === 0 ? styles.Active : ''}`}
            onClick={() => handleItemClick
            (item.id)}
          >
            <div className={`${styles.Images}`}>
              <div className={styles.ImgWrapper}>
                <Image className={styles.Img} src={item.image1} alt={item.title} />
              </div>
              <div className={styles.ImgWrapper}>
                <Image className={styles.Img} src={item.image2} alt={item.title} />
              </div>
            </div>
            <div className={`${styles.Content}`}>
              <div className={`${styles.Title}`} data-item={item.id}>{item.title}</div>
              <div className={`${styles.Name}`}>{item.techStack}</div>
              <div className={`${styles.Des}`}>{item.description}</div>
            </div>
          </button>
        ))}
      </div>

      <div className={`${styles.Arrows}`}>
        <button 
          className={`arrow-prev ${styles.Prev}`} 
          onClick={handlePrev}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <button 
          className={`arrow-next ${styles.Next}`} 
          onClick={handleNext}
        >
          <i className="bi bi-arrow-right"></i>
        </button>

        <div className={`${styles.Progress}`}>
          {String(getPositiveIndex(activeIndex, items.length) + 1).padStart(2, '0')}/{String(TOTAL_ITEMS).padStart(2, '0')}
        </div>

        <div className={`${styles.ProgressBarContainer}`}>
          <div className={`${styles.ProgressBar}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <a href="#hero" className={styles.DownArrow}>
        <Image src={DownArrow} alt="Down Arrow" />
      </a>
    </div>
  );
};

export default WorkGallery;
