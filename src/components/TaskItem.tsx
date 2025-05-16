import type { FC } from 'react';
import {
  Card,
  CardBody,
  Checkbox,
  Text,
  HStack,
  Spacer,
  IconButton,
  useColorModeValue,
  Box,
  Badge,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import type { ITask } from '../types/task';

interface TaskItemProps {
  task: ITask;
  onToggleComplete: (id: string) => void;
  onToggleArchive: (id: string) => void;
}

const TaskItem: FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete,
  onToggleArchive,
}) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const completedColor = useColorModeValue('green.500', 'green.300');
  const archivedColor = useColorModeValue('purple.500', 'purple.300');

  const getCompletionDate = () => {
    if (!task.completed) return null;
    const date = new Date(task.completed);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleComplete(task.id);
    }
  };

  return (
    <Card
      variant="outline"
      bg={bgColor}
      borderColor={borderColor}
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'md',
        bg: hoverBg,
      }}
      transition="all 0.2s"
      position="relative"
      role="listitem"
      aria-label={`Task: ${task.name}`}
      tabIndex={0}
      onKeyPress={handleKeyPress}
    >
      {task.completed && (
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="green"
          variant="subtle"
          fontSize="xs"
          aria-label="Task completed"
        >
          Completed
        </Badge>
      )}
      {task.archived && (
        <Badge
          position="absolute"
          top={2}
          right={task.completed ? 24 : 2}
          colorScheme={archivedColor}
          variant="subtle"
          fontSize="xs"
          aria-label="Task archived"
        >
          Archived
        </Badge>
      )}
      <CardBody>
        <HStack spacing={4} align="start">
          <Tooltip
            label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            placement="top"
          >
            <Checkbox
              isChecked={!!task.completed}
              onChange={() => onToggleComplete(task.id)}
              onKeyDown={handleKeyPress}
              colorScheme="blue"
              size="lg"
              mt={1}
              aria-label={`Mark task "${task.name}" as ${
                task.completed ? 'incomplete' : 'complete'
              }`}
            />
          </Tooltip>
          <Box flex="1">
            <Text
              fontSize="lg"
              fontWeight="medium"
              textDecoration={task.completed ? 'line-through' : 'none'}
              color={task.completed ? 'gray.500' : 'inherit'}
            >
              {task.name}
            </Text>
            {task.notes && (
              <Text
                fontSize="sm"
                color="gray.500"
                mt={1}
                noOfLines={2}
                aria-label="Task notes"
              >
                {task.notes}
              </Text>
            )}
            {task.completed && (
              <Text
                fontSize="xs"
                color={completedColor}
                mt={1}
                fontWeight="medium"
                aria-label={`Completed on ${getCompletionDate()}`}
              >
                Completed: {getCompletionDate()}
              </Text>
            )}
          </Box>
          <Spacer />
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="ghost"
              colorScheme={task.archived ? archivedColor : 'gray'}
              onClick={() => onToggleArchive(task.id)}
              aria-label={task.archived ? 'Unarchive task' : 'Archive task'}
            >
              {task.archived ? 'Unarchive' : 'Archive'}
            </Button>
            <Button
              as={RouterLink}
              to={`/task/${task.id}`}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              aria-label="Edit task"
            >
              Edit
            </Button>
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default TaskItem; 