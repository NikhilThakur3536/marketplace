import Cards from "./components/Card";
import Header from "./components/Header";
import ItemTabs from "./components/ItemTabs";
import SearchBar from "./components/SearchBar";

export default function TestUI () {
    return (
        <div className="w-screen flex justify-center">
            <div className="max-w-md w-full flex flex-col gap-6 p-2">
                <Header/>
                <div className="flex flex-col gap-2 mt-2">
                    <h1 className="text-4xl font-bold">Let's Eat</h1>
                    <h1 className="text-4xl font-bold">Sleep & Repeat</h1>
                </div>    
                <div className="px-1 flex justify-center w-full">
                    <SearchBar/>
                </div>
                <ItemTabs/>
                <Cards/>    
            </div>
        </div>
    )
}