
import { Outlet } from 'react-router-dom';
import { Header } from '../UI/Header';
import { Footer } from '../UI/Footer';
export const AppLayout = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};
