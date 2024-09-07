import {
  Box,
  Flex,
  Text,
  IconButton,
  useColorMode,
  Button,
  HStack,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Link from "next/link";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg={colorMode === "light" ? "gray.100" : "gray.900"} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        {/* Logo */}
        <Link href="/">
          <Text fontSize="xl" fontWeight="bold">
            RupeeTrader
          </Text>
        </Link>
        {/* Navigation Links */}
        <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/screener">
            <Button variant="ghost">Screener</Button>
          </Link>
        </HStack>

        {/* Theme Toggle Button */}
        <IconButton
          size={"md"}
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          aria-label={"Toggle Color Mode"}
          onClick={toggleColorMode}
        />
      </Flex>
    </Box>
  );
};

export default Header;
