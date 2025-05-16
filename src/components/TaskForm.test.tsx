import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TaskForm from './TaskForm';

const mockNavigate = vi.fn();
const mockOnSubmit = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create task form correctly', () => {
    renderWithProvider(<TaskForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/task name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create new task/i }))
      .toBeInTheDocument();
  });

  it('renders edit task form correctly', () => {
    const task = {
      id: '1',
      name: 'Test Task',
      notes: 'Test Notes',
      completed: null,
      archived: false,
    };

    renderWithProvider(
      <TaskForm task={task} onSubmit={mockOnSubmit} />
    );
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Notes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save task changes/i }))
      .toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProvider(<TaskForm onSubmit={mockOnSubmit} />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const errorMessage = screen.getByTestId('name-error');
      expect(errorMessage).toHaveTextContent('Task name is required');
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    renderWithProvider(<TaskForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/task name/i);
    const notesInput = screen.getByLabelText(/notes/i);
    const submitButton = screen.getByRole('button', { name: /create new task/i });

    fireEvent.change(nameInput, { target: { value: 'New Task' } });
    fireEvent.change(notesInput, { target: { value: 'New Notes' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Task',
        notes: 'New Notes',
      });
    });
  });

  it('handles cancel button click', () => {
    renderWithProvider(<TaskForm onSubmit={mockOnSubmit} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel and go back/i });
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('shows loading state', () => {
    renderWithProvider(<TaskForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: /create new task/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/creating/i)).toBeInTheDocument();
  });
}); 