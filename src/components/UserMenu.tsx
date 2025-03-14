
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
      console.error(error);
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return 'U';
    
    const username = user?.user_metadata?.username;
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    
    return user.email.substring(0, 2).toUpperCase();
  };
  
  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2">
          <User size={16} />
          Sign In
        </Button>
      </Link>
    );
  }
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0"
          aria-label="User menu"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage 
              src={user?.user_metadata?.avatar_url} 
              alt={user?.user_metadata?.username || user.email} 
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm">
              {user?.user_metadata?.username || user.email.split('@')[0]}
            </p>
            <p className="text-xs text-muted-foreground w-full truncate">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/gallery" className="cursor-pointer">
            My Gallery
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
