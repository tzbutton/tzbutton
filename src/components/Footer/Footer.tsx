import React from 'react';
import { FaGithub, FaEnvelope, FaTwitter } from 'react-icons/fa';

import {
  HStack,
  Container,
  Box,
  Flex,
  Button,
  Text,
  Stack,
  Link,
  Divider,
  Image,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/core';

import Beacon from '../../logos/beacon-logo.svg';
import AirGap from '../../logos/airgap-logo.svg';

const data = {
  code: [
    {
      link: 'https://github.com/tzbutton/tzbutton',
      name: 'Frontend',
      icon: <FaGithub />,
    },
    {
      link: 'https://github.com/tzbutton/tzbutton-contract',
      name: 'Contract',
      icon: <FaGithub />,
    },
  ],
  social: [
    {
      link: 'https://twitter.com/airgap_it',
      name: 'Twitter',
      icon: <FaTwitter />,
    },
  ],
  contact: [{ link: 'mailto:hi@airgap.it', name: 'Email', icon: <FaEnvelope /> }],
};

const Footer: React.FC = () => {
  const { colorMode } = useColorMode();

  const bg = useColorModeValue('gray.100', 'gray.100');
  const color = useColorModeValue('black', 'gray.800');

  return (
    <Box as="footer" bg={bg} color={color} py={10} px={8}>
      <Box maxW="xl" mx="auto">
        <Flex wrap="wrap" justify="center">
          <Stack textAlign="center" my={4} w={['100%', '50%', '33%']}>
            <Text fontWeight="900">Code</Text>
            {data.code.map((item, index) => (
              <Link href={item.link} key={index} isExternal _hover={{ textDecoration: 'none' }}>
                <Button variant="ghost" leftIcon={item.icon} color="gray.500">
                  {item.name}
                </Button>
              </Link>
            ))}
          </Stack>
          <Stack textAlign="center" my={4} w={['100%', '50%', '33%']}>
            <Text fontWeight="900">Social</Text>
            {data.social.map((item, index) => (
              <Link href={item.link} key={index} isExternal _hover={{ textDecoration: 'none' }}>
                <Button variant="ghost" leftIcon={item.icon} color="gray.500">
                  {item.name}
                </Button>
              </Link>
            ))}
          </Stack>
          <Stack textAlign="center" my={4} w={['100%', '50%', '33%']}>
            <Text fontWeight="900">Contact</Text>
            {data.contact.map((item, index) => (
              <Link href={item.link} key={index} isExternal _hover={{ textDecoration: 'none' }}>
                <Button variant="ghost" leftIcon={item.icon} color="gray.500">
                  {item.name}
                </Button>
              </Link>
            ))}
          </Stack>
        </Flex>
        <Divider borderColor="gray.300" my={4} />
        <Container>
          <HStack>
            <Link href="https://airgap.it/" isExternal>
              <Image src={AirGap} width="150px"></Image>
            </Link>
            <Link href="https://walletbeacon.io/" isExternal>
              <Image src={Beacon} width="150px"></Image>
            </Link>
          </HStack>
        </Container>
        <Divider borderColor="gray.300" my={4} />
        <Container>
          <Text fontSize="xs">
            <Text as="b">Disclaimer</Text>: This is an experiment, consider the funds you send to the contract as lost.
            No one forces you to participate.
          </Text>
          <Text fontSize="xs">
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
            LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
            EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
            AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
            OR OTHER DEALINGS IN THE SOFTWARE.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
