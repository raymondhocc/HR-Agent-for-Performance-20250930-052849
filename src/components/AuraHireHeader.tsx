import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
export function AuraHireHeader() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/L%27Occitane_en_Provence_logo.svg/2560px-L%27Occitane_en_Provence_logo.svg.png" alt="L'Occitane Logo" className="h-6 object-contain" />
            <div className="w-px h-6 bg-border"></div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Aura<span className="text-[#FFC107]">Hire</span>
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="hover:bg-accent/50 transition-colors"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}