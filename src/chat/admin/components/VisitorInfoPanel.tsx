import {
  Clock,
  Fingerprint,
  Globe,
  Languages,
  Mail,
  MapPin,
  Monitor,
  Navigation,
  Smartphone,
  User,
} from 'lucide-react';
import type { VisitorInfo } from '../types';

interface VisitorInfoPanelProps {
  visitor: VisitorInfo | null;
  online?: boolean;
  assignedAgentId?: string | null;
  status?: string;
}

function formatDateTime(timestamp: number): string {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function VisitorInfoPanel({
  visitor,
  online,
  assignedAgentId,
  status,
}: VisitorInfoPanelProps) {
  if (!visitor) {
    return <div className="p-6 text-sm text-white/40">No visitor selected.</div>;
  }

  const rows = [
    { icon: Fingerprint, label: 'Visitor ID', value: visitor.id },
    { icon: Mail, label: 'Email', value: visitor.email ?? 'Not provided' },
    { icon: Navigation, label: 'IP', value: visitor.ip ?? '—' },
    {
      icon: MapPin,
      label: 'Location',
      value: visitor.country || visitor.location || 'Unknown',
    },
    { icon: Globe, label: 'Current page', value: visitor.currentPage ?? '—' },
    { icon: Monitor, label: 'Browser', value: visitor.browser ?? 'Unknown' },
    { icon: Smartphone, label: 'Device', value: visitor.device ?? 'Unknown' },
    { icon: Monitor, label: 'OS', value: visitor.os ?? 'Unknown' },
    { icon: Languages, label: 'Language', value: visitor.language ?? '—' },
    { icon: Clock, label: 'Timezone', value: visitor.timezone ?? '—' },
    { icon: Clock, label: 'First seen', value: formatDateTime(visitor.firstSeenAt) },
    { icon: Clock, label: 'Last seen', value: formatDateTime(visitor.lastSeenAt) },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#111b21] p-5 space-y-5">
      <div className="flex flex-col items-center gap-3 pb-5 border-b border-white/10">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-[#2a3942] flex items-center justify-center">
            <User className="w-8 h-8 text-[#00a884]" />
          </div>
          <span
            className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-[#111b21] ${
              online ? 'bg-emerald-400' : 'bg-white/30'
            }`}
          />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-white">{visitor.name}</p>
          <p className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">
            {online ? 'Online' : 'Offline'}
            {status ? ` · ${status}` : ''}
          </p>
          {assignedAgentId && (
            <p className="text-[11px] text-[#00a884] mt-1">Assigned: {assignedAgentId}</p>
          )}
        </div>
      </div>

      <dl className="space-y-4">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon className="w-4 h-4 text-[#00a884] mt-0.5 shrink-0" />
            <div className="min-w-0">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-bold">
                {label}
              </dt>
              <dd className="text-sm text-white/80 break-all">{value}</dd>
            </div>
          </div>
        ))}
      </dl>

      {visitor.userAgent && (
        <div className="pt-3 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">User-Agent</p>
          <p className="text-[11px] text-white/45 break-all leading-relaxed">{visitor.userAgent}</p>
        </div>
      )}
    </div>
  );
}
