import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Services", path: "/services" },
        { name: "Appointments", path: "/appointments" },
        { name: "Book Appointment", path: "/book" },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-4 top-4 z-50 rounded-lg bg-gray-900 p-2 text-white md:hidden"
            >
                {isOpen ? "✕" : "☰"}
            </button>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-30 bg-black/40 md:hidden"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <div className="flex h-20 items-center border-b border-gray-700 pl-16 pr-6 md:px-6">
                    <h1 className="text-xl font-bold">Salon</h1>
                </div>

                <nav className="space-y-2 p-4">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-white text-gray-900"
                                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;