import React from 'react';
import HeaderComp from './HeaderComp.tsx';
import MainContent from './MainContent.tsx';
import Footer from './Footer';

export default function HomePage() {
  return (
    <>
      <HeaderComp />
      <MainContent />
      <Footer />
    </>
  );
}