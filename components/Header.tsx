'use client';

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-lg min-w-[300px]">
          <span className="text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Search for something..."
            className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
        <button className="w-10 h-10 border-none bg-gray-100 rounded-lg cursor-pointer text-xl flex items-center justify-center transition-all hover:bg-gray-200 hover:-translate-y-0.5">
          ⚙️
        </button>
        <button className="w-10 h-10 border-none bg-gray-100 rounded-lg cursor-pointer text-xl flex items-center justify-center transition-all hover:bg-gray-200 hover:-translate-y-0.5">
          🔔
        </button>
        <div className="ml-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-base">
            U
          </div>
        </div>
      </div>
    </header>
  );
}

