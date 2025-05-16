import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Spacer,
  Text,
  useColorModeValue,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
} from '@chakra-ui/react';
import { useTaskManager } from '../hooks/useTaskManager';
import TaskList from '../components/TaskList';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';

const Home: FC = () => {
  const navigate = useNavigate();
  const { 
    tasks, 
    isLoading, 
    error, 
    showArchived, 
    toggleShowArchived,
    setSearchQuery,
    toggleTaskCompletion,
    toggleTaskArchive
  } = useTaskManager();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleCreateTask = () => {
    navigate('/task/new');
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <HStack>
              <Heading size="lg">Tasks</Heading>
              <Spacer />
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleCreateTask}
              >
                Create Task
              </Button>
            </HStack>

            <HStack spacing={4}>
              <Box flex={1}>
                <SearchBar onSearch={setSearchQuery} />
              </Box>
              <FilterBar 
                showArchived={showArchived} 
                onToggleArchived={toggleShowArchived} 
              />
            </HStack>

            {error && (
              <Alert status="error" mb={4} borderRadius="md">
                <AlertIcon />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <VStack spacing={4} align="stretch">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height="100px" borderRadius="md" />
                ))}
              </VStack>
            ) : tasks.length === 0 ? (
              <Box
                p={8}
                textAlign="center"
                borderRadius="md"
                bg={useColorModeValue('gray.50', 'gray.700')}
              >
                <Text fontSize="lg" color="gray.500">
                  {showArchived 
                    ? 'No archived tasks found.'
                    : 'No tasks yet. Create your first task to get started!'}
                </Text>
              </Box>
            ) : (
              <TaskList 
                tasks={tasks}
                isLoading={isLoading}
                error={error}
                showArchived={showArchived}
                onToggleComplete={toggleTaskCompletion}
                onToggleArchive={toggleTaskArchive}
              />
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Home; 