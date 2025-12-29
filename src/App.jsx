import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { LayoutProvider } from '@/context/LayoutContext';
import { SearchProvider } from '@/context/SearchContext';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppSidebar } from '@/components/layout/AppSidebar';
import CommandMenu from '@/components/layout/CommandMenu';
import Dashboard from '@/features/dashboard';
import Brands from '@/features/brands';
import BrandDetail from '@/features/brands/BrandDetail';
import Trends from '@/features/trends';
import UploadData from '@/features/upload';
import ProfileSettings from '@/features/settings/profile';
import AppearanceSettings from '@/features/settings/appearance';

function AppContent() {
  const defaultOpen = typeof window !== 'undefined'
    ? localStorage.getItem('sidebar_state') !== 'false'
    : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:brandId" element={<BrandDetail />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/upload" element={<UploadData />} />
          <Route path="/settings/profile" element={<ProfileSettings />} />
          <Route path="/settings/appearance" element={<AppearanceSettings />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
