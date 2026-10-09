import { Plus } from "lucide-react";
import { useState } from "react";

import type { OrderStatus } from "../../models/order";
import useFetch from "../../context/useFetch";
import { orderApi } from "../order-api";
import type { OrderListResponse } from "../order-api";
import { Link } from "react-router-dom";

const statusStyles: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-700",
    served: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
};

const statusLabels: Record<OrderStatus, string> = {
    pending: "Pending",
    served: "Served",
    completed: "Completed",
};

// status -> next action
const nextAction: Record<OrderStatus, { label: string; next?: OrderStatus }> = {
    pending: { label: "Mark served", next: "served" },
    served: { label: "Complete", next: "completed" },
    completed: { label: "Complete" },
};

export default function AllOrderScreen() {
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const { data, loading, error, refetch } = useFetch<OrderListResponse>(
        (signal) => orderApi.get({ limit: 100 }, signal),
    );

    const orders = data?.orders ?? [];

    const changeStatus = async (id: string, status: OrderStatus) => {
        setUpdatingId(id);
        try {
            await orderApi.update(id, { status });
            await refetch();
        } catch (err) {
            alert(
                err instanceof Error ? err.message : "Failed to update order.",
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="bg-surface border border-border rounded-2xl shadow-sm p-6">
            <div className="flex justify-between mb-5">
                <div>
                    <h3 className="font-bold text-lg">All Orders</h3>
                    <p className="text-sm text-slate-400">
                        Track service and payment status
                    </p>
                </div>

                <Link
                    to="/new-order"
                    className="px-4 py-2 bg-[#1F3A5F] text-white rounded-xl flex gap-2 items-center"
                >
                    <Plus size={17} />
                    New order
                </Link>
            </div>

            <div className="overflow-auto">
                {loading ? (
                    <p className="py-8 text-center text-sm text-slate-400">
                        Loading orders...
                    </p>
                ) : error ? (
                    <div className="py-8 text-center text-sm text-slate-400">
                        <p>Failed to load orders.</p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-2 text-blue-700 font-semibold"
                        >
                            Retry
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">
                        No orders yet.
                    </p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-400 border-b">
                                <th className="py-3 pr-4">Order</th>
                                <th className="py-3 pr-4">User</th>
                                <th className="py-3 pr-4">Table</th>
                                <th className="py-3 pr-4">Items</th>
                                <th className="py-3 pr-4">Total</th>
                                <th className="py-3 pr-4">Status</th>
                                <th className="py-3 pr-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => {
                                const action = nextAction[order.status];
                                const itemCount = order.items.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0,
                                );

                                return (
                                    <tr
                                        key={order._id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="py-4 font-bold">
                                            #{order._id.slice(-4).toUpperCase()}
                                        </td>
                                        <td>{order?.user?.username}</td>
                                        <td>{order.tableNumber}</td>
                                        <td>{itemCount}</td>
                                        <td>${order.total.toFixed(2)}</td>
                                        <td>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}
                                            >
                                                {statusLabels[order.status]}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                disabled={
                                                    !action.next ||
                                                    updatingId === order._id
                                                }
                                                onClick={() =>
                                                    action.next &&
                                                    changeStatus(
                                                        order._id,
                                                        action.next,
                                                    )
                                                }
                                                className="text-blue-700 font-semibold disabled:text-slate-300"
                                            >
                                                {action.label}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
