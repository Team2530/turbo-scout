import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import Layout from './Layout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <p>Error route!</p>,
    children: [
      {
        path: "/setup",
        element: <p>Setup route</p>
      },
      {
        path: "/pit",
        element: <p>Pit scouting</p>
      },
      {
        path: "/match",
        element: <p>match scouting</p>
      },
      {
        path: "/share",
        element: <p>share data</p>
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
