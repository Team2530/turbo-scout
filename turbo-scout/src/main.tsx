import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import Layout, { BaseLayout } from './Layout';
import ErrorPage from './ErrorPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/setup",
        element: <BaseLayout>Setup route</BaseLayout>
      },
      {
        path: "/pit",
        element: <BaseLayout>Pit scouting</BaseLayout>
      },
      {
        path: "/match",
        element: <BaseLayout>match scouting</BaseLayout>
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
