import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/layout/BottomNav'

/** Frame for the main tab screens: scrollable content + fixed bottom nav. */
export function TabLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px]">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
