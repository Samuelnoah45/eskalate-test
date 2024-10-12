import {
    ActionIcon,
    AppShell,
    Button,
    Divider,
    Group,
    Menu,
    MenuItem,
    Stack,
    Text
} from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from './MainHeader.module.css';
import { IconMenuDeep } from '@tabler/icons-react';
import { FaAngleDown } from 'react-icons/fa6';

export default function MainHeader() {
    const pathname = usePathname();
    const currentActive =
        pathname === '/'
            ? 'Home'
            : pathname === '/talent'
              ? 'Discover Talent'
              : pathname === '/about'
                ? 'About us'
                : 'FAQs';

    const handleClick = () => {
        // scroll to our developers section
        const element = document.getElementById('#focus');
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth'
            });
        }
    };
    return (
        <AppShell.Header withBorder={false} className={classes.header}>
            <Group
                h="100%"
                justify="space-between"
                align="center"
                px={{ base: 15, md: 65, lg: 96 }}
            >
                <Link href="/">
                    <Image
                        src={'images/logos/Logo.svg'}
                        width={132}
                        height={50}
                        alt="logo"
                    />
                </Link>
                <Group gap={'xl'} visibleFrom="lg">
                    <Link href={'/'} className={classes.header_links}>
                        <Text
                            size="base"
                            style={
                                currentActive === 'Home'
                                    ? {
                                          color: 'var(--mantine-primary-color-filled)',
                                          borderBottom:
                                              '3px solid var(--mantine-color-blue-5)'
                                      }
                                    : {
                                          paddingBottom: '3px'
                                      }
                            }
                            fw={500}
                            className={classes.header_links}
                        >
                            Home
                        </Text>
                    </Link>

                    <Link href={'/talent'} className={classes.header_links}>
                        <Text
                            size="base"
                            style={
                                currentActive === 'Discover Talent'
                                    ? {
                                          color: 'var(--mantine-primary-color-filled)',
                                          borderBottom:
                                              '3px solid var(--mantine-color-blue-5)'
                                      }
                                    : {
                                          paddingBottom: '3px'
                                      }
                            }
                            fw={500}
                        >
                            Discover Talent
                        </Text>
                    </Link>

                    <Link href={'/about'} className={classes.header_links}>
                        <Text
                            size="base"
                            style={
                                currentActive === 'About us'
                                    ? {
                                          color: 'var(--mantine-primary-color-filled)',
                                          borderBottom:
                                              '3px solid var(--mantine-color-blue-5)'
                                      }
                                    : {
                                          paddingBottom: '3px'
                                      }
                            }
                            fw={500}
                        >
                            About Us
                        </Text>
                    </Link>
                    {/* <Link href={'/faqs'} className={classes.header_links}>
                       <Text
                           size="base"
                           style={
                               currentActive === 'FAQs'
                                   ? {
                                         color: 'var(--mantine-primary-color-filled)',
                                         borderBottom:
                                             '3px solid var(--mantine-color-blue-5)'
                                     }
                                   : {
                                         paddingBottom: '3px'
                                     }
                           }
                           fw={500}
                       >
                           FAQs
                       </Text>
                   </Link> */}
                </Group>
                <Group gap="30px" visibleFrom="lg">
                    <Button
                        style={{ fontWeight: 400 }}
                        component={Link}
                        href={'/hire'}
                    >
                        Hire Top Talent
                    </Button>
                    <Button variant="outline" component={Link} href={'signin'}>
                        Talent Login
                    </Button>
                </Group>

                <Group hiddenFrom="lg">
                    <Menu shadow="md" width={'100%'}>
                        <Menu.Target>
                            <ActionIcon variant="subtle">
                                <IconMenuDeep size={24} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown hiddenFrom="lg">
                            <Link href={'/'} className={classes.header_links}>
                                <Menu.Item>
                                    <Text
                                        style={
                                            currentActive === 'Home'
                                                ? {
                                                      color: 'var(--mantine-primary-color-filled)'
                                                  }
                                                : {}
                                        }
                                        fw={500}
                                        className={classes.header_links}
                                    >
                                        Home
                                    </Text>
                                </Menu.Item>
                            </Link>
                            <Link
                                href={'/talent'}
                                className={classes.header_links}
                            >
                                <Menu.Item>
                                    <Text
                                        style={
                                            currentActive === 'Discover Talent'
                                                ? {
                                                      color: 'var(--mantine-primary-color-filled)'
                                                  }
                                                : {}
                                        }
                                        fw={500}
                                        className={classes.header_links}
                                    >
                                        Discover Talent
                                    </Text>
                                </Menu.Item>
                            </Link>
                            <Link
                                href={'/about'}
                                className={classes.header_links}
                            >
                                <Menu.Item>
                                    <Text
                                        className={classes.header_links}
                                        style={
                                            currentActive === 'About us'
                                                ? {
                                                      color: 'var(--mantine-primary-color-filled)'
                                                  }
                                                : {}
                                        }
                                        fw={500}
                                    >
                                        About us
                                    </Text>
                                </Menu.Item>
                            </Link>
                            <Divider />
                            <Menu.Item mt={16}>
                                <Button
                                    style={{ fontWeight: 400 }}
                                    w={'100%'}
                                    component={Link}
                                    href={'/hire'}
                                >
                                    Hire Top Talent
                                </Button>
                            </Menu.Item>
                            <Menu.Item>
                                <Button
                                    variant="outline"
                                    component={Link}
                                    href={'signin'}
                                    w={'100%'}
                                >
                                    Login
                                </Button>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Group>
        </AppShell.Header>
    );
}

/**

<Menu
                        trigger="click-hover"
                        openDelay={100}
                        closeDelay={400}
                    >
                        <Menu.Target>
                            <Text
                                size="base"
                                style={{
                                    paddingBottom: '3px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                                fw={500}
                                className={classes.header_links}
                            >
                                <span>What we Provide</span> <FaAngleDown />
                            </Text>
                        </Menu.Target>

                        <Menu.Dropdown miw={190}>
                            <Menu.Item>
                                <Link
                                    href={'/engineering'}
                                    className={classes.header_links}
                                >
                                    <Text
                                        size="base"
                                        style={{
                                            paddingBottom: '3px'
                                        }}
                                        fw={400}
                                        className={classes.header_links}
                                    >
                                        Frontend Developers
                                    </Text>
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link
                                    href={'/engineering'}
                                    className={classes.header_links}
                                >
                                    <Text
                                        size="base"
                                        style={{
                                            paddingBottom: '3px'
                                        }}
                                        fw={400}
                                        className={classes.header_links}
                                    >
                                        Backend Developers
                                    </Text>
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link
                                    href={'/engineering'}
                                    className={classes.header_links}
                                >
                                    <Text
                                        size="base"
                                        style={{
                                            paddingBottom: '3px'
                                        }}
                                        fw={400}
                                        className={classes.header_links}
                                    >
                                        Fullstack Developers
                                    </Text>
                                </Link>
                            </Menu.Item>

                            </Menu.Dropdown>
                            </Menu>

 */
