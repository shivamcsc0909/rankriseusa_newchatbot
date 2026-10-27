import { getAdminKey } from '@/chat/admin/services/adminSession';
import AdminCommunityModeration from '@/chat/admin/components/AdminCommunityModeration';

export default function ModerationPage() {
  const adminKey = getAdminKey();
  if (!adminKey) return null;
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Community Moderation</h1>
        <p className="text-sm text-white/50 mt-1">Approve profiles and moderate comments.</p>
      </header>
      <AdminCommunityModeration adminKey={adminKey} />
    </div>
  );
}
