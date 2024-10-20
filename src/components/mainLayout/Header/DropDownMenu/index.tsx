import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { unsetUser } from '@/lib/redux/slices/loginSlice';
import { Menu, Button, Text, rem } from '@mantine/core';
import {
    IconBriefcase,
    IconLock,
    IconLogout2,
    IconUserCircle
} from '@tabler/icons-react';
import {
    IconSettings,
    IconSearch,
    IconPhoto,
    IconMessageCircle,
    IconTrash,
    IconArrowsLeftRight
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DropDownMenu() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const loginState = useAppSelector((state: any) => state.login);
    const handleLogout = () => {
        dispatch(unsetUser());
        router.push('/');
    };

    return (
        <Menu.Dropdown>
            <Link
                href={`/developer/${loginState?.developerId}`}
                style={{ textDecoration: 'none', color: 'black' }}
            >
                <Menu.Item
                    leftSection={
                        <IconUserCircle style={{ width: 16, height: 16 }} />
                    }
                >
                    Profile
                </Menu.Item>
            </Link>
            {/*<Menu.Item
                onClick={() => router.push('jobs')}
                leftSection={
                    <IconBriefcase
                        style={{ width: rem(14), height: rem(14) }}
                    />
                }
            >
                Jobs
            </Menu.Item>*/}
            <Link
                href="/developer/settings"
                style={{ textDecoration: 'none', color: 'black' }}
            >
                <Menu.Item
                    leftSection={<IconLock style={{ width: 16, height: 16 }} />}
                >
                    Change Password
                </Menu.Item>
            </Link>
            <Menu.Item
                onClick={handleLogout}
                leftSection={<IconLogout2 style={{ width: 16, height: 16 }} />}
            >
                Logout
            </Menu.Item>
        </Menu.Dropdown>
    );
}
