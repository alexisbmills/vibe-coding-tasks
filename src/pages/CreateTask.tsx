import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useTaskManager } from '../hooks/useTaskManager';
import TaskForm from '../components/TaskForm';
import type { TaskInput } from '../types/task';

const CreateTask: FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createTask, isLoading } = useTaskManager();

  const handleSubmit = (data: TaskInput) => {
    createTask(data);
    toast({
      title: 'Success',
      description: 'Task created successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/');
  };

  return (
    <Container maxW="container.md" py={8}>
      <Heading size="lg" mb={6}>Create New Task</Heading>
      <TaskForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default CreateTask; 