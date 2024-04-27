import './App.css'
import Layout from './components/Layout/Layout';
import NotFound from './components/NotFound/NotFound';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App