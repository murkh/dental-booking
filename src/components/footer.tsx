import { Globe, Info, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start justify-between space-y-6 lg:space-y-0">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">
                About The Dental Care Centre
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">0207 639 3323</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">
                  enquiries@dentalcarecentreuk.co.uk
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">
                  The Dental Care Centre Website
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-purple-600" />
                <div className="text-gray-700">
                  <div>195 New Cross Rd</div>
                  <div>New Cross, London</div>
                  <div>SE14 5DG</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="w-full lg:w-80 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm">Google Maps</p>
              <p className="text-xs">New Cross Rd</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <p className="text-center text-gray-600 text-sm">
            Call 020 7639 3323 if you are unable to book online
          </p>
        </div>

        <div className="mt-4 flex justify-center space-x-6">
          <a href="/" className="text-purple-600 hover:text-purple-700 text-sm">
            Terms of Use
          </a>
          <a href="/" className="text-purple-600 hover:text-purple-700 text-sm">
            Privacy Policy
          </a>
          <a href="/" className="text-purple-600 hover:text-purple-700 text-sm">
            Cookies Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
