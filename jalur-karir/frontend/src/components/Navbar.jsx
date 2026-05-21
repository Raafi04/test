export default function Navbar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/60 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="text-xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text">
          JalurKarir.id
        </div>
        <div className="flex items-center gap-3 text-sm">
          {user?.name ? (
            <span className="rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1 text-slate-200">
              {user.name}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-700/60 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  )
}
