export default function OtherPanel() {
  return (
    <div className="w-64 p-4 flex flex-col gap-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
      {/* Container 1 */}
      <div className="rounded-xl p-4 shadow-md flex items-center justify-center" style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-primary)' }}>
        Placeholder 1
      </div>

      {/* Container 2 */}
      <div className="rounded-xl p-4 shadow-md flex items-center justify-center" style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-primary)' }}>
        Placeholder 2
      </div>

      {/* Container 3 */}
      <div className="rounded-xl p-4 shadow-md flex items-center justify-center" style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-primary)' }}>
        Placeholder 3
      </div>
    </div>
  );
}