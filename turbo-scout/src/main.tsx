import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Root route</div>,
    errorElement: <p>Error route!</p>,
    children: [
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
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
)
