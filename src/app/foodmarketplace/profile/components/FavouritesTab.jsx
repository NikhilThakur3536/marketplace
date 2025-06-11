import { Heart, Star, Bookmark, Music } from "lucide-react";

const FavoritesTab = () => {
  const favorites = [
    {
      type: "Music",
      title: "Favorite Playlist",
      description: "Chill Vibes - 127 songs",
      icon: Music,
      color: "text-purple-500"
    },
    {
      type: "Restaurant",
      title: "Tony's Pizza",
      description: "Italian • 4.8 stars • $$$",
      icon: Star,
      color: "text-yellow-500"
    },
    {
      type: "Article",
      title: "Web Development Tips",
      description: "Saved for later reading",
      icon: Bookmark,
      color: "text-blue-500"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Your Favorites</h3>
        <Heart className="w-5 h-5 text-red-400" />
      </div>

      {favorites.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon className={`w-5 h-5 mt-0.5 ${item.color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.title}</span>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="text-center pt-2">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Favorites
        </button>
      </div>
    </div>
  );
};

export default FavoritesTab;
