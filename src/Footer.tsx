import React from 'react';
import { FaGithub } from 'react-icons/fa';

import { Container, Box, Flex, Button, Text, Stack, Link, Divider, Icon, IconButton } from '@chakra-ui/core';

export class Footer extends React.Component<{}> {
  render() {
    const data = {
      gcms: {
        social: [{ slug: 'test', name: 'test', iconName: <FaGithub /> }],
        contact: [{ slug: 'test', name: 'test', iconName: <FaGithub /> }],
      },
    };

    return (
      <Box as="footer" py={10} px={8}>
        <Box maxW="1000px" mx="auto">
          <Flex wrap="wrap" justify="center">
            <Stack textAlign="center" my={4} w={['100%', '50%', '33%']}>
              <Text fontWeight="900">Social</Text>
              {data.gcms.social.map((link, index) => (
                <Link href={link.slug} key={index} isExternal _hover={{ textDecoration: 'none' }}>
                  <Button variant="ghost" leftIcon={link.iconName} color="gray.500">
                    {link.name}
                  </Button>
                </Link>
              ))}
            </Stack>
            <Stack textAlign="center" my={4} w={['100%', '50%', '33%']}>
              <Text fontWeight="900">Contact</Text>
              {data.gcms.contact.map((link, index) => (
                <Link href={link.slug} key={index} isExternal _hover={{ textDecoration: 'none' }}>
                  <Button variant="ghost" leftIcon={link.iconName} color="gray.500">
                    {link.name}
                  </Button>
                </Link>
              ))}
            </Stack>
          </Flex>
          <Divider borderColor="gray.300" mb={4} mt={4} />
          <Flex justifyContent="space-between">
            <Link to="/">
              <Icon name="Logo" color="gray.500" w={24} />
            </Link>
            <Stack>
              <IconButton aria-label="GitHub" icon={<FaGithub />} isRound color="gray.500" />
              <IconButton aria-label="GitHub" icon={<FaGithub />} isRound color="gray.500" />
            </Stack>
          </Flex>
          <Divider borderColor="gray.300" mb={4} mt={4} />
          <Flex justifyContent="space-between">
            <Container>
              Disclaimer: This is an experiment, consider the funds you send to the contract as lost. No one forces you
              to participate.
              <br />
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
              LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
              EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
              IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
              THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </Container>
          </Flex>
        </Box>
      </Box>
    );
  }
}
