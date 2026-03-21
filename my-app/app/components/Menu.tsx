// export default function Menu() {
//   return (
//     <div className="bg-gray-800 text-white w-48 p-4 flex flex-col space-y-4">
//       <button className="hover:bg-gray-700 px-4 py-2 rounded transition">Home</button>
//       <button className="hover:bg-gray-700 px-4 py-2 rounded transition">Portfolio</button>
//       <button className="hover:bg-gray-700 px-4 py-2 rounded transition">Market</button>
//       <button className="hover:bg-gray-700 px-4 py-2 rounded transition">News</button>
//     </div>
//   );
// }
export default function Menu({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div className="bg-gray-800 text-white w-48 p-4 flex flex-col space-y-4">
      <button onClick={() => setActive("home")} className="hover:bg-gray-700 px-4 py-2 rounded transition">
        Home
      </button>
      <button onClick={() => setActive("portfolio")} className="hover:bg-gray-700 px-4 py-2 rounded transition">
        Portfolio
      </button>
      <button onClick={() => setActive("graphs")} className="hover:bg-gray-700 px-4 py-2 rounded transition">
        Graphs
      </button>
      <button onClick={() => setActive("news")} className="hover:bg-gray-700 px-4 py-2 rounded transition">
        News
      </button>
    </div>
  );
}