import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

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
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
)
