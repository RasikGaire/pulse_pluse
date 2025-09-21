import React from 'react';
import { AppLayout } from './components/Layout/AppLayout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Home } from './pages/Home';
import { FindDonor } from './pages/FindDonor';
import { Contact } from './pages/Contact';
import { About } from './pages/About'; 
import {Login} from './pages/Login';
import {Register} from './pages/Register';
import { Profile } from './pages/Profile';
import { ProfileVerification } from './pages/ProfileVerification';
import { RequestBlood } from './pages/RequestBlood';
import { BloodRequestDashboard } from './pages/BloodRequestDashboard';
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
      { path: '/profile-verification', element: <ProfileVerification /> },
      { path: '/request-blood', element: <RequestBlood /> },
      { path: '/blood-requests', element: <BloodRequestDashboard /> },
    ]
  } 
]);

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;