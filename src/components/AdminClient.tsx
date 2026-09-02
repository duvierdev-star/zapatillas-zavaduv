"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { CONDITION_LABEL, Condition, GENDER_LABEL, Gender, Product, formatPrice } from "@/lib/types";

const empty: {
  name: string;
  brand: string;
  gender: Gender;
  sizes: string;
  price: string;
  compareAtPrice: string;
  condition: Condition;
  description: string;
  images: string[];
  available: boolean;
} = {
  name: "",
  brand: "",
  gender: "hombre",
  sizes: "",
  price: "",
  compareAtPrice: "",
  condition: "nuevo",
  description: "",
  images: [],
  available: true,
};

export function AdminClient({
  initialProducts,
  initiallyAuthed,
}: {
  initialProducts: Product[];
  initiallyAuthed: boolean;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Gallery state
  const [gallery, setGallery] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [gallerySearch, setGallerySearch] = useState("");
  const [loadingGallery, setLoadingGallery] = useState(false);

  useEffect(() => {
    const id = search.get("editar");
    if (!id || !authed) return;
    const product = products.find((item) => item.id === id);
    if (!product) return;
    loadProduct(product);
  }, [search, authed, products]);

  function loadProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      gender: product.gender,
      sizes: product.sizes.join(", "),
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      condition: product.condition,
      description: product.description,
      images: product.images,
      available: product.available,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function login(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError("Contraseña incorrecta");
      return;
    }
    setAuthed(true);
    router.refresh();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthed(false);
    router.refresh();
  }

  async function openGallery() {
    setIsGalleryOpen(true);
    if (gallery.length === 0) {
      setLoadingGallery(true);
      try {
        const response = await fetch("/api/images");
        const json = await response.json();
        if (Array.isArray(json.images)) {
          setGallery(json.images);
        }
      } catch (err) {
        console.error("Error loading gallery images:", err);
      } finally {
        setLoadingGallery(false);
      }
    }
  }

  function toggleImageSelection(imageSrc: string) {
    setForm((current) => {
      const exists = current.images.includes(imageSrc);
      if (exists) {
        return {
          ...current,
          images: current.images.filter((img) => img !== imageSrc),
        };
      } else {
        return {
          ...current,
          images: [...current.images, imageSrc],
        };
      }
    });
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: data });
      const json = await response.json();
      if (response.ok) uploaded.push(json.url);
    }
    setForm((current) => ({ ...current, images: [...current.images, ...uploaded] }));
    setUploading(false);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      brand: form.brand,
      gender: form.gender,
      sizes: form.sizes
        .split(/[,\s]+/)
        .map((value) => value.trim())
        .filter(Boolean),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      condition: form.condition,
      description: form.description,
      images: form.images,
      available: form.available,
    };
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const response = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(json.error || "No se pudo guardar");
      return;
    }
    setProducts((current) => {
      const others = current.filter((item) => item.id !== json.id);
      return [json, ...others];
    });
    setForm(empty);
    setEditingId(null);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta zapatilla del catálogo?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(empty);
    }
    router.refresh();
  }

  const previewPrice = useMemo(() => {
    const value = Number(form.price);
    return Number.isFinite(value) && value > 0 ? formatPrice(value) : "";
  }, [form.price]);

  const filteredGallery = useMemo(() => {
    if (!gallerySearch.trim()) return gallery;
    const q = gallerySearch.toLowerCase().trim();
    return gallery.filter((img) => img.toLowerCase().includes(q));
  }, [gallery, gallerySearch]);

  if (!authed) {
    return (
      <>
        <Header />
        <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
          <form onSubmit={login} className="w-full rounded-3xl border border-[#e4dfd0] bg-white p-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6b675f]">Acceso privado</p>
            <h1 className="mt-2 text-3xl font-semibold">Panel de Variedades</h1>
            <p className="mt-2 text-sm text-[#6b675f]">
              Solo tú puedes agregar, editar o quitar zapatillas. Los clientes ven el catálogo público.
            </p>
            <label className="mt-6 block text-sm">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#e4dfd0] px-3 py-2.5 outline-none focus:border-[#141414]"
              />
            </label>
            {error ? <p className="mt-3 text-sm text-[#2754F5]">{error}</p> : null}
            <button className="mt-6 w-full rounded-full bg-[#141414] py-3 text-sm font-medium text-white">
              Entrar
            </button>
          </form>
        </main>
      </>
    );
  }

  return (
    <>
      <Header admin />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6b675f]">Administración</p>
            <h1 className="text-4xl font-semibold tracking-tight">Tus zapatillas</h1>
          </div>
          <button onClick={logout} className="text-sm text-[#6b675f] underline">
            Cerrar sesión
          </button>
        </div>

        <form onSubmit={save} className="mt-10 grid gap-8 rounded-3xl border border-[#e4dfd0] bg-white p-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">{editingId ? "Editar modelo" : "Agregar zapatilla"}</h2>
            <Field label="Marca">
              <input
                required
                value={form.brand}
                onChange={(event) => setForm({ ...form, brand: event.target.value })}
                placeholder="Nike, Adidas, Jordan..."
                className="input"
              />
            </Field>
            <Field label="Modelo">
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Air Max 90"
                className="input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Para">
                <select
                  value={form.gender}
                  onChange={(event) => setForm({ ...form, gender: event.target.value as typeof form.gender })}
                  className="input"
                >
                  {Object.entries(GENDER_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Estado">
                <select
                  value={form.condition}
                  onChange={(event) => setForm({ ...form, condition: event.target.value as typeof form.condition })}
                  className="input"
                >
                  {Object.entries(CONDITION_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Tallas (separadas por coma)">
              <input
                required
                value={form.sizes}
                onChange={(event) => setForm({ ...form, sizes: event.target.value })}
                placeholder="38, 39, 40, 41"
                className="input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Precio">
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  placeholder="450000"
                  className="input"
                />
              </Field>
              <Field label="Precio anterior (opcional)">
                <input
                  type="number"
                  min="0"
                  value={form.compareAtPrice}
                  onChange={(event) => setForm({ ...form, compareAtPrice: event.target.value })}
                  placeholder="520000"
                  className="input"
                />
              </Field>
            </div>
            {previewPrice ? <p className="text-sm text-[#6b675f]">Se verá como {previewPrice}</p> : null}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(event) => setForm({ ...form, available: event.target.checked })}
              />
              Disponible para venta
            </label>
          </div>
          <div className="space-y-4">
            <Field label="Descripción">
              <textarea
                rows={5}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Color, material, estado, detalles que le importan al cliente."
                className="input resize-none"
              />
            </Field>

            <div>
              <label className="block text-sm font-medium mb-2">Fotos del modelo</label>
              
              {/* Button to open the internal zapatillas gallery picker */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={openGallery}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#141414] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-black transition"
                >
                  <span>🖼️</span>
                  <span>Elegir fotos de la carpeta Zapatillas</span>
                  {gallery.length > 0 ? (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
                      {gallery.length}
                    </span>
                  ) : null}
                </button>
              </div>

              {/* Alternative file upload */}
              <details className="mt-2 text-xs text-[#6b675f]">
                <summary className="cursor-pointer hover:underline mb-2">
                  ¿Quieres subir una foto nueva desde tu equipo?
                </summary>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => uploadFiles(event.target.files)}
                  className="text-sm mt-1"
                />
                {uploading ? <p className="mt-1 text-xs text-[#6b675f]">Subiendo fotos...</p> : null}
              </details>
            </div>

            {/* Selected Images Preview */}
            {form.images.length > 0 ? (
              <div>
                <p className="text-xs text-[#6b675f] mb-2 font-medium">
                  Fotos seleccionadas ({form.images.length}) - La primera será la foto principal:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {form.images.map((src, index) => (
                    <div key={src} className="relative group overflow-hidden rounded-xl border border-[#e4dfd0] bg-[#f9f8f4]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-24 w-full object-cover" />
                      <div className="absolute top-1 left-1 bg-black/70 text-white rounded-full px-2 py-0.5 text-[10px] font-bold">
                        {index === 0 ? "Principal" : `#${index + 1}`}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            images: current.images.filter((item) => item !== src),
                          }))
                        }
                        className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow hover:bg-red-700 transition"
                        title="Quitar foto"
                      >
                        ×
                      </button>
                      <div className="p-1 bg-white text-[10px] text-center truncate text-[#6b675f]">
                        {src.split("/").pop()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#d9d3c2] p-4 text-center text-xs text-[#6b675f]">
                No has seleccionado ninguna foto aún. Haz clic en <strong>Elegir fotos de la carpeta Zapatillas</strong> arriba.
              </div>
            )}

            {error ? <p className="text-sm text-[#2754F5]">{error}</p> : null}
            <div className="flex gap-3 pt-2">
              <button disabled={saving} className="rounded-full bg-[#141414] px-6 py-3 text-sm font-medium text-white hover:bg-black transition">
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Publicar zapatilla"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(empty);
                  }}
                  className="rounded-full border border-[#e4dfd0] px-6 py-3 text-sm hover:bg-[#f7f4ec] transition"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </div>
        </form>

        {/* Existing Products Table */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-[#e4dfd0] bg-white">
          <div className="p-5 border-b border-[#eeeae0]">
            <h2 className="text-lg font-semibold">Catálogo actual ({products.length} zapatillas)</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f7f4ec] text-[11px] uppercase tracking-[0.16em] text-[#6b675f]">
              <tr>
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3">Modelo</th>
                <th className="px-4 py-3">Marca</th>
                <th className="px-4 py-3">Para</th>
                <th className="px-4 py-3">Tallas</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-[#eeeae0] hover:bg-[#fcfbf9]">
                  <td className="px-4 py-3">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover border border-[#e4dfd0]"
                      />
                    ) : (
                      <span className="text-xs text-[#6b675f]">Sin foto</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">{product.brand}</td>
                  <td className="px-4 py-3">{GENDER_LABEL[product.gender]}</td>
                  <td className="px-4 py-3">{product.sizes.join(", ")}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => loadProduct(product)} className="mr-3 text-sm underline hover:text-black">
                      Editar
                    </button>
                    <button onClick={() => remove(product.id)} className="text-sm text-[#2754F5] hover:underline">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#e4dfd0] px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Galería de Zapatillas del Proyecto</h3>
                <p className="text-xs text-[#6b675f]">
                  Haz clic en las fotos que correspondan a este modelo para seleccionarlas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="rounded-full bg-[#f2ede4] px-3 py-1 text-sm font-bold text-[#141414] hover:bg-[#e4dfd0]"
              >
                ✕
              </button>
            </div>

            {/* Modal Filter / Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeae0] bg-[#fbf9f5] px-6 py-3">
              <input
                type="text"
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                placeholder="Buscar por número o nombre (ej: 001, 054)..."
                className="w-full sm:w-80 rounded-xl border border-[#e4dfd0] bg-white px-3 py-2 text-sm outline-none focus:border-[#141414]"
              />
              <div className="text-xs text-[#6b675f]">
                {form.images.length} foto{form.images.length === 1 ? "" : "s"} seleccionada{form.images.length === 1 ? "" : "s"} para este producto
              </div>
            </div>

            {/* Modal Content / Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingGallery ? (
                <div className="py-20 text-center text-sm text-[#6b675f]">Cargando imágenes de zapatillas...</div>
              ) : filteredGallery.length === 0 ? (
                <div className="py-20 text-center text-sm text-[#6b675f]">
                  No se encontraron fotos que coincidan con la búsqueda.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {filteredGallery.map((imgSrc) => {
                    const isSelected = form.images.includes(imgSrc);
                    const selectedIndex = form.images.indexOf(imgSrc);
                    const fileName = imgSrc.split("/").pop();

                    return (
                      <div
                        key={imgSrc}
                        onClick={() => toggleImageSelection(imgSrc)}
                        className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition ${
                          isSelected
                            ? "border-black ring-2 ring-black bg-[#141414]/5"
                            : "border-[#e4dfd0] bg-white hover:border-[#6b675f]"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgSrc}
                          alt={fileName || ""}
                          className="aspect-square w-full object-cover transition group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Selected badge */}
                        {isSelected ? (
                          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#141414] text-xs font-bold text-white shadow">
                            ✓
                          </div>
                        ) : (
                          <div className="absolute top-2 right-2 hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-xs text-white">
                            +
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute bottom-6 left-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            {selectedIndex === 0 ? "Principal" : `#${selectedIndex + 1}`}
                          </div>
                        )}
                        <div className="p-1.5 text-center text-[11px] font-mono text-[#6b675f] truncate bg-white">
                          {fileName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#e4dfd0] bg-[#fbf9f5] px-6 py-4">
              <span className="text-xs text-[#6b675f]">
                {filteredGallery.length} fotos mostradas ({gallery.length} en total)
              </span>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="rounded-full bg-[#141414] px-6 py-2.5 text-sm font-medium text-white hover:bg-black transition"
              >
                Listo ({form.images.length} seleccionadas)
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e4dfd0;
          padding: 0.65rem 0.8rem;
          outline: none;
          background: #fff;
        }
        .input:focus {
          border-color: #141414;
        }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      {label}
      {children}
    </label>
  );
}
