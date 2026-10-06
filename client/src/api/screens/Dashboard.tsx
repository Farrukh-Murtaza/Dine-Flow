import { AlertTriangle, Clock3, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, Stat } from "../../components/ui";

const sales = [
    { day: "Mon", amount: 920 },
    { day: "Tue", amount: 1180 },
    { day: "Wed", amount: 860 },
    { day: "Thu", amount: 1450 },
    { day: "Fri", amount: 1710 },
    { day: "Sat", amount: 2080 },
    { day: "Sun", amount: 1560 },
];

const recentOrders = [
    { id: "#1048", customer: "Walk-in", items: 3, total: 28.5, status: "Paid" },
    { id: "#1047", customer: "Ahmed K.", items: 2, total: 19.0, status: "Preparing" },
    { id: "#1046", customer: "Sara M.", items: 5, total: 46.75, status: "Served" },
    { id: "#1045", customer: "Walk-in", items: 1, total: 9.5, status: "Paid" },
];

const lowStock = [
    { name: "Chicken Breast", quantity: 8, unit: "kg", minimum: 15 },
    { name: "Burger Buns", quantity: 12, unit: "pcs", minimum: 25 },
    { name: "Cooking Oil", quantity: 4, unit: "L", minimum: 10 },
];

export default function Dashboard() {
    const max = Math.max(...sales.map((item) => item.amount));

    return (
        <div className="space-y-5">
            <div>
                <p className="text-sm text-muted-foreground">Overview</p>
                <h2 className="mt-1 text-2xl font-bold">Restaurant Dashboard</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Stat icon={DollarSign} label="Today's Sales" value="$1,560" tone="green" />
                <Stat icon={ShoppingBag} label="Orders Today" value="48" tone="blue" />
                <Stat icon={Clock3} label="Pending Orders" value="7" tone="amber" />
                <Stat icon={AlertTriangle} label="Low Stock Items" value="3" tone="purple" />
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
                <Card className="p-6 xl:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">Sales Overview</h3>
                            <p className="text-sm text-muted-foreground">Dummy data for the last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-success">
                            <TrendingUp size={16} /> 12.8%
                        </div>
                    </div>

                    <div className="flex h-64 items-end gap-3 sm:gap-5">
                        {sales.map((item) => (
                            <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                                <span className="text-xs text-muted-foreground">${item.amount}</span>
                                <div className="flex h-48 w-full items-end rounded-xl bg-surface-muted p-1">
                                    <div
                                        className="w-full rounded-lg bg-primary transition-all"
                                        style={{ height: `${Math.max((item.amount / max) * 100, 8)}%` }}
                                    />
                                </div>
                                <span className="text-xs font-medium">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">Low Stock</h3>
                            <p className="text-sm text-muted-foreground">Items that need attention</p>
                        </div>
                        <AlertTriangle className="text-warning" size={20} />
                    </div>

                    <div className="mt-5 space-y-4">
                        {lowStock.map((item) => (
                            <div key={item.name} className="rounded-xl border border-border p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-semibold">{item.name}</span>
                                    <span className="rounded-full bg-danger-bg px-2.5 py-1 text-xs font-semibold text-danger">
                                        Low
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {item.quantity} {item.unit} remaining · minimum {item.minimum}
                                </p>
                            </div>
                        ))}
                    </div>

                    <Link to="/inventory" className="btn-link mt-5 inline-block">
                        Manage inventory →
                    </Link>
                </Card>
            </div>

            <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-border p-6">
                    <div>
                        <h3 className="text-lg font-bold">Recent Orders</h3>
                        <p className="text-sm text-muted-foreground">Latest restaurant activity</p>
                    </div>
                    <Link to="/orders" className="btn-link">View all</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-160 text-left text-sm">
                        <thead className="bg-surface-muted text-muted-foreground">
                            <tr>
                                <th className="px-6 py-3 font-medium">Order</th>
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Items</th>
                                <th className="px-6 py-3 font-medium">Total</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-t border-border">
                                    <td className="px-6 py-4 font-semibold">{order.id}</td>
                                    <td className="px-6 py-4">{order.customer}</td>
                                    <td className="px-6 py-4">{order.items}</td>
                                    <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const classes =
        status === "Paid"
            ? "bg-success-bg text-success"
            : status === "Served"
                ? "bg-info-bg text-info"
                : "bg-warning-bg text-warning";

    return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{status}</span>;
}
