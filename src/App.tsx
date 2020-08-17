import React from 'react';
import './App.css';
import theme from '@chakra-ui/theme';

import Navigation from './components/Navigation/Navigation';
import Header from './components/Header/Header';
import HowTo from './components/HowTo/HowTo';
import Faq from './components/Faq/Faq';
import Footer from './components/Footer/Footer';

import { Stack, ChakraProvider, CSSReset } from '@chakra-ui/core';

// Use at the root of your app
class App extends React.Component<{}> {
  render() {
    return (
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Navigation></Navigation>
        <Stack minH="90vh">
          <Header></Header>
          <HowTo></HowTo>
          <Faq></Faq>
        </Stack>
        <Footer />
      </ChakraProvider>
    );
  }
}

export default App;
