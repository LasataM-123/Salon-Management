import { useEffect, useState } from "react";
import api from "../services/api";

function Services() {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration: "",
    });
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        try {
            const response = await api.get("/services/");
            setServices(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Service name is required.";
        }

        if (!formData.price) {
            newErrors.price = "Price is required.";
        } else if (Number(formData.price) <= 0) {
            newErrors.price = "Price must be greater than zero.";
        }

        if (!formData.duration) {
            newErrors.duration = "Duration is required.";
        } else if (Number(formData.duration) <= 0) {
            newErrors.duration = "Duration must be greater than zero.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            if (editingId) {
                const response = await api.put(
                    `/services/${editingId}/`,
                    formData
                );

                setServices(
                    services.map((service) =>
                        service.id === editingId ? response.data : service
                    )
                );
            } else {
                const response = await api.post("/services/", formData);
                setServices([...services, response.data]);
            }

            setFormData({
                name: "",
                price: "",
                duration: "",
            });
            setErrors({});
            setEditingId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (service) => {
        setEditingId(service.id);
        setFormData({
            name: service.name,
            price: service.price,
            duration: service.duration,
        });
        setErrors({});
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this service?")) {
            return;
        }
        try {
            await api.delete(`/services/${id}/`);
            setServices(services.filter((service) => service.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({
            name: "",
            price: "",
            duration: "",
        });
        setErrors({});
    };

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                <p className="text-sm text-gray-500">
                    Manage salon services
                </p>
            </div>

            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    {editingId ? "Edit Service" : "Add Service"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-4 md:grid-cols-4"
                >
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Service name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-4 py-2.5 outline-none ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-gray-900"
                            }`}
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            className={`w-full rounded-lg border px-4 py-2.5 outline-none ${
                                errors.price
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-gray-900"
                            }`}
                        />

                        {errors.price && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="number"
                            name="duration"
                            placeholder="Duration (minutes)"
                            value={formData.duration}
                            onChange={handleChange}
                            min="1"
                            className={`w-full rounded-lg border px-4 py-2.5 outline-none ${
                                errors.duration
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-gray-900"
                            }`}
                        />

                        {errors.duration && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.duration}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-white hover:bg-gray-800"
                        >
                            {editingId ? "Update" : "Add"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="rounded-lg border border-gray-300 px-4 py-2.5"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">
                        Loading...
                    </div>
                ) : services.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No services found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-6 py-4 text-left">
                                        Service
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        Price
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        Duration
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {services.map((service) => (
                                    <tr
                                        key={service.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-6 py-4">
                                            {service.name}
                                        </td>

                                        <td className="px-6 py-4">
                                            NPR {service.price}
                                        </td>

                                        <td className="px-6 py-4">
                                            {service.duration} min
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(service)
                                                    }
                                                    className="rounded-lg border px-3 py-1.5 text-sm"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            service.id
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Services;