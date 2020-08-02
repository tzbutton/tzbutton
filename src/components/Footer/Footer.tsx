import React from 'react';
import { FaGithub, FaEnvelope, FaTwitter } from 'react-icons/fa';
import styles from './Footer.module.css';

import { HStack, Container, Box, Flex, Button, Text, Stack, Link, Divider, Icon, useColorMode } from '@chakra-ui/core';

const data = {
  code: [
    { link: 'test', name: 'Frontend', icon: <FaGithub /> },
    { link: 'test', name: 'Contract', icon: <FaGithub /> },
  ],
  social: [{ link: 'test', name: 'Twitter', icon: <FaTwitter /> }],
  contact: [{ link: 'test', name: 'Email', icon: <FaEnvelope /> }],
};

const Footer: React.FC = () => {
  const { colorMode } = useColorMode();
  console.log('colorMode', colorMode);

  return (
    <Box as="footer" bg="gray.100" py={10} px={8}>
      <Box maxW="1000px" mx="auto">
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
        <Flex backgroundColor="gray" justifyContent="space-between">
          <HStack>
            <Link to="/">
              <Icon name="Logo" color="gray.500" w={24} />
            </Link>
            <Link to="/">
              <Icon name="Logo" color="gray.500" w={24} />
            </Link>
          </HStack>
        </Flex>
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
