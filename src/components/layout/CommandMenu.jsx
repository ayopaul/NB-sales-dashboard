import { useSearch } from '@/context/SearchContext';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Package,
  TrendingUp,
  Settings,
  HelpCircle,
} from 'lucide-react';

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', url: '/' },
  { icon: Map, label: 'Map View', url: '/map' },
  { icon: BarChart3, label: 'Analytics', url: '/analytics' },
  { icon: Package, label: 'Brands', url: '/brands' },
  { icon: TrendingUp, label: 'Trends', url: '/trends' },
];

const settingsItems = [
  { icon: Settings, label: 'Settings', url: '/settings' },
  { icon: HelpCircle, label: 'Help Center', url: '/help' },
];

export function CommandMenu() {
  const { open, setOpen } = useSearch();

  const handleSelect = (url) => {
    setOpen(false);
    // In a real app, you would use your router here
    // For now, we'll just close the menu
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.url}
              onSelect={() => handleSelect(item.url)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          {settingsItems.map((item) => (
            <CommandItem
              key={item.url}
              onSelect={() => handleSelect(item.url)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default CommandMenu;
