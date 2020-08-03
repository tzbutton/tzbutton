import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import Countdown from 'react-countdown';
import { Square, Box, VStack, Divider, Text, Container, Button, Heading } from '@chakra-ui/core';

import {
  getPotAmount,
  checkRecentBlockForUpdates,
  readStateFromContract,
  participate,
  withdraw,
  openTezBlock,
} from '../../services/beacon-service';
import { NUMBER_OF_BLOCKS_TO_WIN } from '../../constants';

import TzButtonSvg from '../../tzbutton-logo.svg';

const WinnerAnnouncement = () => (
  <span>
    The game is over!
    <br />
    <Button onClick={withdraw} colorScheme="green" size="sm">
      Withdraw
    </Button>
  </span>
);

const getTargetTime = (start: Date) => {
  const end = new Date(start.getTime() + NUMBER_OF_BLOCKS_TO_WIN * 60 * 1000);

  return end;
};

interface AppState {
  loaded: boolean;
  potAmount: string;
  leader: string;
  leaderStartTime: Date | undefined;
  leaderEndTime: Date | undefined;
}

const refreshContractState = async (setState: React.Dispatch<React.SetStateAction<AppState>>) => {
  console.log('refreshing');
  const contractState = await readStateFromContract();
  const startDate = new Date(contractState.leadership_start_timestamp);
  setState({
    loaded: true,
    potAmount: await getPotAmount(),
    leader: contractState.leader,
    leaderStartTime: startDate,
    leaderEndTime: getTargetTime(startDate),
  });
};

const Header: React.FC = () => {
  const [state, setState] = useState<AppState>({
    loaded: false,
    potAmount: '',
    leader: '',
    leaderStartTime: undefined,
    leaderEndTime: undefined,
  });

  useEffect(() => {
    console.log('setting up interval');
    refreshContractState(setState);
    setInterval(async () => {
      const hasUpdates = await checkRecentBlockForUpdates();
      if (hasUpdates) {
        refreshContractState(setState);
      }
    }, 10 * 1000);
    return () => {
      console.log('removing interval');
    };
  }, []);

  const content = state.loaded ? (
    <>
      <Heading as="h1" size="xl" fontWeight="semibold">
        TzButton
      </Heading>

      <Text opacity={0.7} fontSize="xl" mt="6">
        A social experiment on the Tezos blockchain.
      </Text>
      <Text fontSize="6xl">
        {!!state.leaderEndTime ? (
          <Countdown date={state.leaderEndTime} daysInHours={true} zeroPadTime={2}>
            <WinnerAnnouncement />
          </Countdown>
        ) : (
          'Loading...'
        )}
      </Text>

      <Square mt="6" onClick={participate}>
        <img src={TzButtonSvg} width="200px"></img>
      </Square>

      {/* <Text>Leadership start time: {state.leaderStartTime?.toString()}</Text> */}
      <Divider my={16} />
      <Text fontSize="3xl">
        Contract Balance: <Text as={'b'}>{state.potAmount} XTZ</Text>
      </Text>
      <Text fontSize="xl">Leader: {state.leader}</Text>
      <Button mt={8} onClick={openTezBlock} colorScheme="blue" size="sm">
        History
      </Button>
    </>
  ) : (
    <Box my={50}>Loading...</Box>
  );

  return (
    <Box mb={20}>
      <Box as="section" pt={24} pb={16}>
        <Container>
          <Box maxW="xl" mx="auto" textAlign="center">
            {content}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Header;
