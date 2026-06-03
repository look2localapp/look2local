"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Store, Users, Ticket, CreditCard,
  Crown, Settings, LogOut, ShieldCheck, TrendingUp,
  Menu, X
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Store, label: "Shops", href: "/admin/shops" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Ticket, label: "Coupons", href: "/admin/coupons" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: Crown, label: "Subscriptions", href: "/admin/subscriptions" },
  { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    // Check admin status
    fetch("/api/admin/stats")
      .then((r) => {
        if (r.status === 403) { router.push("/"); return; }
        setIsAdmin(true);
        setChecking(false);
      })
      .catch(() => { router.push("/"); });
  }, [isSignedIn, router]);

  if (checking) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-3 animate-pulse" />
        <p className="text-blue-300 text-sm">Verifying admin access…</p>
      </div>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-sm">L2L Admin</p>
              <p className="text-[11px] text-gray-400">{user?.emailAddresses?.[0]?.emailAddress}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ icon: Icon, label, href }) => (
            <Link key={href} href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === href
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-1">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <button onClick={() => router.push("/")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" /> Back to App
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-gray-400">
              {NAV.find((n) => n.href === pathname)?.label || "Admin Panel"}
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-xl">
              <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                System Online
              </span>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
