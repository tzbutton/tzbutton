import React from 'react';

import {
  Link,
  Heading,
  Image,
  Box,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/core';

import { CONTRIBUTION_AMOUNT_STRING } from '../../constants';

const catImage = (
  <>
    There are:
    <br />
    <Image src="https://source.unsplash.com/collection/139386/" boxSize="200"></Image>
  </>
);

const getLink = (name: string, link: string) => {
  return (
    <Link href={link} isExternal>
      {name}
    </Link>
  );
};

const airgapLink: JSX.Element = getLink('AirGap', 'https://airgap.it/');
const tzButtonGithubLink: JSX.Element = getLink('TzButton GitHub', 'https://github.com/tzbutton/tzbutton');

const FAQs = [
  {
    title: `Are there any fees?`,
    description: `The only fees are the transaction fees (gas cost to execute your transaction).`,
  },
  {
    title: `Who developed TZButton?`,
    description: <>TZButton was developed by members of the {airgapLink} team during their free time.</>,
  },
  {
    title: `Can I press the button multiple times?`,
    description: `Yes. Just keep in mind that every time the button is pressed, you will add ${CONTRIBUTION_AMOUNT_STRING()} to the balance and the countdown will be reset. So it does not make any sense to press it if you already are the leader.`,
  },
  {
    title: `How is this project funded?`,
    description: (
      <>
        This project was created on a voluntary basis during our free time. We don't have any direct commercial
        motivation.
        <br />
        <br />
        The only thing that could be considered as a commercial motivation is that the contracts balance is delegated to
        the AirGap baker. All resulting baking rewards will be used to support open source software.
      </>
    ),
  },
  {
    title: `Where can I find the source code of this project?`,
    description: (
      <>
        The entire project is released using the permissive MIT license, you can find the code on github:{' '}
        {tzButtonGithubLink}
      </>
    ),
  },
  {
    title: `How can I participate in the experiment?`,
    description: `In case you already have a beacon compatible wallet, you just have to press the button. In case you don't have a beacon compatible wallet yet, here are some guide how to set up one: coming soon`,
  },
  {
    title: `How can I withdraw the balance?`,
    description: `When the countdown expires the current button will become the withdraw button.`,
  },
  {
    title: `If I'm the leader and the countdown expires, how quickly do I need to withdraw the balance?`,
    description: `No rush. You can take all the time you need, no one will be able to overwrite your leader position and you are the only one capable of withdrawing the funds.`,
  },
  {
    title: `Can't the contract owner withdraw the balance?`,
    description: `No. The contract does not have such a function. Only the leader can withdraw the balance once the countdown expired.`,
  },
  {
    title: `Why are there no cat pictures on this site?`,
    description: catImage,
  },
  {
    title: `Can I pay more than ${CONTRIBUTION_AMOUNT_STRING()}?`,
    description: `No, the contract will not allow you to pay more or less than ${CONTRIBUTION_AMOUNT_STRING()}.`,
  },
  {
    title: `Can I pay less than ${CONTRIBUTION_AMOUNT_STRING()}?`,
    description: `No, the contract will not allow you to pay more or less than ${CONTRIBUTION_AMOUNT_STRING()}.`,
  },
  {
    title: `Is this dApp secure?`,
    description: `We've put in a lot of effort to make it as easy and secure as possible (and our team is dedicated to security). It is an experiment and it should be dealt with that way. Don't participate if you cannot afford to lose the 0.2 TZ you are sending to the contract.`,
  },
];

const Faq: React.FC = () => (
  <Box as="section" py={16}>
    <Container>
      <Box maxW="1000px" mx="auto">
        <Heading mb={4}>FAQs</Heading>
        <Accordion allowToggle>
          {FAQs.map((faq, index) => {
            return (
              <AccordionItem key={index}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {faq.title}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>{faq.description}</AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Box>
    </Container>
  </Box>
);

export default Faq;
