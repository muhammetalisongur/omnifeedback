import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const components = [
  { name: 'Toast', path: '/toast', icon: '🔔' },
  { name: 'Modal', path: '/modal', icon: '📦' },
  { name: 'Loading', path: '/loading', icon: '⏳' },
  { name: 'Confirm', path: '/confirm', icon: '❓' },
  { name: 'Progress', path: '/progress', icon: '📊' },
  { name: 'Drawer', path: '/drawer', icon: '📂' },
  { name: 'Sheet', path: '/sheet', icon: '📄' },
  { name: 'Banner', path: '/banner', icon: '🏷️' },
  { name: 'Prompt', path: '/prompt', icon: '✏️' },
  { name: 'Alert', path: '/alert', icon: '⚠️' },
  { name: 'Popconfirm', path: '/popconfirm', icon: '💬' },
  { name: 'Skeleton', path: '/skeleton', icon: '🦴' },
  { name: 'Empty', path: '/empty', icon: '📭' },
  { name: 'Result', path: '/result', icon: '✅' },
  { name: 'Connection', path: '/connection', icon: '🌐' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps): React.ReactElement {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64
          border-r bg-background overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <nav className="p-4 space-y-6">
          {/* Home */}
          <div className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground/70 hover:text-foreground'
                }`
              }
              onClick={() => window.innerWidth < 1024 && onClose()}
            >
              <span>🏠</span>
              <span>Home</span>
            </NavLink>
          </div>

          {/* Components */}
          <div>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Components
            </h3>
            <div className="space-y-1">
              {components.map((component) => (
                <NavLink
                  key={component.path}
                  to={component.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground/70 hover:text-foreground'
                    }`
                  }
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <span>{component.icon}</span>
                  <span>{component.name}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Resources
            </h3>
            <div className="space-y-1">
              <a
                href="https://github.com/muhammetalisongur/omnifeedback"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <span>📚</span>
                <span>Documentation</span>
              </a>
              <a
                href="https://github.com/muhammetalisongur/omnifeedback"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <span>⭐</span>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
