import { Boxes, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Card, Field, Modal } from "../../components/ui";

interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minimum: number;
  cost: number;
}

const seedInventory: InventoryItem[] = [
  { id: "i1", name: "Chicken Breast", unit: "kg", quantity: 8, minimum: 15, cost: 5.25 },
  { id: "i2", name: "Burger Buns", unit: "pcs", quantity: 48, minimum: 25, cost: 0.45 },
  { id: "i3", name: "Cooking Oil", unit: "L", quantity: 4, minimum: 10, cost: 3.8 },
  { id: "i4", name: "Cheddar Cheese", unit: "kg", quantity: 22, minimum: 8, cost: 7.5 },
  { id: "i5", name: "Potatoes", unit: "kg", quantity: 35, minimum: 15, cost: 1.8 },
];

const STORAGE_KEY = "dineflow_dummy_inventory";

function loadInventory(): InventoryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedInventory;
  } catch {
    return seedInventory;
  }
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(loadInventory);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return term ? items.filter((item) => item.name.toLowerCase().includes(term)) : items;
  }, [items, search]);

  const lowStockCount = items.filter((item) => item.quantity <= item.minimum).length;
  const inventoryValue = items.reduce((sum, item) => sum + item.quantity * item.cost, 0);

  function saveItems(next: InventoryItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleSave(data: Omit<InventoryItem, "id">) {
    if (editing) {
      saveItems(items.map((item) => item.id === editing.id ? { ...editing, ...data } : item));
    } else {
      saveItems([{ id: crypto.randomUUID(), ...data }, ...items]);
    }
    setModalOpen(false);
    setEditing(null);
  }

  function removeItem(id: string) {
    if (!window.confirm("Delete this inventory item?")) return;
    saveItems(items.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Stock management</p>
          <h2 className="mt-1 text-2xl font-bold">Inventory</h2>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus size={18} /> Add Inventory Item
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-sm text-muted-foreground">Total Items</p><p className="mt-2 text-2xl font-bold">{items.length}</p></Card>
        <Card className="p-5"><p className="text-sm text-muted-foreground">Low Stock</p><p className="mt-2 text-2xl font-bold text-warning">{lowStockCount}</p></Card>
        <Card className="p-5"><p className="text-sm text-muted-foreground">Inventory Value</p><p className="mt-2 text-2xl font-bold">${inventoryValue.toFixed(2)}</p></Card>
      </div>

      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input className="input pl-10" placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-210 text-left text-sm">
            <thead className="bg-surface-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Item</th>
                <th className="px-6 py-4 font-medium">Quantity</th>
                <th className="px-6 py-4 font-medium">Minimum</th>
                <th className="px-6 py-4 font-medium">Unit Cost</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const low = item.quantity <= item.minimum;
                return (
                  <tr key={item.id} className="border-t border-border">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-bg text-info"><Boxes size={18} /></div><span className="font-semibold">{item.name}</span></div></td>
                    <td className="px-6 py-4 font-semibold">{item.quantity} {item.unit}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.minimum} {item.unit}</td>
                    <td className="px-6 py-4">${item.cost.toFixed(2)}</td>
                    <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${low ? "bg-danger-bg text-danger" : "bg-success-bg text-success"}`}>{low ? "Low Stock" : "In Stock"}</span></td>
                    <td className="px-6 py-4"><div className="flex justify-end gap-2"><button className="btn-secondary px-3 py-2" onClick={() => { setEditing(item); setModalOpen(true); }}><Pencil size={16} /></button><button className="btn-secondary px-3 py-2 text-danger" onClick={() => removeItem(item.id)}><Trash2 size={16} /></button></div></td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No inventory items found.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && <InventoryModal item={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}

function InventoryModal({ item, onClose, onSave }: { item: InventoryItem | null; onClose: () => void; onSave: (data: Omit<InventoryItem, "id">) => void }) {
  const [name, setName] = useState(item?.name ?? "");
  const [unit, setUnit] = useState(item?.unit ?? "kg");
  const [quantity, setQuantity] = useState(String(item?.quantity ?? ""));
  const [minimum, setMinimum] = useState(String(item?.minimum ?? ""));
  const [cost, setCost] = useState(String(item?.cost ?? ""));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = { quantity: Number(quantity), minimum: Number(minimum), cost: Number(cost) };
    if (!name.trim() || !unit.trim() || Object.values(parsed).some((value) => !Number.isFinite(value) || value < 0)) return;
    onSave({ name: name.trim(), unit: unit.trim(), ...parsed });
  }

  return (
    <Modal title={item ? "Edit Inventory Item" : "Add Inventory Item"} onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Item Name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        <Field label="Unit"><input className="input" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg, pcs, L" required /></Field>
        <div className="grid grid-cols-2 gap-3"><Field label="Quantity"><input className="input" type="number" min="0" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} required /></Field><Field label="Minimum Level"><input className="input" type="number" min="0" step="0.01" value={minimum} onChange={(e) => setMinimum(e.target.value)} required /></Field></div>
        <Field label="Unit Cost"><input className="input" type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} required /></Field>
        <div className="flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn-primary">{item ? "Save Changes" : "Add Item"}</button></div>
      </form>
    </Modal>
  );
}
