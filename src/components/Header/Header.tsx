import React, { useState, useEffect, useRef } from 'react'
import Countdown from 'react-countdown'
import {
  VStack,
  Spinner,
  Square,
  Box,
  Divider,
  Text,
  Container,
  Link,
  Button,
  Heading,
  useToast,
} from '@chakra-ui/core'
import { getLink } from '../../util'
import TzButton from '../TzButton/TzButton'

import {
  getPotAmount,
  checkRecentBlockForUpdates,
  readStateFromContract,
  readColorStateFromContract,
  participate,
  withdraw,
  openTezBlock,
  openBetterCallDev,
  getMyAddress,
  getTezBlockLinkForAddress,
} from '../../services/beacon-service'
import { getNextCountdown } from '../../services/countdown-service'

import colors from '../../colors.json'
import { Colors, getColors } from '../../services/tzcolors-service'

const WinnerAnnouncement = () => (
  <span>
    The game is over!
    <br />
    <Button onClick={withdraw} colorScheme="green" size="sm">
      Withdraw
    </Button>
  </span>
)

interface AppState {
  loaded: boolean
  potAmount: string
  leader: string
  leaderStartTime: Date | undefined
  leaderEndTime: Date | undefined
  countdownTime: number
  myAddress: string
  color: string | undefined
  availableColors: Colors[]
}

const refreshContractState = async (
  setState: React.Dispatch<React.SetStateAction<AppState>>,
  toast?: any
) => {
  console.log('refreshing')
  const contractState = await readStateFromContract()
  const colorState = await readColorStateFromContract()
  console.log('colorState', colorState)
  console.log('ACTIVE COLOR', colorState.token_id.toFixed())
  const color =
    colors.find((c) => c.token_id === colorState.token_id.toNumber())?.symbol ??
    ''
  const myAddress = await getMyAddress()
  const availableColors = await getColors(myAddress)
  console.log('AVAILBLE COLORS', availableColors)
  const startDate = new Date(contractState.leadership_start_timestamp)
  const secondsToWin = contractState.countdown_milliseconds.div(1000).toNumber()
  const endDate = new Date(startDate.getTime() + secondsToWin * 1000)
  const newState = {
    loaded: true,
    potAmount: await getPotAmount(),
    leader: contractState.leader,
    leaderStartTime: startDate,
    leaderEndTime: endDate,
    countdownTime: secondsToWin,
    myAddress,
    color,
    availableColors,
  }
  initialResolve = Promise.resolve(newState)
  setState(newState)
  if (toast) {
    toast({
      position: 'top',
      title: 'New leader',
      description:
        'Someone just became the new leader and the countdown was reset.',
      status: 'success',
      duration: 6000,
      isClosable: true,
    })
  }
}

// TODO: Get rid of this
let initialResolve = new Promise(
  (resolve: React.Dispatch<React.SetStateAction<AppState>>, reject) => {
    refreshContractState(resolve)
  }
)

// TODO: Move this into component?
const globalState = {
  loaded: false,
  potAmount: '',
  leader: '',
  leaderStartTime: undefined,
  leaderEndTime: undefined,
  myAddress: '',
  countdownTime: 0,
  color: '',
  availableColors: [],
}

const Header: React.FC = () => {
  const toast = useToast()
  const [state, setState] = useState<AppState>(globalState)

  const intervalRef = useRef<undefined | NodeJS.Timeout>()

  useEffect(() => {
    console.log('setting up interval')

    initialResolve.then(setState)
    intervalRef.current = setInterval(async () => {
      const hasUpdates = await checkRecentBlockForUpdates()
      if (hasUpdates) {
        refreshContractState(setState, toast)
      }
    }, 10 * 1000)
    return () => {
      console.log('removing interval')
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [toast])

  const leaderLink = getLink(
    state.leader,
    getTezBlockLinkForAddress(state.leader)
  )

  const content = state.loaded ? (
    <>
      {state.availableColors.map((c) => (
        <div
          style={{
            backgroundColor: c.symbol,
            width: '100px',
            height: '100px',
          }}
        >
          {c.name}
        </div>
      ))}
      {state.color ? (
        <div
          style={{
            backgroundColor: state.color,
            width: '100px',
            height: '100px',
          }}
        >
          Active Color
        </div>
      ) : (
        ''
      )}

      <Heading as="h1" size="xl" fontWeight="semibold">
        TzButton
      </Heading>
      <Text opacity={0.7} fontSize="xl" mt="6">
        A social experiment on the Tezos blockchain.
      </Text>
      <Text fontSize="6xl">
        {!!state.leaderEndTime ? (
          <Countdown
            date={state.leaderEndTime}
            daysInHours={true}
            zeroPadTime={2}
          >
            <WinnerAnnouncement />
          </Countdown>
        ) : (
          'Loading...'
        )}
      </Text>
      <Square mt="6" onClick={participate}>
        <TzButton />
      </Square>
      <Text mt="6">
        Click the button to become the <b>new leader</b> and reset the countdown
        to
        <br /> <b>{getNextCountdown(state.countdownTime, state.potAmount)}</b>.
      </Text>
      <Divider my={16} />
      <Text fontSize="3xl">
        Pot Size <Text as={'b'}>{state.potAmount} tez</Text>
      </Text>
      {state.leader === state.myAddress ? (
        <>
          <Text fontSize="6xl">
            You are the leader!{' '}
            <span role="img" aria-label="Leader">
              🥇
            </span>
          </Text>
          <Text fontSize="xl">{leaderLink}</Text>
        </>
      ) : (
        <Text fontSize="xl">
          <span role="img" aria-label="Leader">
            🥇{' '}
          </span>
          {leaderLink}
        </Text>
      )}
      <Container>
        <Button
          mr={2}
          mt={8}
          onClick={openTezBlock}
          colorScheme="blue"
          size="sm"
        >
          History
        </Button>
        <Button mt={8} onClick={openBetterCallDev} colorScheme="blue" size="sm">
          Contract
        </Button>
      </Container>
      <Text mt="10">
        Round 1 &nbsp;
        <span role="img" aria-label="Winner">
          🏆{' '}
        </span>{' '}
        &nbsp;
        <Link
          href="https://tezblock.io/account/tz1LHjwnT3et96QZyjfUEZWuGE2kqn4N6qEP"
          isExternal
        >
          tz1LHjwnT3et96QZyjfUEZWuGE2kqn4N6qEP • 25.20 tez
        </Link>{' '}
      </Text>
      <Text opacity={0.7} mt="10">
        Disclaimer: This is an experiment with an unaudited smart contract,
        consider the funds you send to the contract as lost.
      </Text>
    </>
  ) : (
    <Box my={48}>
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text>Loading data from blockchain...</Text>
      </VStack>
    </Box>
  )

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
  )
}

export default Header
