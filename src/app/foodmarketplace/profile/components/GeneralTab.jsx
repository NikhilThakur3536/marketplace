import { Mail, User, MapPin, Hash, Phone } from "lucide-react";

const GeneralTab = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">Martinwill@gmail.com</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Username</label>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">Marwill</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Country</label>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-3 bg-blue-500 rounded-sm"></div>
            <span className="text-gray-600">USA</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Phone number</label>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Phone className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">+1 123 456 7890</span>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
