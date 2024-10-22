import SignInLayout from '@/components/Auth/SignInLayout';
import { userLoggedIn } from '@/utils/authUtil';
import { redirect } from 'next/navigation';

export default function Layout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = userLoggedIn();
    if (user) {
        const developerId = JSON.parse(user.value).developerId;
        redirect('/developer/' + developerId);
    }

    return <SignInLayout>{children}</SignInLayout>;
}
