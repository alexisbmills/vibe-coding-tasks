import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Skeleton,
  useToast,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  Spacer,
} from '@chakra-ui/react';
import { useTaskManager } from '../hooks/useTaskManager';
import TaskForm from '../components/TaskForm';
import type { TaskInput } from '../types/task';
import { useRef, useState } from 'react';

const TaskView: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { tasks, updateTask, deleteTask, isLoading } = useTaskManager();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const task = tasks.find(t => t.id === id);

  const handleSubmit = (data: TaskInput) => {
    if (!id) return;
    
    updateTask(id, data);
    toast({
      title: 'Success',
      description: 'Task updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/');
  };

  const handleDelete = () => {
    if (!id) return;
    deleteTask(id);
    toast({
      title: 'Task deleted',
      description: 'The task was deleted successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/');
  };

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <Skeleton height="200px" />
      </Container>
    );
  }

  if (!task) {
    return (
      <Container maxW="container.md" py={8}>
        <Heading size="lg" mb={6}>Task not found</Heading>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <HStack mb={6} align="center">
        <Heading size="lg">Edit Task</Heading>
        <Spacer />
        <Button
          colorScheme="red"
          onClick={() => setIsDeleteOpen(true)}
          aria-label="Delete task"
        >
          Delete
        </Button>
      </HStack>
      <TaskForm
        task={task}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Task
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3} aria-label="Confirm delete">
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default TaskView; 