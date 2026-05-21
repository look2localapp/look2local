"use client";

import { useState, useEffect } from "react";
import { Bell, X, Clock, ShoppingBag, CheckCircle2, AlertTriangle, ShieldCheck, Store } from "lucide-react";

interface Notification {
  id: string;
  type: "expiry" | "order" | "verified" | "offer";
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: "clock" | "bag" | "shield" | "store";
}

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "expiry", title: "Offer Expiring Soon!", body: "Your lock on iPhone 16 Pro at Tech Hub expires in 28 minutes. Visit the shop now!", time: "2 min ago", read: false, icon: "clock" },
  { id: "n2", type: "order", title: "Offer Locked Successfully", body: "L2L-DEMO1 is confirmed. Show this code at Tech Hub Electronics, Banjara Hills.", time: "1 hr ago", read: false, icon: "bag" },
  { id: "n3", type: "verified", title: "Shop Verified! 🎉", body: "Tech Hub Electronics has received the Verified badge on Look2Local.", time: "3 hr ago", read: true, icon: "shield" },
  { id: "n4", type: "offer", title: "New Offer Near You", body: "The Sneaker Drop has a 15% OFF offer on Nike Air Force 1 — 1.2 km away!", time: "Yesterday", read: true, icon: "store" },
];

const ICON_MAP = {
  clock: { comp: Clock, bg: "bg-orange-100", color: "text-orange-600" },
  bag: { comp: ShoppingBag, bg: "bg-blue-100", color: "text-blue-600" },
  shield: { comp: ShieldCheck, bg: "bg-green-100", color: "text-green-600" },
  store: { comp: Store, bg: "bg-purple-100", color: "text-purple-600" },
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [pulse, setPulse] = useState(true);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (pulse) {
      const t = setTimeout(() => setPulse(false), 3000);
      return () => clearTimeout(t);
    }
  }, [pulse]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="relative p-2 text-gray-600 hover:text-blue-600 rounded-xl hover:bg-gray-50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ${pulse ? "animate-ping" : ""}`}>
            {unread}
          </span>
        )}
        {unread > 0 && !pulse && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                  Mark all read
                </button>
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">All caught up!</p>
                </div>
              ) : (
                notifications.map(n => {
                  const { comp: Icon, bg, color } = ICON_MAP[n.icon];
                  return (
                    <div key={n.id}
                      className={`flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!n.read ? "bg-blue-50/50" : ""}`}
                      onClick={() => markRead(n.id)}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-snug">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                        <button onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                          className="p-0.5 hover:bg-gray-200 rounded-md transition-colors">
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 text-center">
                ⚡ Real-time alerts for offers, expirations & more
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
