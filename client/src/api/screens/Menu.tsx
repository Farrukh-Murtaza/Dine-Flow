import { Pencil, Plus, Search, Trash2, Utensils } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Card, Field, Modal } from "../../components/ui";
import { useAuth } from "../../context/auth-context/useAuth";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
}


const seedMenu: MenuItem[] = [
  { id: "m1", name: "Chicken Burger", category: "Burgers", price: 9.99, available: true },
  { id: "m2", name: "Spicy Chicken Sandwich", category: "Sandwiches", price: 11.5, available: true },
  { id: "m3", name: "Loaded Fries", category: "Sides", price: 6.5, available: true },
  { id: "m4", name: "Chicken Wings", category: "Wings", price: 12.99, available: false },
];

const STORAGE_KEY = "dineflow_dummy_menu";

function loadMenu(): MenuItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedMenu;
  } catch {
    return seedMenu;
  }
}

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>(loadMenu);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const { user } = useAuth();

  const canManageMenu =
    user?.role === "owner" ||
    user?.role === "manager";

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return items;
    return items.filter((item) =>
      `${item.name} ${item.category}`.toLowerCase().includes(term),
    );
  }, [items, search]);

  function saveItems(next: MenuItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleSave(data: Omit<MenuItem, "id">) {
    if (editing) {
      saveItems(items.map((item) => (item.id === editing.id ? { ...editing, ...data } : item)));
    } else {
      saveItems([{ id: crypto.randomUUID(), ...data }, ...items]);
    }
    setModalOpen(false);
    setEditing(null);
  }

  function removeItem(id: string) {
    if (!window.confirm("Delete this menu item?")) return;
    saveItems(items.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Restaurant menu</p>
          <h2 className="mt-1 text-2xl font-bold">Menu Management</h2>
        </div>
        {
          canManageMenu && (
            <button className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
              <Plus size={18} /> Add Menu Item
            </button>
          )
        }
      </div>

      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            className="input pl-10"
            placeholder="Search menu items..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-surface-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Item</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Availability</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Utensils size={18} />
                      </div>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                  <td className="px-6 py-4 font-semibold">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => saveItems(items.map((x) => x.id === item.id ? { ...x, available: !x.available } : x))}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${item.available ? "bg-success-bg text-success" : "bg-danger-bg text-danger"}`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="btn-secondary px-3 py-2" onClick={() => { setEditing(item); setModalOpen(true); }} aria-label={`Edit ${item.name}`}>
                        <Pencil size={16} />
                      </button>
                      <button className="btn-secondary px-3 py-2 text-danger" onClick={() => removeItem(item.id)} aria-label={`Delete ${item.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No menu items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <MenuModal
          item={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function MenuModal({ item, onClose, onSave }: { item: MenuItem | null; onClose: () => void; onSave: (data: Omit<MenuItem, "id">) => void }) {
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState(item?.category ?? "Burgers");
  const [price, setPrice] = useState(String(item?.price ?? ""));
  const [available, setAvailable] = useState(item?.available ?? true);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedPrice = Number(price);
    if (!name.trim() || !category.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) return;
    onSave({ name: name.trim(), category: category.trim(), price: parsedPrice, available });
  }

  return (
    <Modal title={item ? "Edit Menu Item" : "Add Menu Item"} onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        <Field label="Category"><input className="input" value={category} onChange={(e) => setCategory(e.target.value)} required /></Field>
        <Field label="Price"><input className="input" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required /></Field>
        <label className="mb-5 flex items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} /> Available for ordering
        </label>
        <div className="flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{item ? "Save Changes" : "Add Item"}</button>
        </div>
      </form>
    </Modal>
  );
}
