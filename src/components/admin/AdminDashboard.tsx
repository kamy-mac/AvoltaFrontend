import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';


export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="py-10">
        <Outlet />
        
      </main>
      
    </div>
  );
}