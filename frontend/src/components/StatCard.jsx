export function StatCard({ title, value, textColor = "text-gray-900" }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`mt-2 text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
    );
}