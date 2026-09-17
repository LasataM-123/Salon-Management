import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function BookAppointment() {
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_phone: "",
        service: "",
        date: "",
        time: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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

        if (!formData.customer_name.trim()) {
            newErrors.customer_name = "Customer name is required.";
        }

        if (!formData.customer_phone.trim()) {
            newErrors.customer_phone = "Phone number is required.";
        }

        if (!formData.service) {
            newErrors.service = "Please select a service.";
        }

        if (!formData.date) {
            newErrors.date = "Date is required.";
        }

        if (!formData.time) {
            newErrors.time = "Time is required.";
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
            setSubmitting(true);

            await api.post("/appointments/", formData);

            navigate("/appointments");
        } catch (error) {
            console.error(error);

            if (error.response?.data) {
                const backendErrors = error.response.data;

                if (backendErrors.non_field_errors) {
                    setErrors({
                        form: backendErrors.non_field_errors[0],
                    });
                } else if (backendErrors.detail) {
                    setErrors({
                        form: backendErrors.detail,
                    });
                }
            }
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Book Appointment
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Create a new salon appointment
                </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
                {errors.form && (
                    <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Customer Name
                        </label>

                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            placeholder="Enter customer name"
                            className={`w-full rounded-lg border px-4 py-2.5 outline-none ${
                                errors.customer_name
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-gray-900"
                            }`}
                        />

                        {errors.customer_name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.customer_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className={`w-full rounded-lg border px-4 py-2.5 outline-none ${
                                errors.customer_phone
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-gray-900"
                            }`}
                        />

                        {errors.customer_phone && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.customer_phone}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Service
                        </label>

                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            disabled={loading}
                            className={`w-full rounded-lg border bg-white px-4 py-2.5 outline-none ${
                                errors.service
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-gray-900"
                            }`}
                        >
                            <option value="">
                                {loading
                                    ? "Loading services..."
                                    : "Select a service"}
                            </option>

                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name} - NPR {service.price}
                                </option>
                            ))}
                        </select>

                        {errors.service && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.service}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Date
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                min={today}
                                onChange={handleChange}
                                className={`w-full rounded-lg border px-4 py-2.5 outline-none ${
                                    errors.date
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-gray-900"
                                }`}
                            />

                            {errors.date && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Time
                            </label>

                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className={`w-full rounded-lg border px-4 py-2.5 outline-none ${
                                    errors.time
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-gray-900"
                                }`}
                            />

                            {errors.time && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.time}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Notes
                        </label>

                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Optional notes"
                            rows="4"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/appointments")}
                            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Booking..." : "Book Appointment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BookAppointment;