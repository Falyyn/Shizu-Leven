import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const MainLayout = () => {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex antialiased">
      <Sidebar />
      <main className="flex-1 w-full md:ml-[calc(280px+3rem)] flex flex-col min-h-screen relative">
        <TopBar />
        <div className="p-gutter-grid flex-1">
          <Outlet />
        </div>
        

      </main>
    </div>
  );
};

export default MainLayout;
