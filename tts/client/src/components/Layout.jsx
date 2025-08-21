import { Outlet, NavLink } from 'react-router-dom'
import { FiMic, FiClock, FiSettings } from 'react-icons/fi'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <FiMic className="w-8 h-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">TTS App</span>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  Convert
                </NavLink>
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-1">
                    <FiClock className="w-4 h-4" />
                    <span>History</span>
                  </div>
                </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <FiSettings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout