import { Minus, Plus, Utensils, X } from "lucide-react";
import { useMemo, useState } from "react";
import { orderApi } from "../order-api";
import type { MenuItem } from "../../models/index";
import useFetch from "../../context/useFetch";
import { menuItemApi } from "../menu-item-api";
import CrudGrid from "../../components/UI/CrudGrid";
import { SearchInput } from "../../components/UI/SearchInput";
import { useToast } from "../../context/toast-context/useToast";

type OrderItem = {
    menuItem: MenuItem;
    quantity: number;
};

export default function OrderScreen() {
    const [search, setSearch] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const toast = useToast();

    const {
        data,
        loading,
        error,
        refetch,
    } = useFetch<{ items: MenuItem[] }>((signal) =>
        menuItemApi.get(signal),
    );

    const menuItems = useMemo(() => data?.items ?? [], [data]);

    const categories = useMemo(() => {
        const categoryMap = new Map<string, string>();

        menuItems.forEach((item) => {
            const categoryId = item.category?._id;
            const categoryName = item.category?.name;

            if (!categoryId || !categoryName) {
                return;
            }

            categoryMap.set(categoryId, categoryName);
        });

        return Array.from(categoryMap.entries()).map(
            ([id, name]) => ({
                id,
                name,
            }),
        );
    }, [menuItems]);

    const filteredMenuItems = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        return menuItems.filter((item) => {
            if (!item.isAvailable) {
                return false;
            }

            const matchesCategory =
                selectedCategory === "all" ||
                item.category._id === selectedCategory;

            const matchesSearch =
                !searchTerm ||
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.name.toLowerCase().includes(searchTerm) ||
                item.description?.toLowerCase().includes(searchTerm);

            return matchesCategory && matchesSearch;
        });
    }, [menuItems, search, selectedCategory]);

    const addToOrder = (menuItem: MenuItem) => {
        setOrderItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.menuItem._id === menuItem._id,
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.menuItem._id === menuItem._id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item,
                );
            }

            return [
                ...currentItems,
                {
                    menuItem,
                    quantity: 1,
                },
            ];
        });
    };

    const increaseQuantity = (menuItemId?: string) => {
        if (!menuItemId) {
            return;
        }

        setOrderItems((currentItems) =>
            currentItems.map((item) =>
                item.menuItem._id === menuItemId
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                    }
                    : item,
            ),
        );
    };

    const decreaseQuantity = (menuItemId?: string) => {
        if (!menuItemId) {
            return;
        }

        setOrderItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.menuItem._id === menuItemId
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                        }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    };

    const removeFromOrder = (menuItemId?: string) => {
        if (!menuItemId) {
            return;
        }

        setOrderItems((currentItems) =>
            currentItems.filter((item) => item.menuItem._id !== menuItemId),
        );
    };

    const total = orderItems.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0,
    );

    const totalItems = orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    const handlePlaceOrder = async () => {
        if (!tableNumber.trim()) {
            alert("Please enter a table number.");
            return;
        }

        if (orderItems.length === 0) {
            alert("Please add at least one item to the order.");
            return;
        }

        const payload = {
            tableNumber: tableNumber.trim(),
            items: orderItems.map((item) => ({
                menuItem: item.menuItem._id as string,
                quantity: item.quantity,
            })),
        }

        try {
            await orderApi.create(payload);

            setOrderItems([]);
            setTableNumber("");
            toast.success("Order placed successfully.");
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Failed to place order.";
            toast.error(message);
        }
    };

    return (
        <div className="p-5 md:p-8">
            <div className="mx-auto max-w-375">
                <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
                    {/* =========================    MENU    ========================== */}
                    <div>
                        {/* Search */}
                        <div className="mb-5">
                            <div className="relative">


                                <SearchInput
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search category..."
                                    className="max-w-full"
                                />

                                {/* Category Tabs */}
                                <div className=" overflow-hidden mt-6">
                                    <div className="overflow-x-auto">
                                        <div className="flex gap-2 pb-1">
                                            {/* All */}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedCategory("all")}
                                                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${selectedCategory === "all"
                                                    ? "bg-primary text-white"
                                                    : "bg-surface text-muted-foreground hover:bg-surface-muted"
                                                    }`}
                                            >
                                                All
                                            </button>

                                            {/* Categories */}
                                            {categories.map((category) => (
                                                <button
                                                    key={category.id}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(category.id)}
                                                    className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${selectedCategory === category.id
                                                        ? "bg-primary text-white"
                                                        : "bg-surface text-muted-foreground hover:bg-surface-muted"
                                                        }`}
                                                >
                                                    {category.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Menu Items */}
                        <CrudGrid
                            loading={loading}
                            error={error}
                            isEmpty={filteredMenuItems.length === 0}
                            emptyTitle="No menu items found"
                            emptyMessage={
                                search
                                    ? "Try changing your search."
                                    : "There are no available menu items."
                            }
                            onRetry={refetch}
                        >
                            {filteredMenuItems.map((menuItem) => (
                                <div
                                    key={menuItem._id}
                                    className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
                                >
                                    {/* Image */}
                                    <div className="flex h-28 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-50 to-slate-100 text-primary">
                                        {menuItem.imageUrl ? (
                                            <img
                                                src={menuItem.imageUrl}
                                                alt={menuItem.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <Utensils size={38} />
                                        )}
                                    </div>

                                    {/* Category */}
                                    <p className="mt-4 text-xs font-semibold text-primary">
                                        {menuItem.category.name}
                                    </p>

                                    {/* Name */}
                                    <h3 className="mt-1 font-bold">
                                        {menuItem.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="mt-1 h-8 overflow-hidden text-xs text-muted-foreground">
                                        {menuItem.description ||
                                            "No description available."}
                                    </p>

                                    {/* Price + Add */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="font-bold">
                                            ${menuItem.price.toFixed(2)}
                                        </span>

                                        <button
                                            type="button"
                                            className="btn-primary rounded-lg p-2"
                                            onClick={() => addToOrder(menuItem)}
                                            aria-label={`Add ${menuItem.name} `}
                                            title={`Add ${menuItem.name} `}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </CrudGrid>
                    </div>

                    {/* =========================
              CURRENT ORDER
          ========================== */}
                    <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm xl:sticky xl:top-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">
                                Current Order
                            </h3>

                            {totalItems > 0 && (
                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                    {totalItems}{" "}
                                    {totalItems === 1 ? "item" : "items"}
                                </span>
                            )}
                        </div>

                        {/* Table Number */}
                        <input
                            type="number"
                            placeholder="Table number"
                            className="input my-4"
                            value={tableNumber}
                            onChange={(event) =>
                                setTableNumber(event.target.value)
                            }
                        />

                        {/* Order Items */}
                        {orderItems.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
                                <Utensils
                                    size={28}
                                    className="mx-auto text-muted-foreground"
                                />

                                <p className="mt-3 text-sm font-medium">
                                    No items added
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Select items from the menu to start an order.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orderItems.map((item) => (
                                    <div
                                        key={item.menuItem._id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        {/* Item information */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold">
                                                {item.menuItem.name}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                ${item.menuItem.price.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Decrease */}
                                        <button
                                            type="button"
                                            className="rounded border border-border p-1.5 hover:bg-surface-muted"
                                            onClick={() =>
                                                decreaseQuantity(item.menuItem._id)
                                            }
                                            aria-label={`Decrease ${item.menuItem.name} `}
                                        >
                                            <Minus size={14} />
                                        </button>

                                        {/* Quantity */}
                                        <span className="w-5 text-center font-medium">
                                            {item.quantity}
                                        </span>

                                        {/* Increase */}
                                        <button
                                            type="button"
                                            className="rounded border border-border p-1.5 hover:bg-surface-muted"
                                            onClick={() =>
                                                increaseQuantity(item.menuItem._id)
                                            }
                                            aria-label={`Increase ${item.menuItem.name} `}
                                        >
                                            <Plus size={14} />
                                        </button>

                                        {/* Remove */}
                                        <button
                                            type="button"
                                            className="ml-1 rounded p-1.5 text-danger hover:bg-danger-bg"
                                            onClick={() =>
                                                removeFromOrder(item.menuItem._id)
                                            }
                                            aria-label={`Remove ${item.menuItem.name} `}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Total */}
                        <div className="mt-5 flex justify-between border-t border-border pt-4 text-lg font-bold">
                            <span>Total</span>

                            <span>${total.toFixed(2)}</span>
                        </div>

                        {/* Place Order */}
                        <button
                            type="button"
                            className="btn-primary mt-4 w-full py-3"
                            disabled={
                                orderItems.length === 0 || !tableNumber.trim()
                            }
                            onClick={handlePlaceOrder}
                        >
                            Place Order
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
}
