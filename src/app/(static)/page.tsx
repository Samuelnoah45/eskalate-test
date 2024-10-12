'use client';
import dynamic from 'next/dynamic';

const WhyHireFromUs = dynamic(
    () => import('../../components/static/Landing/WhyHireFromUs'),
    {
        ssr: false
    }
);
import { Stack } from '@mantine/core';
import Hero from '@/components/static/Landing/Hero';
import WhyWeAreBest from '@/components/static/Landing/WhyWeAreBest';
import HireProcess from '@/components/static/Landing/HireProcess';
import WhatWeProvide from '@/components/static/Landing/WhatWeProvide';
import OurDevelopers from '@/components/static/Landing/OurDevelopers';
import CTA from '@/components/static/Landing/CTA';
import Join from '@/components/static/Landing/Join';
import Testimonials from '@/components/static/Landing/Testimonials';
import TalkWithUs from '@/components/static/Landing/TalkWithUs';
import OurPartners from '@/components/static/Landing/OurPartners';
import Hero1 from '@/components/static/Landing/Hero/file';
import ConnectWithTalent from '@/components/static/Landing/ConnectWithTalent';
import WhatweProvide from '@/components/static/Landing/WhatWeprovides';
import EskalateBest from '@/components/static/Landing/EskalateBest';
import TalkWithUs2 from '@/components/static/Landing/TalkWithUs/indexx';

export default function Home() {
    return (
        <Stack
            style={{
                overflow: 'hidden'
            }}
        >
            <Hero />
            <ConnectWithTalent />
            <EskalateBest />
            <WhatweProvide />
            <WhyHireFromUs />
            <HireProcess />
            <OurDevelopers />
            <Testimonials />
            <TalkWithUs />
        </Stack>
    );
}
