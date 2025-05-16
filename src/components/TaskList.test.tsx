import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import TaskList from './TaskList';
import type { ITask } from '../types/task';

// Mock data
const mockTasks: ITask[] = [
  {
    id: '1',
    name: 'Test Task 1',
    notes: 'Test notes 1',
    completed: null,
    archived: false,
  },
  {
    id: '2',
    name: 'Test Task 2',
    notes: 'Test notes 2',
    completed: new Date(),
    archived: true,
  },
];

// Mock functions
const mockToggleComplete = vi.fn();
const mockToggleArchive = vi.fn();

// Wrapper component with providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        {ui}
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    renderWithProviders(
      <TaskList
        tasks={[]}
        isLoading={true}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    const skeletons = screen.getAllByTestId('task-skeleton');
    expect(skeletons).toHaveLength(3); // We render 3 skeleton items
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Test error message';
    renderWithProviders(
      <TaskList
        tasks={[]}
        error={errorMessage}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });

  it('renders empty state correctly when no tasks', () => {
    renderWithProviders(
      <TaskList
        tasks={[]}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'No active tasks. Create a new task or check archived tasks.'
    );
  });

  it('renders empty state correctly when showing archived tasks', () => {
    renderWithProviders(
      <TaskList
        tasks={[]}
        showArchived={true}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'No tasks found. Create a new task to get started!'
    );
  });

  it('renders list of tasks correctly', () => {
    renderWithProviders(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('displays task names and notes correctly', () => {
    renderWithProviders(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test notes 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Test notes 2')).toBeInTheDocument();
  });

  it('shows completion status correctly', () => {
    renderWithProviders(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked(); // First task not completed
    expect(checkboxes[1]).toBeChecked(); // Second task completed
  });

  it('shows archive status correctly', () => {
    renderWithProviders(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    expect(screen.getByText('Archived')).toBeInTheDocument();
    expect(screen.getByText('Unarchive')).toBeInTheDocument();
  });

  it('calls onToggleComplete when checkbox is clicked', () => {
    renderWithProviders(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(mockToggleComplete).toHaveBeenCalledWith('1');
  });

  it('calls onToggleArchive when archive button is clicked', () => {
    renderWithProviders(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    const archiveButton = screen.getByText('Unarchive');
    fireEvent.click(archiveButton);

    expect(mockToggleArchive).toHaveBeenCalledWith('2');
  });

  it('handles keyboard navigation for task completion', () => {
    renderWithProviders(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.keyDown(checkboxes[0], { key: 'Enter', code: 'Enter' });

    expect(mockToggleComplete).toHaveBeenCalledWith('1');
  });

  it('renders edit buttons with correct links', () => {
    renderWithProviders(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    const editButtons = screen.getAllByRole('link', { name: /edit/i });
    expect(editButtons).toHaveLength(2);
    expect(editButtons[0]).toHaveAttribute('href', '/task/1');
    expect(editButtons[1]).toHaveAttribute('href', '/task/2');
  });

  it('applies correct styling for completed tasks', () => {
    renderWithProviders(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggleComplete}
        onToggleArchive={mockToggleArchive}
      />
    );

    const completedTask = screen.getByText('Test Task 2');
    expect(completedTask).toHaveStyle({ textDecoration: 'line-through' });
  });
}); 