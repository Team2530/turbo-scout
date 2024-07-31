import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <p>Root route</p>,
    errorElement: <p>Error route!</p>
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
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
