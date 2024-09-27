import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { MantineProvider } from '@mantine/core';
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
        path: "/share",
        element: <SharePage />
      }
    ]
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme='dark'>
      <Notifications />
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>,
)
