import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LoginScreen from "./components/LoginScreen";
import NotFound from "./components/NotFound";
import { accessFor, homePathFor } from "./config/navigation";
import Dashboard from "./api/screens/Dashboard";
import Inventory from "./api/screens/Inventory";
import Menu from "./api/screens/Menu";
import { ProtectedRoute, RequireRole } from "./routes/ProtectedRoutes";
import { useAuth } from "./context/auth-context/useAuth";

function Guarded({ path, children }: { path: string; children: ReactNode }) {
  return <RequireRole roles={accessFor(path)}>{children}</RequireRole>;
}

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={homePathFor(user?.role ?? "")} replace />;
}

function Placeholder({ title }: { title: string }) {
  return <div className="rounded-2xl border border-border bg-surface p-10 text-center"><h2 className="text-2xl font-bold">{title}</h2><p className="mt-2 text-muted-foreground">This module is ready for the next development step.</p></div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomeRedirect />} />
          <Route path="dashboard" element={<Guarded path="/"><Dashboard /></Guarded>} />
          <Route path="menu" element={<Guarded path="/menu"><Menu /></Guarded>} />
          <Route path="inventory" element={<Guarded path="/inventory"><Inventory /></Guarded>} />
          <Route path="new-order" element={<Guarded path="/new-order"><Placeholder title="New Order" /></Guarded>} />
          <Route path="orders" element={<Guarded path="/orders"><Placeholder title="Orders" /></Guarded>} />
          <Route path="stock-in" element={<Guarded path="/stock-in"><Placeholder title="Stock In" /></Guarded>} />
          <Route path="low-stock" element={<Guarded path="/low-stock"><Placeholder title="Low Stock" /></Guarded>} />
          <Route path="stock-history" element={<Guarded path="/stock-history"><Placeholder title="Stock History" /></Guarded>} />
          <Route path="reports" element={<Guarded path="/reports"><Placeholder title="Reports" /></Guarded>} />
          <Route path="staff" element={<Guarded path="/staff"><Placeholder title="Staff" /></Guarded>} />
          <Route path="settings" element={<Guarded path="/settings"><Placeholder title="Settings" /></Guarded>} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
