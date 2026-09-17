import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Appointments from "./pages/Appointments";
import BookAppointment from "./pages/BookAppointment";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />
                    <Route
                        path="/"
                        element={<Navigate to="/services" replace />}
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route
                        path="/book"
                        element={<BookAppointment />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;