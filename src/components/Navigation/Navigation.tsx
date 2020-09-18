import React from "react";
import {
  Box,
  Link,
  Flex,
  IconButton,
  HStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/core";

import { FaGithub, FaMoon, FaSun, FaBell } from "react-icons/fa";

const Navigation: React.FC = () => {
  const { toggleColorMode: toggleMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <Flex
      w="100%"
      h="100%"
      padding="1.5rem"
      align="center"
      justify="space-between"
    >
      <Box alignItems="center" flexGrow={1}></Box>
      <Flex align="center" color="gray.400">
        <HStack spacing="2">
          <Link
            href="https://t.me/TezosNotifierBot?start=tzbutton_KT1L5XZbKeMXFDJuwr1zcFzkamTWf7kk6LRd_TzButton"
            isExternal
          >
            <IconButton
              size="md"
              fontSize="lg"
              aria-label={`Get notified about updates`}
              variant="ghost"
              color="current"
              icon={<FaBell />}
            />
          </Link>
          <Link href="https://github.com/tzbutton/tzbutton" isExternal>
            <IconButton
              size="md"
              fontSize="lg"
              aria-label={`Open on GitHub`}
              variant="ghost"
              color="current"
              icon={<FaGithub />}
            />
          </Link>
          <IconButton
            size="md"
            fontSize="lg"
            aria-label={`Switch to ${text} mode`}
            variant="ghost"
            color="current"
            onClick={toggleMode}
            icon={<SwitchIcon />}
          />
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Navigation;
