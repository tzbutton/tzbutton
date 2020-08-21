import React from 'react';
import { Box, Link, Flex, IconButton, HStack, useColorMode, useColorModeValue } from '@chakra-ui/core';

import { FaGithub, FaMoon, FaSun } from 'react-icons/fa';

const Navigation: React.FC = () => {
  const { toggleColorMode: toggleMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <Flex w="100%" h="100%" padding="1.5rem" align="center" justify="space-between">
      <Box alignItems="center" flexGrow={1}></Box>
      <Flex align="center" color="gray.400">
        <HStack spacing="2">
          <Link href="https://github.com/AndreasGassmann/tztip.me" isExternal>
            <IconButton
              size="md"
              fontSize="lg"
              aria-label={`Open on GitHub`}
              variant="ghost"
              color="current"
              ml="3"
              icon={<FaGithub />}
            />
          </Link>
          <IconButton
            size="md"
            fontSize="lg"
            aria-label={`Switch to ${text} mode`}
            variant="ghost"
            color="current"
            ml="3"
            onClick={toggleMode}
            icon={<SwitchIcon />}
          />
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Navigation;
