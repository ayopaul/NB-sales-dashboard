import { ThemeProvider } from '@/context/ThemeContext';
import { LayoutProvider } from '@/context/LayoutContext';
import { SearchProvider } from '@/context/SearchContext';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppSidebar } from '@/components/layout/AppSidebar';
import CommandMenu from '@/components/layout/CommandMenu';
import Dashboard from '@/features/dashboard';

function AppContent() {
  const defaultOpen = typeof window !== 'undefined'
    ? localStorage.getItem('sidebar_state') !== 'false'
    : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Dashboard />
      </SidebarInset>
    </SidebarProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <SearchProvider>
          <LayoutProvider>
            <AppContent />
            <CommandMenu />
          </LayoutProvider>
        </SearchProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
