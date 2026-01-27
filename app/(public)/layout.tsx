export const dynamic = 'force-dynamic';

import BottomNav from '@/components/BottomNav';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-16">
      {children}
      <BottomNav />
    </div>
  );
}