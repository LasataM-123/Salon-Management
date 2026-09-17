import { useEffect, useState } from "react";
import api from "../services/api";

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            setLoading(true);

            const response = await api.get("/appointments/");

            setAppointments(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const response = await api.patch(
                `/appointments/${id}/status/`,
                { status }
            );

            setAppointments(
                appointments.map((appointment) =>
                    appointment.id === id
                        ? response.data
                        : appointment
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.detail ||
                    "Unable to update appointment status."
            );
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this appointment?")) {
            return;
        }

        try {
            await api.delete(`/appointments/${id}/`);

            setAppointments(
                appointments.filter(
                    (appointment) => appointment.id !== id
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const filteredAppointments =
        filter === "All"
            ? appointments
            : appointments.filter(
                  (appointment) => appointment.status === filter
              );

    const filters = [
        "All",
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
    ];

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Appointments
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage salon appointments
                </p>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-sm">
                {filters.map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${
                            filter === status
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading appointments...
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No appointments found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Service
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Time
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredAppointments.map(
                                    (appointment) => (
                                        <tr
                                            key={appointment.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {
                                                            appointment.customer_name
                                                        }
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {
                                                            appointment.customer_phone
                                                        }
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {
                                                    appointment.service_name
                                                }
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {appointment.date}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {appointment.time.slice(
                                                    0,
                                                    5
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        appointment.status ===
                                                        "Pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : appointment.status ===
                                                                "Confirmed"
                                                              ? "bg-blue-100 text-blue-700"
                                                              : appointment.status ===
                                                                  "Completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {
                                                        appointment.status
                                                    }
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {appointment.status ===
                                                        "Pending" && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        appointment.id,
                                                                        "Confirmed"
                                                                    )
                                                                }
                                                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                                                            >
                                                                Confirm
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        appointment.id,
                                                                        "Cancelled"
                                                                    )
                                                                }
                                                                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}

                                                    {appointment.status ===
                                                        "Confirmed" && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        appointment.id,
                                                                        "Completed"
                                                                    )
                                                                }
                                                                className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                                                            >
                                                                Complete
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        appointment.id,
                                                                        "Cancelled"
                                                                    )
                                                                }
                                                                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                appointment.id
                                                            )
                                                        }
                                                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Appointments;