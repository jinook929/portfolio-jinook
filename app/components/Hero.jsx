"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.scss';
import { Typewriter } from 'react-simple-typewriter'
import LinkedIn from "../../public/linkedin.png";
import GitHub from "../../public/github.png";
import Email from "../../public/email.png";
import DownArrow from "../../public/down-arrow.svg";

import localFont from 'next/font/local';
const audiowideFont = localFont({ src: '../fonts/Audiowide-Regular.ttf' });

const Hero = () => {
  return (
    <div id="hero" className={styles.Hero}>
      <h1 className={`${audiowideFont.className} ${styles.Title}`}>
        <Typewriter
          words={['Jinook Jung', 'Software Engineer', 'Full Stack', 'JS / Python / PHP', "and more ...", 'Jinook Jung']}
          loop={1}
          cursor={false}
          typeSpeed={100}
          deleteSpeed={50}
          delaySpeed={1500}
        />
      </h1>
      <p className={styles.Description}>
        <span>Bridging Design and Development</span>
        <span>to Create Impactful Online Journeys</span>
      </p>
      <span className={styles.Comment}>
        currently working at <a href="https://www.madwell.com/" target='_blank'>Madwell</a>
        <br />
        ( also available for freelance projects )
        </span>
      <div className={styles.Links}>
        <Link href="https://www.linkedin.com/in/jinook-jung/" target="_blank">
          <Image src={LinkedIn} alt="LinkedIn" />
        </Link>
        <Link href="mailto:jinook929@gmainl.com" target="_blank">
          <Image src={Email} alt="Email" />
        </Link>
        <Link href="https://github.com/jinook929" target="_blank">
          <Image src={GitHub} alt="GitHub" />
        </Link>
      </div>
      <div className={styles.CTA}>
        <a href="#works" className={styles.DownArrow}>
          <Image src={DownArrow} alt="Down Arrow" />
        </a>
      </div>
      <span className={styles.Divider}></span>
    </div>
  );
};

export default Hero;
