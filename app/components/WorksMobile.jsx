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

const WorksMobile = (props) => {
  // const { items } = props;
  const items = [
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
        techStack: 'Next.js / JS.CSS Animation / Headless WP',
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
        title: 'Availability Sharing App',
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
    ];

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
          shadow: false,
          slideShadows: false,
          shadowOffset: 0,
          shadowScale: 0,
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
