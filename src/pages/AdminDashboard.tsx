import { Outlet } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';

export function AdminDashboard() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
