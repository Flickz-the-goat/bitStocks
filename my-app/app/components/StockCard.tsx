export default function StockCard({
  stock,
  onClick,
}: {
  stock: any;
  onClick: () => void;
}) {
  const summary = stock.year_summary;

  return (
    <div
      onClick={onClick}
      className="p-4 border rounded-xl shadow hover:shadow-lg cursor-pointer transition"
    >
      <h2 className="font-bold text-lg">{stock.name}</h2>
      <p className="text-sm text-gray-500">{stock.ticker}</p>
        {stock.ownedShares && (
      <p className="text-sm mt-1">
        Shares: {stock.ownedShares}
      </p>
    )}
      {summary ? (
        <div className="mt-2 text-sm">
          <p>Close: ${summary.close_price}</p>
          <p
            className={
              summary.close_price >= summary.open_price
                ? 'text-green-500'
                : 'text-red-500'
            }
          >
            {(
              ((summary.close_price - summary.open_price) /
                summary.open_price) *
              100
            ).toFixed(2)}
            %
          </p>
        </div>
      ) : (
        <p className="text-gray-400 text-sm mt-2">No data yet</p>
      )}
    </div>
  );
}