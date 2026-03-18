import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";

const tabs = [
  { label: "System Design", path: "/system-design" },
  { label: "Algorithms", path: "/algorithms" },
];

export default function TitleBar() {
  const { pathname } = useLocation();

  return (
    <header className="border-b border-zinc-800 px-6 py-3 flex items-center gap-4">
      <span className="text-cyan-400 font-bold text-xl">PROTOTYPE</span>
        {/* Navigation */}
        {tabs.map((tab) => (
          <Button key={tab.path} variant="ghost" size="sm" 
            className={
              pathname.startsWith(tab.path)
                ? "bg-cyan-400/15 hover:bg-cyan-400/20"                          
                : "hover:bg-zinc-800 hover:text-zinc-200" 
            }>
            <Link
              to={tab.path}
              className={
                pathname.startsWith(tab.path)
                  ? "text-cyan-400"
                  : "text-zinc-500"
              }
            >
              {tab.label}
            </Link>
          </Button>
        ))}
    </header>
  );
}
