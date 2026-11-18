'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { ThemeToggle } from '@/shared/components/layout/ThemeToggle';
import Link from 'next/link';
import { LogOut, Settings, HardDrive, Key } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const NavbarUserProfile = () => {
  const { userCreds, clearSession } = useAuth();

  const accessKey = userCreds?.accessKeyId || '';
  const bucketName = userCreds?.bucketName || 'S3 Bucket';
  const region = userCreds?.region || 'AWS';

  const maskedKey = accessKey.length > 8 ? `${accessKey.slice(0, 4)}...${accessKey.slice(-4)}` : accessKey;

  return (
    <div className="hover:cursor-pointer flex items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-sm">
            <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
              S3
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-60 bg-secondary border-border" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none flex items-center gap-1.5 text-foreground truncate">
                <HardDrive className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                {bucketName}
              </p>
              <p className="text-xs font-mono leading-none text-muted-foreground flex items-center gap-1">
                <Key className="w-3 h-3 shrink-0" />
                {maskedKey || 'Connected'} ({region})
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="focus:bg-accent p-0">
            <div className="flex justify-center w-full py-1">
              <ThemeToggle />
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <Link href="/dashboard/settings" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Bucket Settings
            </DropdownMenuItem>
          </Link>

          <Link href="/" onClick={() => clearSession()} passHref>
            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect S3
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavbarUserProfile;
