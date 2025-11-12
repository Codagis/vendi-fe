import { Button } from './button';
import { Menu } from 'lucide-react';

interface MenuButtonProps {
  onToggleSidebar?: () => void;
  className?: string;
}

export function MenuButton({ onToggleSidebar, className = "" }: MenuButtonProps) {
  if (!onToggleSidebar) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggleSidebar}
      className={`h-10 w-10 hover:bg-gray-100 transition-all duration-200 hover:scale-105 ${className}`}
    >
      <Menu className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
    </Button>
  );
}

