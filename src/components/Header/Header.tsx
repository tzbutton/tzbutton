import React, { useState, useEffect, useRef } from 'react';
import Countdown from 'react-countdown';
import { Image, Square, Box, Divider, Text, Container, Button, Heading, useToast } from '@chakra-ui/core';

import {
  getPotAmount,
  checkRecentBlockForUpdates,
  readStateFromContract,
  participate,
  withdraw,
  openTezBlock,
  getMyAddress,
} from '../../services/beacon-service';
import { NUMBER_OF_BLOCKS_TO_WIN } from '../../constants';

import TzButtonPressed from '../../logos/tzbutton-logo-unpressed.svg';
import TzButtonUnpressed from '../../logos/tzbutton-logo-pressed.svg';

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
  myAddress: string;
}

const refreshContractState = async (setState: React.Dispatch<React.SetStateAction<AppState>>, toast?: any) => {
  console.log('refreshing');
  const contractState = await readStateFromContract();
  const myAddress = await getMyAddress();
  const startDate = new Date(contractState.leadership_start_timestamp);
  setState({
    loaded: true,
    potAmount: await getPotAmount(),
    leader: contractState.leader,
    leaderStartTime: startDate,
    leaderEndTime: getTargetTime(startDate),
    myAddress,
  });
  if (toast) {
    toast({
      title: 'New leader',
      description: 'Someone just became the new leader and the countdown was reset.',
      status: 'success',
      duration: 6000,
      isClosable: true,
    });
  }
};

const Header: React.FC = () => {
  const toast = useToast();
  const [state, setState] = useState<AppState>({
    loaded: false,
    potAmount: '',
    leader: '',
    leaderStartTime: undefined,
    leaderEndTime: undefined,
    myAddress: '',
  });
  const [isPressed, setIsPressed] = useState(false);

  const intervalRef = useRef<undefined | NodeJS.Timeout>();

  useEffect(() => {
    console.log('setting up interval');

    refreshContractState(setState);
    intervalRef.current = setInterval(async () => {
      const hasUpdates = await checkRecentBlockForUpdates();
      if (hasUpdates) {
        refreshContractState(setState, toast);
      }
    }, 10 * 1000);
    return () => {
      console.log('removing interval');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
        <Image
          style={{ cursor: 'pointer' }}
          src={isPressed ? TzButtonPressed : TzButtonUnpressed}
          onMouseEnter={() => setIsPressed(true)}
          onMouseLeave={() => setIsPressed(false)}
          width="200px"
          height="200px"
        ></Image>
      </Square>

      <Divider my={16} />
      <Text fontSize="3xl">
        Contract Balance: <Text as={'b'}>{state.potAmount} XTZ</Text>
      </Text>
      {state.leader === state.myAddress ? (
        <>
          <Text fontSize="6xl">You are currently the leader!</Text>
          <Text fontSize="xl">{state.leader}</Text>
        </>
      ) : (
        <Text fontSize="xl">Leader: {state.leader}</Text>
      )}

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
