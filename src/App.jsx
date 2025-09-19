import React from 'react';
import { AppLayout } from './components/Layout/AppLayout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home';
import { FindDonor } from './pages/FindDonor';
import { Contact } from './pages/Contact';
import { About } from './pages/About'; 
import {Login} from './pages/Login';
import {Register} from './pages/Register';
import { Profile } from './pages/Profile';
import { ErrorPage } from './pages/ErrorPage';  
import './App.css'; 
const router = createBrowserRouter([
  {
    path: '/', 
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/find-donor', element: <FindDonor /> },
      { path: '/contact', element: <Contact /> },
      { path: '/about', element: <About /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/profile', element: <Profile /> },
    ]
  } 
]);

const App = () => {
  return (
    <RouterProvider router={router}> </RouterProvider>
  );
};

export default App;