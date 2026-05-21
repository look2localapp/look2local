import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Store, MapPin, Zap, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#F8F9FA] flex">

      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-gray-900 via-[#1a1a2e] to-gray-900 w-[420px] flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading text-xl font-extrabold text-white">
            Look2<span className="text-orange-400">Local</span>
          </span>
        </Link>
        <h1 className="font-heading text-3xl font-bold text-white mb-3 leading-tight">
          India&apos;s Hyperlocal<br />Marketplace
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Create a free account and discover the best prices from shops near you.
        </p>
        <div className="space-y-4">
          {[
            { icon: MapPin,      text: "Find deals at shops near you" },
            { icon: Zap,         text: "Lock prices before you visit" },
            { icon: ShieldCheck, text: "Shop from GST-verified businesses" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-sm text-gray-300">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Your phone number is collected after sign-up for deal contact only — never for login.
          </p>
        </div>
      </div>

      {/* Right: Clerk form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">

        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-extrabold text-lg text-gray-900">
            Look2<span className="text-orange-500">Local</span>
          </span>
        </Link>

        <SignUp
          routing="path"
          path="/sign-up"
          fallbackRedirectUrl="/"
          signInUrl="/sign-in"
          appearance={{
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "iconButton",
            },
            elements: {
              rootBox: "w-full max-w-md",
              card: "shadow-xl rounded-2xl border border-gray-100 bg-white",
              headerTitle: "font-heading font-extrabold text-gray-900",
              headerSubtitle: "text-gray-500 text-sm",
              formFieldLabel: "text-sm font-semibold text-gray-700",
              formFieldInput:
                "rounded-xl border-gray-200 text-sm focus:border-orange-400",
              formButtonPrimary:
                "bg-orange-500 hover:bg-orange-600 rounded-xl font-bold text-sm",
              footerActionLink: "text-orange-600 font-semibold hover:text-orange-700",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-400 text-xs",
              socialButtonsBlockButton:
                "border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-semibold",
            },
          }}
        />
      </div>
    </div>
  );
}
