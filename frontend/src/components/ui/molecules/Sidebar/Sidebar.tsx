import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  Home,
  LogOut,
  Calendar,
  StickyNote,
  Pill,
  TestTube,
  FileText,
  Settings,
  UserCog,
  ChevronDown,
  ChevronRight,
  FileBarChart,
  ClipboardList,
} from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/styles/utils';
import { useAuth } from '@/context/auth';

import { ROUTES } from '@/utils/constants';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  roles?: string[]; // Roles that can see this item
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const ROLES = {
  CLINICAL_STAFF: ['clinical_staff', 'doctor', 'nurse', 'physician'],
  ADMIN: ['admin', 'office_staff', 'administrator'],
  SYSTEM_ADMIN: ['system_admin', 'super_admin'],
} as const;

const isSystemAdmin = (role: string): boolean => {
  const normalizedRole = role.toLowerCase();
  return ROLES.SYSTEM_ADMIN.some(r => normalizedRole === r || normalizedRole.includes(r));
};

const allNavSections: NavSection[] = [
    {
      items: [
        {
          title: 'Dashboard',
          href: ROUTES.HOME,
          icon: Home,
          roles: ['CLINICAL_STAFF', 'ADMIN', 'SYSTEM_ADMIN'],
        },
        {
          title: 'Patients',
          href: ROUTES.PATIENTS,
          icon: Users,
          roles: ['CLINICAL_STAFF', 'ADMIN', 'SYSTEM_ADMIN'],
        },
        {
          title: 'Appointments',
          href: ROUTES.APPOINTMENTS,
          icon: Calendar,
          roles: ['CLINICAL_STAFF', 'ADMIN', 'SYSTEM_ADMIN'],
        },
        {
          title: 'Tasks',
          href: ROUTES.TASKS,
          icon: ClipboardList,
          roles: ['CLINICAL_STAFF', 'ADMIN', 'SYSTEM_ADMIN'],
        },
      ],
    },
    {
      title: 'Clinical',
      items: [
        {
          title: 'Clinical Notes',
          href: ROUTES.CLINICAL_NOTES,
          icon: StickyNote,
          roles: ['CLINICAL_STAFF', 'SYSTEM_ADMIN'],
        },
        {
          title: 'Medications',
          href: ROUTES.MEDICATIONS,
          icon: Pill,
          roles: ['CLINICAL_STAFF', 'SYSTEM_ADMIN'],
        },
        {
          title: 'Labs & Results',
          href: ROUTES.LABS_RESULTS,
          icon: TestTube,
          roles: ['CLINICAL_STAFF', 'SYSTEM_ADMIN'],
        },
      ],
    },
    {
      title: 'Administrative',
      items: [
        {
          title: 'Insurance Management',
          href: ROUTES.INSURANCE_MANAGEMENT,
          icon: FileText,
          roles: ['ADMIN', 'SYSTEM_ADMIN'],
        },
        {
          title: 'Reports',
          href: ROUTES.REPORTS,
          icon: FileBarChart,
          roles: ['ADMIN', 'SYSTEM_ADMIN'],
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'User Management',
          href: ROUTES.USER_MANAGEMENT,
          icon: UserCog,
          roles: ['ADMIN', 'SYSTEM_ADMIN'],
        },
        {
          title: 'Settings',
          href: ROUTES.SETTINGS,
          icon: Settings,
          roles: ['ADMIN', 'SYSTEM_ADMIN'],
        },
      ],
    },
];

const Sidebar = ({ open = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const userRole = user?.role?.toLowerCase() || '';

  const hasAccess = useCallback((itemRoles?: string[]): boolean => {
    if (!itemRoles || itemRoles.length === 0) return true;

    if (isSystemAdmin(userRole)) return true;

    return itemRoles.some(roleGroup => {
      const roleVariations = ROLES[roleGroup as keyof typeof ROLES] || [];

      return roleVariations.some(role => {
        const normalizedRole = role.toLowerCase();
        return userRole === normalizedRole;
      });
    });
  }, [userRole]);

  // Filter navigation sections based on user role
  const navSections = useMemo(() => {
    return allNavSections
      .map(section => ({
        ...section,
        items: section.items
          .filter(item => hasAccess(item.roles))
          .map(item => {
            if (item.children) {
              return {
                ...item,
                children: item.children.filter(child => hasAccess(child.roles)),
              };
            }
            return item;
          }),
      }))
      .filter(section => section.items.length > 0);
  }, [hasAccess]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    onClose?.();
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const sectionKey = item.title.toLowerCase().replace(/\s+/g, '');
    const isExpanded = expandedSections[sectionKey] || false;
    const isActive = item.href && location.pathname === item.href;

    if (hasChildren) {
      return (
        <div key={item.title} className="space-y-1">
          <button
            onClick={() => toggleSection(sectionKey)}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              level > 0 && 'pl-6',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.children?.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        to={item.href || '#'}
        onClick={onClose}
        className={cn(
          'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          level > 0 && 'pl-6',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col overflow-y-auto',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <nav className="flex-1 p-4 space-y-6">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-2">
              {section.title && (
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">{section.items.map(item => renderNavItem(item))}</div>
            </div>
          ))}
        </nav>

        {user && (
          <div className="border-t p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="shrink-0">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export { Sidebar };
