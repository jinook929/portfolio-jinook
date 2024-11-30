import Head from 'next/head';
import Cursor from "./components/Cursor";
import { Metadata } from 'next';

export const metadata = {
  title: 'Jinook Jung Dev',
  description:
    'codingbeautydev.com: Coding - the art, the science, and the passion.',
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Jinook Jung Dev</title>
      </Head>
      <div>
        <Cursor />
      </div>
    </>
  );
}
