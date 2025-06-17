import Cards from "./components/Card";
import Header from "./components/Header";
import ItemTabs from "./components/ItemTabs";
import SearchBar from "./components/SearchBar";

export default function TestUI() {
  return (
    <div className="w-full min-h-screen flex justify-center bg-blue-50">
      <div className="max-w-md w-full flex flex-col gap-6 p-2">
        <Header />
        <div className="flex flex-col gap-2 mt-2">
          <h1 className="text-4xl font-bold">Let's Eat</h1>
          <h1 className="text-4xl font-bold">Sleep & Repeat</h1>
        </div>
        <div className="px-1 flex justify-center w-full">
          <SearchBar />
        </div>
        <h2 className="text-2xl font-bold ml-2 mt-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">Poppular Items</h2>
        <ItemTabs />
        <Cards />
      </div>
    </div>
  )
}
