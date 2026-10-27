import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import RequireAuth from './components/RequireAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BlogsPage from './pages/BlogsPage';
import ChatPage from './pages/ChatPage';
import ModerationPage from './pages/ModerationPage';
import FaqsPage from './pages/FaqsPage';
import KnowledgePage from './pages/KnowledgePage';
import LeadsPage from './pages/LeadsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blog" element={<Navigate to="../blogs" replace />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="moderation" element={<ModerationPage />} />
        <Route path="faqs" element={<FaqsPage />} />
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}
