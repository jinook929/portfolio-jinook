"use client";

import Image from 'next/image';
import Link from 'next/link';
import styles from "./WorksMobile.module.scss";
import { EffectCube, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-cube';

const WorksMobile = ({ items }) => {
  return (
    <section className={styles.WorksMobile}>
      <Swiper
        className={styles.Swiper}
        modules={[EffectCube, Navigation, Pagination, Scrollbar, A11y]}
        effect={'cube'}
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        grabCursor={true}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className={styles.SwiperSlide}>
            <div className={styles.Work}>
              <div className={styles.Images}>
                {item.link1 ? 
                  <Link href={item.link1} target='_blank'>
                    <span className={styles.ImgWrapper}>
                      <Image src={item.image1} alt={item.title} />
                    </span>
                  </Link>
                  :
                  <span className={styles.ImgWrapper}>
                    <Image src={item.image1} alt={item.title} />
                  </span>
                }
                {item.link2 ? 
                  <Link href={item.link2} target='_blank'>
                    <span className={styles.ImgWrapper}>
                      <Image src={item.image2} alt={item.title} />
                    </span>
                  </Link>
                  :
                  <span className={styles.ImgWrapper}>
                    <Image src={item.image2} alt={item.title} />
                  </span>
                }
              </div>
              <div className={styles.Content}>
                {item.link1 ?
                  <h2 className={styles.Title}><Link href={item.link1} target='_blank'>{item.title}</Link></h2>
                  :
                  <h2 className={styles.Title}>{item.title}</h2>
                }
                <p className={styles.Tech}>{item.techStack}</p>
                <p className={styles.Description}>{item.description}</p>
                {item.linkText && <a className={styles.specialLink} href={item.linkUrl} target='_blank'>{item.linkText}</a>}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default WorksMobile;