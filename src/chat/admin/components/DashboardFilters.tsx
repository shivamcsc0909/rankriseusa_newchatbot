import { Search } from 'lucide-react';
import type { ConversationFilter } from '../types';

interface DashboardFiltersProps {
  filter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  counts: Record<ConversationFilter, number>;
}

const FILTERS: { id: ConversationFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'unread', label: 'Unread' },
  { id: 'pending', label: 'Pending' },
  { id: 'closed', label: 'Closed' },
];

export default function DashboardFilters({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  counts,
}: DashboardFiltersProps) {
  return (
    <div className="space-y-3 p-3 border-b border-white/5 shrink-0 bg-[#111b21]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search or start new chat"
          aria-label="Search conversations"
          className="w-full h-9 rounded-lg bg-[#202c33] border-0 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#00a884]/40"
        />
      </div>

      <div className="flex gap-1 overflow-x-auto pb-0.5" role="tablist" aria-label="Conversation filters">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            onClick={() => onFilterChange(id)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              filter === id
                ? 'bg-[#00a884] text-[#111b21]'
                : 'bg-[#202c33] text-white/50 hover:text-white'
            }`}
          >
            {label}
            <span className="ml-1 opacity-70">{counts[id] ?? 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
