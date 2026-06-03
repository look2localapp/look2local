"use client";

import { useEffect, useState } from "react";
import { Users, Search, Ticket, Heart, Phone, Mail, MapPin, Calendar } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  profilePhoto?: string;
  createdAt: string;
  _count: { coupons: number; wishlist: number };
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers").then((r) => r.json()).then((d) => { setCustomers(d.customers || []); setLoading(false); });
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || "").includes(search)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Customers</h1>
          <p className="text-gray-400 text-sm">{customers.length} registered customers</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…"
          className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase font-semibold border-b border-gray-800">
                <th className="px-5 py-3.5 text-left">Customer</th>
                <th className="px-5 py-3.5 text-left">Contact</th>
                <th className="px-5 py-3.5 text-left">Location</th>
                <th className="px-5 py-3.5 text-left">Activity</th>
                <th className="px-5 py-3.5 text-left">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{c.name}</p>
                        <p className="text-gray-500 text-xs">{c.id.slice(0, 8)}…</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-300 flex items-center gap-1.5"><Mail className="w-3 h-3" />{c.email}</p>
                    {c.phone && <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1"><Phone className="w-3 h-3" />{c.phone}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-400 flex items-center gap-1.5"><MapPin className="w-3 h-3" />{c.city || "Not set"}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg">
                        <Ticket className="w-3 h-3" /> {c._count.coupons}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-pink-400 bg-pink-500/10 px-2 py-1 rounded-lg">
                        <Heart className="w-3 h-3" /> {c._count.wishlist}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString("en-IN")}</p>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <Users className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No customers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
