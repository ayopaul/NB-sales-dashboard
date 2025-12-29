import { Header } from '@/components/layout/Header';
import { Main } from '@/components/layout/Main';
import { Search } from '@/components/layout/Search';
import { ThemeSwitch } from '@/components/layout/ThemeSwitch';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function AppearanceSettings() {
  const { isDark, setIsDark } = useTheme();

  const themes = [
    {
      id: 'light',
      name: 'Light',
      description: 'Light mode for better visibility in bright environments',
      icon: Sun,
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Dark mode for reduced eye strain in low-light environments',
      icon: Moon,
    },
  ];

  const handleThemeChange = (value) => {
    setIsDark(value === 'dark');
  };

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Appearance</h2>
          <p className="text-muted-foreground">
            Customize how the dashboard looks and feels
          </p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Theme</CardTitle>
              <CardDescription>Select your preferred color theme</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={isDark ? 'dark' : 'light'}
                onValueChange={handleThemeChange}
                className="grid grid-cols-2 gap-4"
              >
                {themes.map((theme) => {
                  const Icon = theme.icon;
                  const isSelected = (theme.id === 'dark') === isDark;

                  return (
                    <Label
                      key={theme.id}
                      htmlFor={theme.id}
                      className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value={theme.id} id={theme.id} className="sr-only" />
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          theme.id === 'light'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-slate-800 text-slate-200'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{theme.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
              <CardDescription>See how your theme looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    NB
                  </div>
                  <div>
                    <p className="font-medium">Nigerian Breweries</p>
                    <p className="text-sm text-muted-foreground">Sales Dashboard</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-8 rounded bg-primary" />
                  <div className="h-8 rounded bg-secondary" />
                  <div className="h-8 rounded bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 rounded bg-muted w-full" />
                  <div className="h-2 rounded bg-muted w-3/4" />
                  <div className="h-2 rounded bg-muted w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
