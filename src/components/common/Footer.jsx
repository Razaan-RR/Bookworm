export default function Footer() {
  return (
    <footer className="w-full bg-(--primary) text-(--bg) py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-center md:text-left">

        <div>
          <h2 className="font-bold text-lg mb-2">📚 BookWorm</h2>
          <p className="text-(--accent)">
            Your cozy digital library to track reading and discover books.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li className="hover:text-(--accent) cursor-pointer">Browse Books</li>
            <li className="hover:text-(--accent) cursor-pointer">My Library</li>
            <li className="hover:text-(--accent) cursor-pointer">Tutorials</li>
            <li className="hover:text-(--accent) cursor-pointer">Dashboard</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2">Connect</h3>
          <p className="text-(--accent) mb-2">Follow us for book updates</p>
          <div className="flex justify-center md:justify-start gap-4 text-xl">
            <span className="cursor-pointer hover:text-(--accent)">📘</span>
            <span className="cursor-pointer hover:text-(--accent)">🐦</span>
            <span className="cursor-pointer hover:text-(--accent)">📸</span>
          </div>
        </div>

      </div>

      <div className="text-center text-xs mt-8 text-(--accent)">
        © {new Date().getFullYear()} BookWorm · Built for passionate readers
      </div>
    </footer>
  );
}
