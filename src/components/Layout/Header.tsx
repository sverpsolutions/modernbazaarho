import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTabStore } from '../../store/tabStore';
import { useAuthStore } from '../../store/authStore';
import { APP_ROUTES } from '../../routes/config';
import { toast } from 'react-hot-toast';
import { audit_api } from '../../api/audit';
import api from '../../api/axios';
import BackupModal from '../common/BackupModal';

interface HeaderProps {
  onSidebarToggle: () => void;
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  const location = useLocation();
  const [navId, setNavId] = useState('');
  const addTab = useTabStore(s => s.addTab);
  const user = useAuthStore(s => s.user);

  // Notifications state
  const [pendingVendors, setPendingVendors] = useState<number>(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleNav = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const route = APP_ROUTES.find(r => r.id === navId);
      if (route) {
        addTab({ id: route.path, title: route.title, path: route.path });
        audit_api.log({
          action: 'OPEN',
          module: route.title,
          details: `Opened via Fast Navigation (ID: ${navId})`
        });
        setNavId('');
      } else {
        toast.error(`Invalid Form ID: ${navId}`);
      }
    }
  };

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get('/suppliers', {
          params: { registration_status: 'submitted', per_page: 1, page: 1 },
        });
        setPendingVendors(res.data?.total ?? 0);
      } catch { /* ignore */ }
    };
    fetchPending();
    const timer = setInterval(fetchPending, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-[56px] bg-white border-b border-border flex items-center px-6 gap-4 sticky top-0 z-50">
      <button 
        onClick={onSidebarToggle}
        className="w-9 h-9 rounded-fiori hover:bg-bg-app flex items-center justify-center text-text-secondary transition-all"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Global Command Bar */}
      <div className="flex-1 flex justify-center max-w-2xl mx-auto">
        <div className="relative group w-full">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[12px]"></i>
          <input
            type="text"
            className="w-full h-9 bg-bg-app border border-border rounded-fiori pl-9 pr-32 focus:border-primary outline-none transition-all text-[13px] text-text-primary"
            placeholder="Search forms or Transaction ID (e.g. 101)..."
            value={navId}
            onChange={(e) => setNavId(e.target.value)}
            onKeyDown={handleNav}
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
             <span className="text-[9px] font-bold text-text-muted border border-border px-1.5 rounded bg-white uppercase">Enter to Go</span>
             <kbd className="px-1.5 py-0.5 bg-white border border-border rounded text-[10px] font-mono shadow-sm">⌘K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Global Tools */}
        <div className="flex items-center gap-4 pr-4 border-r border-border">
          <button 
            onClick={() => setShowBackupModal(true)}
            className="text-text-secondary hover:text-primary transition-all"
            title="Database Backup"
          >
            <i className="fas fa-database text-lg"></i>
          </button>

          <button 
            onClick={() => addTab({ id: '/help', title: 'System Help', path: '/help' })}
            className="text-text-secondary hover:text-primary transition-all"
            title="System Help (ID: 999)"
          >
            <i className="far fa-question-circle text-lg"></i>
          </button>
          
          <button
            onClick={() => addTab({ id: '/portals', title: 'Portal Hub', path: '/portals' })}
            className="text-text-secondary hover:text-primary transition-all"
            title="Portal Hub (ID: 990)"
          >
            <i className="fas fa-th-large text-lg"></i>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-bold text-text-primary leading-none m-0">{user?.name || 'Admin User'}</p>
            <p className="text-[10px] font-bold text-text-muted uppercase m-0 mt-1">{user?.role || 'Senior Manager'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <BackupModal isOpen={showBackupModal} onClose={() => setShowBackupModal(false)} />
    </header>
  );
}


