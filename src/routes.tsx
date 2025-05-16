import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const TaskView = lazy(() => import('./pages/TaskView'));
const CreateTask = lazy(() => import('./pages/CreateTask'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'task/:id',
        element: <TaskView />,
      },
      {
        path: 'task/new',
        element: <CreateTask />,
      },
    ],
  },
]; 