import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BlogBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function BlogBreadcrumbs({ items }: BlogBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
              {isLast || !item.href ? (
                <span className="text-foreground font-bold line-clamp-1 max-w-[200px] md:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
