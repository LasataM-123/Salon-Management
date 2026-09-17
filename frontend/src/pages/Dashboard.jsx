import { useEffect, useState } from "react";
import api from "../services/api";
import { StatCard } from "../components/StatCard";

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const response = await api.get("/dashboard/");
            setData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl">
                <div className="p-8 text-center text-gray-500">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Revenue",
            value: `NPR ${data?.revenue?.toLocaleString() ?? 0}`,
            textColor: "text-emerald-600",
        },
        {
            title: "Total Appointments",
            value: data?.total_appointments ?? 0,
        },
        {
            title: "Pending Appointments",
            value: data?.pending_appointments ?? 0,
            textColor: "text-amber-500",
        },
        {
            title: "Confirmed Appointments",
            value: data?.confirmed_appointments ?? 0,
            textColor: "text-blue-600",
        },
        {
            title: "Completed Appointments",
            value: data?.completed_appointments ?? 0,
            textColor: "text-emerald-500",
        },
        {
            title: "Cancelled Appointments",
            value: data?.cancelled_appointments ?? 0,
            textColor: "text-rose-500",
        },
    ];

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Overview of your salon</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;