import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function AppLayout() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <main className="min-h-screen md:ml-64">
                <div className="p-4 pt-20 sm:p-6 sm:pt-20 md:p-8 md:pt-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AppLayout;