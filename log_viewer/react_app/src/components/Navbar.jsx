import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-3xl from-neutral-500 font-normal tracking-wide text-gray-400"
          >
            LOG VIEWER
          </Link>
          <div className="space-x-4 hidden sm:flex">
            <Link to="/" className="hover:text-indigo-300 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
