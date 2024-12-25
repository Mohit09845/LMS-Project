import { Menu, School } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage, } from "./ui/avatar"
import DarkMode from '../DarkMode';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './ui/sheet';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const user = true;

    return (
        <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-20'>
            <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full'>
                <div className='flex gap-2 items-center'>
                    <School size={'30'} />
                    <h1 className='hidden md:block font-extrabold text-2xl'>E-Learning</h1>
                </div>
                <div className='flex items-center gap-6'>
                    {
                        user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem><Link to='my-learning'>My Learning</Link></DropdownMenuItem>
                                        <DropdownMenuItem><Link to='profile'>Edit Profile</Link></DropdownMenuItem>
                                        <DropdownMenuItem>Log out</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <Button variant='outline'>Login</Button>
                                <Button>Signup</Button>
                            </div>
                        )
                    }
                    <DarkMode />
                </div>
            </div>
            <div className='flex md:hidden items-center justify-between px-4 h-full'>
                <h1 className='font-extrabold text-2xl'>E-Learning</h1>
                <MobileNavbar />
            </div>
        </div>
    )
}

export default Navbar


const MobileNavbar = () => {
    const role = 'instructor';
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' className='rounded-full bg-gray-200 hover:bg-gray-200' variant="outline">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className='flex flex-col'>
                <SheetHeader className='flex flex-row items-center justify-between mt-2'>
                    <SheetTitle>E Learning</SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <Separator className='mr-2' />
                <nav className='flex flex-col space-y-4'>
                    <span>My Learning</span>
                    <span>Edit Profile</span>
                    <span>Log out</span>
                </nav>
                {
                    role === 'instructor' && (
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit">DashBoard</Button>
                            </SheetClose>
                        </SheetFooter>
                    )
                }
            </SheetContent>
        </Sheet>
    )
}