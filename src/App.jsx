import './App.css'
import Layout from './components/Layout/Layout';
import ErrorPage from './components/ErrorPage/ErrorPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
    },
  ],
    {
      basename: "/openlayers_rumap_react/",
    }
  );

  return (
    <RouterProvider router={router} />
  )
}

export default App