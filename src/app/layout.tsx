import type { Metadata } from 'next';
import '@/styles/globals.scss';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'PriceHunt — 스마트 가격 비교',
  description: '네이버 쇼핑 연동 실시간 가격 비교 서비스',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
