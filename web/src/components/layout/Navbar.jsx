import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Leaf, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-agro-green rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-agro-dark text-lg">AgroLens</span>
              <span className="text-[10px] text-agro-green font-semibold tracking-wider uppercase">AI Platform</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-gray-600 hover:text-agro-green font-medium text-sm transition-colors">Fitur</a>
            <a href="#cara-kerja" className="text-gray-600 hover:text-agro-green font-medium text-sm transition-colors">Cara Kerja</a>
            <a href="#statistik" className="text-gray-600 hover:text-agro-green font-medium text-sm transition-colors">Dampak</a>
            <a href="#tim" className="text-gray-600 hover:text-agro-green font-medium text-sm transition-colors">Tim</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-agro-dark hover:text-agro-green transition-colors px-4 py-2"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-agro-green hover:bg-agro-teal text-white px-5 py-2 rounded-lg transition-colors"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <a href="#fitur"      className="text-gray-700 font-medium text-sm" onClick={() => setIsOpen(false)}>Fitur</a>
          <a href="#cara-kerja" className="text-gray-700 font-medium text-sm" onClick={() => setIsOpen(false)}>Cara Kerja</a>
          <a href="#statistik"  className="text-gray-700 font-medium text-sm" onClick={() => setIsOpen(false)}>Dampak</a>
          <a href="#tim"        className="text-gray-700 font-medium text-sm" onClick={() => setIsOpen(false)}>Tim</a>
          <hr />
          <Link to="/login"    className="text-sm font-semibold text-agro-dark text-center py-2 border border-gray-200 rounded-lg">Masuk</Link>
          <Link to="/register" className="text-sm font-semibold bg-agro-green text-white text-center py-2 rounded-lg">Daftar Gratis</Link>
        </div>
      )}
    </nav>
  )
}