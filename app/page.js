import Hero from "./components/Hero";
import Cursor from "./components/Cursor";
import WorkGallery from "./components/WorkGallery";
import Cards from './components/Cards';

export const metadata = {
  title: 'Jinook Jung Dev',
  description:
    'Bridging Design and Development to Create Impactful Online Journeys',
};

export default function Home() {
  return (
    <div className="wrapper">
      <Cursor />
      <Hero />
      <WorkGallery />
      {/* <Cards /> */}
    </div>
  );
}
