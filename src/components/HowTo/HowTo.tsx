import React from "react";
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
} from "@chakra-ui/core";
import { getLink } from "../../util";

import { CONTRIBUTION_AMOUNT_STRING } from "../../constants";

import Timeline from "../../timeline.png";

import AirGap from "../../logos/airgap-logo.svg";
import Beacon from "../../logos/beacon-logo.svg";
import Thanos from "../../logos/thanos-logo.svg";

const beaconLink: JSX.Element = getLink(
  "Beacon",
  "https://www.walletbeacon.io/"
);
const taquitoLink: JSX.Element = getLink("Taquito", "https://tezostaquito.io/");
const buttonRedditLink: JSX.Element = getLink(
  'Reddit "The Button"',
  "https://www.reddit.com/r/thebutton/"
);

const HowTo: React.FC = () => {
  const elements = [
    {
      title: "How does it work?",
      description: (
        <>
          The TZButton experiment is controlled by a smart contract deployed on
          the Tezos blockchain. Whenever anyone presses the button three things
          will happen:
          <Text mt="3">
            <OrderedList>
              <ListItem>
                You will add {CONTRIBUTION_AMOUNT_STRING()} to the smart
                contract’s balance
              </ListItem>
              <ListItem>
                The address of the sender will become the leader
              </ListItem>
              <ListItem>The countdown is reset</ListItem>
            </OrderedList>
          </Text>
          <Text mt="6">
            The address that is the leader after the countdown expired will be
            eligible to withdraw the total balance on the smart contract.
          </Text>
          <Text mt="3">
            The countdown is slightly shorter the higher the contracts balance
            is. In the beginning, the countdown is set to 24 hours. The first
            couple transactions will decrease the countdown a lot, but as time
            goes on, transactions will only slightly adjust the countdown. The
            lowest countdown possible is 5 minutes.
          </Text>
          <br />
          <br />
          Example:
          <Image src={Timeline} width="100%"></Image>
          <OrderedList>
            <ListItem>
              Alice presses the button, {CONTRIBUTION_AMOUNT_STRING()} are now
              on the smart contract, the countdown is reduced by{" "}
              {" PLACEHOLDER "}, which means it's {" PLACEHOLDER "} hours
              starts.
            </ListItem>
            <ListItem>
              Many people participate , {CONTRIBUTION_AMOUNT_STRING(1000)} are
              now on the smart contract, the countdown is now at{" "}
              {" PLACEHOLDER "} minutes and starts.
            </ListItem>
            <ListItem>
              After 200 minutes Bob presses the button,{" "}
              {CONTRIBUTION_AMOUNT_STRING(1001)} are now on the smart contract,
              the countdown is reduced by {" PLACEHOLDER "}
              the countdown resets to {" PLACEHOLDER "} minutes and starts.
            </ListItem>
            <ListItem>
              After 5 minutes Charlie presses the button,{" "}
              {CONTRIBUTION_AMOUNT_STRING(3)} are now on the smart contract, the
              countdown resets to {" PLACEHOLDER "} minutes and starts.
            </ListItem>
            <ListItem>
              No one presses the button for more than {" PLACEHOLDER "} minutes.{" "}
            </ListItem>
            <ListItem>
              Charlie can now withdraw {CONTRIBUTION_AMOUNT_STRING(3)}, because
              he was the last leader and his countdown has expired.
            </ListItem>
          </OrderedList>
        </>
      ),
    },
    {
      title: "How to participate",
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
      title: "Why TzButton?",
      description: (
        <>
          The experiment was inspired by “the Button” (an experiment conducted
          with Reddit users {buttonRedditLink}). Besides the fact that the
          behavior of the participating users will be automatically recorded on
          the blockchain and analyzed + published on this site, there are also
          other reasons why this experiment is interesting:
          <Text mt="3">
            <UnorderedList>
              <ListItem>
                It showcases how easy it is for dApps to interact securely with
                the Tezos blockchain using the existing libraries in the
                ecosystem (like {beaconLink} and {taquitoLink})
              </ListItem>
              <ListItem>
                It sets an incentive for security engineers to try to break and
                exploit the smart contract. This could mean two things:
                <OrderedList>
                  <ListItem>
                    The contract and tooling used is secure and can be used as a
                    reference for future applications.
                  </ListItem>
                  <ListItem>
                    A breach would be transparent and recorded on the
                    blockchain, meaning the entire community would be able to
                    learn from it.
                  </ListItem>
                </OrderedList>
              </ListItem>
              <ListItem>
                It provides to the community an open source boilerplate/project
                to create dApps on the Tezos Blockchain.
              </ListItem>
            </UnorderedList>
          </Text>
        </>
      ),
    },
  ];
  return (
    <Box bg="gray.100" py={16}>
      {elements.map((el, index) => (
        <span key={index}>
          {index !== 0 ? <Divider my={16} /> : ""}
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
