import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Settings,
  HelpCircle,
  Upload,
} from 'lucide-react';

export const sidebarData = {
  user: {
    name: 'Admin User',
    email: 'admin@breweries.ng',
    avatar: '',
  },
  teams: [
    {
      name: 'Nigerian Breweries',
      logo: () => (
        <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center text-white text-xs font-bold">
          NB
        </div>
      ),
      plan: 'Sales Dashboard',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
          isActive: true,
        },
        {
          title: 'Brands',
          url: '/brands',
          icon: Package,
        },
        {
          title: 'Trends',
          url: '/trends',
          icon: TrendingUp,
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          title: 'Upload Data',
          url: '/upload',
          icon: Upload,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings/profile',
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help',
          icon: HelpCircle,
        },
      ],
    },
  ],
};

export default sidebarData;
