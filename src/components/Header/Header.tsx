import React, { useState, useEffect, useRef } from 'react'
import { FaChevronDown } from 'react-icons/fa'

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
  Flex,
} from '@chakra-ui/core'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/core'
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
      <Square my="4" onClick={participate}>
        <TzButton />
      </Square>
      {state.color ? (
        <Square mb="16">
          <Flex align="center">
            <Box
              style={{
                backgroundColor: state.color,
              }}
              w="24px"
              h="24px"
              mr={3}
              borderRadius="md"
              boxShadow="lg"
            ></Box>{' '}
            {/* TODO: current color name */}
            Fuzzy Wuzzy
          </Flex>
        </Square>
      ) : (
        ''
      )}
      <Menu>
        <MenuButton as={Button} rightIcon={<FaChevronDown />}>
          {/* TODO: display selected color from list instead of "Select color"
          <Flex align="center">
            <Box
              bg="#cc6666"
              w="24px"
              h="24px"
              mr={3}
              borderRadius="md"
              boxShadow="lg"
            ></Box>{' '}
            Fuzzy Wuzzy
          </Flex>
          */}
          Select color
        </MenuButton>
        <MenuList>
          {/* TODO: show list of colors owned by my address */}
          {state.availableColors.map((c) => (
            <MenuItem>
              <Box
                style={{
                  backgroundColor: c.symbol,
                }}
                w="24px"
                h="24px"
                mr={3}
                borderRadius="md"
                boxShadow="lg"
              ></Box>{' '}
              {c.name}
            </MenuItem>
          ))}

          <MenuItem>
            <Box
              bg="#a6e7ff"
              w="24px"
              h="24px"
              mr={3}
              borderRadius="md"
              boxShadow="lg"
            ></Box>{' '}
            Fresh Air
          </MenuItem>
          <MenuItem>
            <Box
              bg="#b0c4de"
              w="24px"
              h="24px"
              mr={3}
              borderRadius="md"
              boxShadow="lg"
            ></Box>{' '}
            Light steel blue
          </MenuItem>
        </MenuList>
      </Menu>

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
