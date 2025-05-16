import type { FC } from 'react';
import { Box, VStack, Text, useColorModeValue, Skeleton } from '@chakra-ui/react';
import TaskItem from './TaskItem';
import type { ITask } from '../types/task';

interface TaskListProps {
  tasks: ITask[];
  isLoading?: boolean;
  error?: string | null;
  showArchived?: boolean;
  onToggleComplete: (id: string) => void;
  onToggleArchive: (id: string) => void;
}

const TaskList: FC<TaskListProps> = ({ 
  tasks,
  isLoading = false,
  error = null,
  showArchived = false,
  onToggleComplete,
  onToggleArchive
}) => {
  const emptyStateBg = useColorModeValue('gray.50', 'gray.700');

  if (error) {
    return (
      <Box
        p={4}
        borderRadius="md"
        bg="red.50"
        color="red.700"
        role="alert"
        aria-live="assertive"
      >
        <Text>{error}</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <VStack spacing={4} align="stretch">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            height="100px"
            borderRadius="md"
            startColor="gray.100"
            endColor="gray.200"
            data-testid="task-skeleton"
          />
        ))}
      </VStack>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        borderRadius="md"
        bg={emptyStateBg}
        role="status"
        aria-label="No tasks available"
      >
        <Text fontSize="lg" color="gray.500">
          {showArchived
            ? 'No tasks found. Create a new task to get started!'
            : 'No active tasks. Create a new task or check archived tasks.'}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      role="list"
      aria-label="Task list"
      tabIndex={0}
      _focus={{ outline: '2px solid', outlineColor: 'blue.500' }}
    >
      <VStack spacing={4} align="stretch">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onToggleArchive={onToggleArchive}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default TaskList; 