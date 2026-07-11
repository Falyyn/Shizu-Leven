import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const Sidebar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="hidden md:flex flex-col items-center py-8 gap-bento-gap fixed left-0 top-0 h-[calc(100%-4rem)] m-container-margin rounded-[32px] w-[280px] bg-zinc-900 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 ml-8 mt-8">
      <div className="flex flex-col items-center mb-8 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 border border-primary/30">
          <span className="material-symbols-outlined text-3xl">widgets</span>
        </div>
        <h1 className="font-headline font-semibold text-xl text-white">Shizu Leven</h1>
        <p className="font-sans text-xs text-zinc-400 mt-1">Precision Systems</p>
      </div>

      <div className="w-full px-4 flex-1">
        <ul className="flex flex-col gap-2">
          <li>
            <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 font-sans text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory" className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 font-sans text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
              <span className="material-symbols-outlined">inventory_2</span>
              <span>Inventory</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 font-sans text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>



      <div className="w-full px-4 mt-auto">
        <ul className="flex flex-col gap-2 pt-4 border-t border-zinc-800">
          <li>
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 font-sans text-sm font-medium">
              <span className="material-symbols-outlined">logout</span>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
