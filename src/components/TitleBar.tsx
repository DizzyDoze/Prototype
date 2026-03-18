import { Link, useLocation} from 'react-router'


// The navigation bar on top of the page
async function TitleBar() {
  // current pathname get from the router: where we jumped from
  const { pathname } = useLocation();       

  const tabs = [
    { label: "System Design", path: "/system-design" },
    { label: "Algorithms", path: "/algorithms" },
  ]

  return (
    <header className="border-b border-zinc-800 px-6 py-3 flex items-center gap-8">
      <span className="text-cyan-400 font-bold tracking-wider text-sm uppercase">Prototype</span>
      {/* <nav className="flex gap-1">
        {[
          { label: "System Design", path: "/system-design" },
          { label: "Algorithms", path: "/algorithms" },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-1.5 text-sm rounded transition-colors ${
              pathname.startsWith(item.path)
                ? "bg-cyan-400/15 text-cyan-400"
                : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav> */}
    </header>
  );
}

export default TitleBar;