import { useEffect, useState } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import TabBar from '../components/Layout/TabBar'; // Import TabBar
import TabbedOutlet from '../components/Layout/TabbedOutlet';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useKeyboardNavigation(); // Enable Shift+Tab / Ctrl+Tab navigation

  // Remember collapsed state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved === 'true') setSidebarCollapsed(true);
  }, []);

  function handleToggle() {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-app-bg font-sans">
      {/* ── Left Sidebar ── */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggle} />

      {/* ── Main Area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onSidebarToggle={handleToggle} />

        {/* Multi-Tab Bar ── Restored! */}
        <TabBar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto relative">
          <TabbedOutlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
