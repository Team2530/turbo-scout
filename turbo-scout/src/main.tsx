import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import Layout, { BaseLayout } from './Layout';
import ErrorPage from './ErrorPage';
import PitPage from './pit';
import SetupPage from './setup';
import MatchPage from './match';

const router = createBrowserRouter([
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
        element: <BaseLayout>share data</BaseLayout>
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
