import type { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  HStack,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react';

const MainLayout: FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box
        as="nav"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        position="sticky"
        top="0"
        zIndex="sticky"
      >
        <Container maxW="container.xl">
          <Flex h="16" alignItems="center" justifyContent="space-between">
            <HStack spacing={8}>
              <ChakraLink
                as={Link}
                to="/"
                fontWeight="bold"
                fontSize="lg"
                _hover={{ textDecoration: 'none', color: 'blue.500' }}
              >
                Vibe Coding Tasks
              </ChakraLink>
            </HStack>
            <HStack spacing={4}>
              <ChakraLink
                as={Link}
                to="/"
                px={3}
                py={2}
                rounded="md"
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('gray.100', 'gray.700'),
                }}
              >
                Home
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/about"
                px={3}
                py={2}
                rounded="md"
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('gray.100', 'gray.700'),
                }}
              >
                About
              </ChakraLink>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout; 