import Link from 'next/link';
import { ArrowRightIcon, BookOpenIcon, MagnifyingGlassIcon, BoltIcon } from '@heroicons/react/24/outline';
import { NoteCard } from '@/components/notes/NoteCard';
import { SearchBar } from '@/components/search/SearchBar';
import { AdSlot } from '@/components/ads/AdSlot';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpenIcon className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">NotesHub</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/notes" className="text-gray-700 hover:text-primary-600 font-medium">
                Browse Notes
              </Link>
              <Link href="/upload" className="text-gray-700 hover:text-primary-600 font-medium">
                Upload
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium">
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium">
                Login
              </Link>
              <Link href="/auth/signup" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Share and Discover
            <span className="text-primary-600 block">Study Notes</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access thousands of study notes across subjects, read with AI assistance, 
            and collaborate with students worldwide. Transform your learning experience today.
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar placeholder="Search for notes by subject, topic, or keyword..." />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/notes" className="btn btn-primary text-lg px-8 py-3">
              Browse Notes
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/auth/signup" className="btn btn-secondary text-lg px-8 py-3">
              Start Sharing
            </Link>
          </div>
        </div>

        {/* Ad Slot - Hero */}
        <div className="mt-16 max-w-4xl mx-auto">
          <AdSlot name="homepage-hero" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose NotesHub?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for collaborative learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Vast Library
              </h3>
              <p className="text-gray-600">
                Access thousands of notes across all subjects and academic levels
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Learning
              </h3>
              <p className="text-gray-600">
                Ask questions about any note and get instant, contextual answers
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Search
              </h3>
              <p className="text-gray-600">
                Find exactly what you need with powerful search and filtering
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Notes Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Popular Notes
              </h2>
              <p className="text-gray-600">
                Most viewed and downloaded study materials
              </p>
            </div>
            
            <Link href="/notes" className="btn btn-secondary">
              View All Notes
            </Link>
          </div>

          {/* Note Cards Grid - This would be populated with actual data */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards - replace with actual data */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Sample Note Title {i}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Computer Science • CS101
                    </p>
                    <p className="text-sm text-gray-500">
                      Introduction to programming concepts and algorithms...
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>1.2k views</span>
                  <span>3 days ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students sharing knowledge and learning together
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-3">
              Get Started Free
            </Link>
            <Link href="/notes" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3">
              Explore Notes
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpenIcon className="h-6 w-6" />
                <span className="text-lg font-bold">NotesHub</span>
              </div>
              <p className="text-gray-400">
                Share knowledge, learn together, and ace your studies with AI-powered assistance.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/notes" className="hover:text-white">Browse Notes</Link></li>
                <li><Link href="/upload" className="hover:text-white">Upload Notes</Link></li>
                <li><Link href="/subjects" className="hover:text-white">Subjects</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/dmca" className="hover:text-white">DMCA</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2023 NotesHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}