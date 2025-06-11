import { MapPin, Home, Briefcase } from "lucide-react";

const LocationsTab = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Home Address</label>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Home className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">123 Main Street, New York, NY 10001</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Work Address</label>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Briefcase className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">456 Business Ave, Manhattan, NY 10002</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Favorite Location</label>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">Central Park, NY</span>
        </div>
      </div>
    </div>
  );
};

export default LocationsTab;
