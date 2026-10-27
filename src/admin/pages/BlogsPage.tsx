import { getAdminKey } from '@/chat/admin/services/adminSession';
import AdminBlogManager from '@/components/blog/admin/AdminBlogManager';

export default function BlogsPage() {
  const adminKey = getAdminKey() || undefined;
  return <AdminBlogManager adminKey={adminKey} />;
}
