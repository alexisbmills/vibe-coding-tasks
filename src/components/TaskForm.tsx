import type { FC } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  Box,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ITask, TaskInput } from '../types/task';

interface TaskFormProps {
  task?: ITask;
  onSubmit: (data: TaskInput) => void;
  isLoading?: boolean;
}

const TaskForm: FC<TaskFormProps> = ({ task, onSubmit, isLoading = false }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [errors, setErrors] = useState<{ name?: string; notes?: string }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: TaskInput = {
      name: formData.get('name') as string,
      notes: formData.get('notes') as string,
    };

    const newErrors: { name?: string; notes?: string } = {};

    if (!data.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setErrors({});
    onSubmit(data);
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      role="form"
      aria-label={task ? 'Edit task form' : 'Create task form'}
    >
      <VStack spacing={4} align="stretch">
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Task Name</FormLabel>
          <Input
            name="name"
            defaultValue={task?.name}
            placeholder="Enter task name"
            size="lg"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          <FormErrorMessage data-testid="name-error">
            {errors.name}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.notes}>
          <FormLabel>Notes</FormLabel>
          <Textarea
            name="notes"
            defaultValue={task?.notes}
            placeholder="Enter task notes"
            size="lg"
            rows={4}
            aria-invalid={!!errors.notes}
            aria-describedby={errors.notes ? 'notes-error' : undefined}
          />
          <FormErrorMessage id="notes-error">
            {errors.notes}
          </FormErrorMessage>
        </FormControl>

        <Box display="flex" gap={4} justifyContent="flex-end">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="lg"
            aria-label="Cancel and go back"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            isLoading={isLoading}
            loadingText={task ? 'Saving...' : 'Creating...'}
            aria-label={task ? 'Save task changes' : 'Create new task'}
          >
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default TaskForm; 