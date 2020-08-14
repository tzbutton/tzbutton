import React from 'react';
import {
  OrderedList,
  ListItem,
  UnorderedList,
  Box,
  Heading,
  Divider,
  Container,
  Image,
  Text,
  Link,
  HStack,
} from '@chakra-ui/core';
import { getLink } from '../../util';

import { CONTRIBUTION_AMOUNT_STRING } from '../../constants';

import Timeline from '../../timeline.png';

import AirGap from '../../logos/airgap-logo.svg';
import Beacon from '../../logos/beacon-logo.svg';
import Thanos from '../../logos/thanos-logo.svg';

const beaconLink: JSX.Element = getLink('Beacon', 'https://www.walletbeacon.io/');
const taquitoLink: JSX.Element = getLink('Taquito', 'https://tezostaquito.io/');
const buttonRedditLink: JSX.Element = getLink('Reddit "The Button"', 'https://www.reddit.com/r/thebutton/');

const HowTo: React.FC = () => {
  const elements = [
    {
      title: 'How does it work?',
      description: (
        <>
          The TZButton experiment is controlled by a smart contract deployed on the Tezos blockchain. Whenever anyone
          presses the button three things will happen:
          <Container mt="3">
            <OrderedList>
              <ListItem>
                You will add <b>{CONTRIBUTION_AMOUNT_STRING()}</b> to the smart contract’s balance
              </ListItem>
              <ListItem>The address of the sender will become the leader</ListItem>
              <ListItem>The countdown is reset</ListItem>
            </OrderedList>
          </Container>
          <Text mt="3">
            The address that is the leader after the countdown expired will be eligible to withdraw the total balance on
            the smart contract.
          </Text>
          <br />
          <br />
          Example:
          <Image src={Timeline} width="100%"></Image>
          <OrderedList>
            <ListItem>
              Alice presses the button, <b>{CONTRIBUTION_AMOUNT_STRING()}</b> are now on the smart contract, the
              countdown is reset and the total time is reduced by <b>1 hour and 30 minutes</b>, which means it's now
              counting down from <b>22 hours and 30 minutes</b>.
            </ListItem>
            <ListItem>
              <b>1 hour and 25 minutes</b> before the countdown expires, Bob presses the button.{' '}
              <b>{CONTRIBUTION_AMOUNT_STRING(1)}</b> are now in the smart contract, the countdown is reset and the total
              time is reduced by <b>45 minutes</b>, which means it's now counting down from{' '}
              <b>21 hours and 45 minutes</b>.
            </ListItem>
            <ListItem>
              Many people participate, the balance of the smart contract increases and the time each countdown lasts
              decreases, <b>but the countdown never hits 0</b>. Each transaction adds another{' '}
              <b>{CONTRIBUTION_AMOUNT_STRING()}</b>, the balance grows to <b>{CONTRIBUTION_AMOUNT_STRING(12099)}</b> and
              the countdown resets to <b>9 hours and 1 minute</b>.
            </ListItem>
            <ListItem>
              <b>5 hours and 32 minutes</b> before the countdown expires, Charlie presses the button,{' '}
              <b>{CONTRIBUTION_AMOUNT_STRING(12100)}</b> are now on the smart contract, the countdown is reset and the
              total time is reduced by only <b>around half a second</b>, which means it's still counting down from{' '}
              <b>9 hours and 1 minute</b>. The countdown now changes so little that it requires multiple transactions
              for the countdown to decrease another second.
            </ListItem>
            <ListItem>
              No one presses the button for more than 9 hours and 1 minute. This means <b>Charlie is the winner</b>.
            </ListItem>
            <ListItem>
              Charlie can now withdraw <b>{CONTRIBUTION_AMOUNT_STRING(12100)}</b>, because he was the leader when the
              countdown.
            </ListItem>
          </OrderedList>
        </>
      ),
    },
    {
      title: 'How to participate',
      description: (
        <>
          Download a beacon compatible wallet and click the button.
          <Container mt="8">
            <HStack spacing="24px">
              <Link href="https://airgap.it/" isExternal>
                <Image src={AirGap} width="150px"></Image>
              </Link>
              <Link
                href="https://chrome.google.com/webstore/detail/beacon-extension/gpfndedineagiepkpinficbcbbgjoenn"
                isExternal
              >
                <Image src={Beacon} width="150px"></Image>
              </Link>
              <Link href="https://thanoswallet.com/" isExternal>
                <Image src={Thanos} width="150px"></Image>
              </Link>
            </HStack>
          </Container>
        </>
      ),
    },
    {
      title: 'Why TzButton?',
      description: (
        <>
          The experiment was inspired by “the Button” (an experiment conducted with Reddit users {buttonRedditLink}).
          Besides the fact that the behavior of the participating users will be automatically recorded on the blockchain
          and analyzed + published on this site, there are also other reasons why this experiment is interesting:
          <Container mt="3">
            <UnorderedList>
              <ListItem>
                It showcases how easy it is for dApps to interact securely with the Tezos blockchain using the existing
                libraries in the ecosystem (like {beaconLink} and {taquitoLink})
              </ListItem>
              <ListItem>
                It sets an incentive for security engineers to try to break and exploit the smart contract. This could
                mean two things:
                <OrderedList>
                  <ListItem>
                    The contract and tooling used is secure and can be used as a reference for future applications.
                  </ListItem>
                  <ListItem>
                    A breach would be transparent and recorded on the blockchain, meaning the entire community would be
                    able to learn from it.
                  </ListItem>
                </OrderedList>
              </ListItem>
              <ListItem>
                It provides to the community an open source boilerplate/project to create dApps on the Tezos Blockchain.
              </ListItem>
            </UnorderedList>
          </Container>
        </>
      ),
    },
  ];
  return (
    <Box bg="gray.100" py={16}>
      {elements.map((el, index) => (
        <span key={index}>
          {index !== 0 ? <Divider my={16} /> : ''}
          <Container>
            <Heading mb={4}>{el.title}</Heading>
            {el.description}
          </Container>
        </span>
      ))}
    </Box>
  );
};

export default HowTo;
