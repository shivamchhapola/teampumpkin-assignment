import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Trips from './pages/Trips';
import Map from './pages/Map';
import Login from './pages/Login';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/trips',
      element: <Trips />,
    },
    {
      path: '/map',
      element: <Map />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
