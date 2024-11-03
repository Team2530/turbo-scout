import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { createTheme, MantineColorsTuple, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import Layout from './layout';

import ErrorPage from './pages/error';
import PitPage from './pages/pit';
import SetupPage from './pages/setup';
import MatchPage from './pages/match';
import SharePage from './pages/share';
import StrategyPage from './pages/strategy';

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <SetupPage />
      },
      {
        path: "/pit",
        element: <PitPage />
      },
      {
        path: "/match",
        element: <MatchPage />
      },
      {
        path: "/strategy",
        element: <StrategyPage />
      },
      {
        path: "/share",
        element: <SharePage />
      }
    ]
  },
]);

const teamColorsTuple: MantineColorsTuple = [
  '#ebfce9',
  '#dcf4d8',
  '#b9e6b3',
  '#94d78b',
  '#75cb69',
  '#61c453',
  '#56c047',
  '#45a938',
  '#3b972f',
  '#2c8224'
];


const theme = createTheme({
  colors: {
    green: teamColorsTuple
  },
  primaryColor: 'green'
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme='dark' theme={theme}>
      <Notifications />
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>,
)
