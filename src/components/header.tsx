import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

interface HeaderProps {
  currentStep: number
}

export function Header({ currentStep }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">Dental Care</h1>
              <p className="text-sm text-gray-600 -mt-1">CENTRE</p>
            </div>
          </div>

          {/* Page Title */}
          <div className="text-center">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
              Book with The Dental Care Centre
            </h2>
            <div className="flex items-center justify-center space-x-4 lg:space-x-8 mt-2">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold ${
                  currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <span className={`text-xs lg:text-sm font-medium ${
                  currentStep >= 1 ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  <span className="hidden sm:inline">Appointment & Time</span>
                  <span className="sm:hidden">Appointment</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold ${
                  currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`text-xs lg:text-sm font-medium ${
                  currentStep >= 2 ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  <span className="hidden sm:inline">Personal Details</span>
                  <span className="sm:hidden">Personal</span>
                </span>
              </div>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700 text-xs lg:text-sm">
              <span className="hidden sm:inline">ABOUT US</span>
              <span className="sm:hidden">ABOUT</span>
            </Button>
            <Button variant="purple" className="flex items-center space-x-2 text-xs lg:text-sm">
              <Phone className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">0207 639 3323</span>
              <span className="sm:hidden">0207 639 3323</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
