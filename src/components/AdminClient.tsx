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

  // Catalog pagination and search
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogVisibleCount, setCatalogVisibleCount] = useState(16);

  // Gallery state
  const [gallery, setGallery] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [gallerySearch, setGallerySearch] = useState("");
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [galleryVisibleCount, setGalleryVisibleCount] = useState(48);

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
    setGalleryVisibleCount(48);
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

  const filteredProducts = useMemo(() => {
    if (!catalogSearch.trim()) return products;
    const q = catalogSearch.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.gender && p.gender.toLowerCase().includes(q))
    );
  }, [products, catalogSearch]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, catalogVisibleCount);
  }, [filteredProducts, catalogVisibleCount]);

  const filteredGallery = useMemo(() => {
    if (!gallerySearch.trim()) return gallery;
    const q = gallerySearch.toLowerCase().trim();
    return gallery.filter((img) => img.toLowerCase().includes(q));
  }, [gallery, gallerySearch]);

  const visibleGallery = useMemo(() => {
    return filteredGallery.slice(0, galleryVisibleCount);
  }, [filteredGallery, galleryVisibleCount]);

  const fichaNumber = useMemo(() => {
    if (!editingId) return null;
    const index = products.findIndex((item) => item.id === editingId);
    return index >= 0 ? String(index + 1).padStart(3, "0") : null;
  }, [editingId, products]);

  if (!authed) {
    return (
      <>
        <Header />
        <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
          <form onSubmit={login} className="w-full rounded-xl border-2 border-[#141414] bg-white p-8">
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
                className="mt-2 w-full rounded-lg border border-[#e4dfd0] px-3 py-2.5 outline-none focus:border-[#141414]"
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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {/* Título */}
          <div className="relative">
            {/* Badge Administración */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e4dfd0] bg-white px-3 py-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2754F5] shadow-[0_0_8px_rgba(39,84,245,0.6)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6b675f]">
                Administración
              </p>
            </div>

            {/* Título principal */}
            <h1 className="text-4xl font-black tracking-[-0.04em] text-[#141414] sm:text-5xl">
              Tus{" "}
              <span className="relative inline-block">
                zapatillas
                <span className="absolute -bottom-1 left-0 h-[3px] w-1/2 rounded-full bg-[#2754F5]" />
              </span>
            </h1>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#77736b]">
              Gestiona tu catálogo, productos y novedades desde un solo lugar.
            </p>
          </div>

          {/* Cerrar sesión */}
          <button
            onClick={logout}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[#e4dfd0] bg-white px-5 py-3 text-sm font-semibold text-[#3f3c37] shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2754F5]/30 hover:bg-[#f8faff] hover:text-[#2754F5] hover:shadow-[0_8px_25px_rgba(39,84,245,0.12)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 17l5-5-5-5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H3"
              />
            </svg>

            <span>Cerrar sesión</span>
          </button>
        </div>

        {/* Ficha (form card) */}
        <form
          onSubmit={save}
          className="mt-10 overflow-hidden rounded-2xl border border-[#e4dfd0] bg-white shadow-[0_20px_60px_rgba(20,20,20,0.07)]"
        >
          {/* =========================================================
      HEADER DEL FORMULARIO
  ========================================================= */}
          <div className="relative overflow-hidden border-b border-[#eeeae0] bg-[#faf9f7] px-6 py-6 sm:px-8">
            {/* Detalle decorativo */}
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-[#2754F5]/5 blur-2xl" />

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2754F5] shadow-[0_0_8px_rgba(39,84,245,0.5)]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#77736b]">
                    {editingId ? "Gestión de producto" : "Nuevo producto"}
                  </span>
                </div>

                <h2 className="text-2xl font-black tracking-[-0.03em] text-[#141414] sm:text-3xl">
                  {editingId ? "Editar modelo" : "Agregar zapatilla"}
                </h2>

                <p className="mt-1 text-sm text-[#77736b]">
                  Completa la información para actualizar tu catálogo.
                </p>
              </div>

              {/* Ficha */}
              <div className="group inline-flex items-center gap-2 rounded-full border border-[#ddd8cb] bg-white px-4 py-2 shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition hover:border-[#2754F5]/30">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#99948a]">
                  Ficha
                </span>

                <span className="font-mono text-xs font-bold text-[#141414]">
                  {fichaNumber ? `Nº${fichaNumber}` : "Nueva"}
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================
      CONTENIDO
  ========================================================= */}
          <div className="p-6 sm:p-8">
            <div className="grid gap-10 lg:grid-cols-2">

              {/* =====================================================
          INFORMACIÓN DEL PRODUCTO
      ===================================================== */}
              <div className="space-y-5">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2754F5]">
                    Información
                  </p>

                  <h3 className="mt-1 text-lg font-bold tracking-tight text-[#141414]">
                    Datos del modelo
                  </h3>
                </div>

                <Field label="Marca">
                  <input
                    required
                    value={form.brand}
                    onChange={(event) =>
                      setForm({ ...form, brand: event.target.value })
                    }
                    placeholder="Nike, Adidas, Jordan..."
                    className="input"
                  />
                </Field>

                <Field label="Modelo">
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    placeholder="Air Max 90"
                    className="input"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Para">
                    <select
                      value={form.gender}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          gender: event.target.value as typeof form.gender,
                        })
                      }
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
                      onChange={(event) =>
                        setForm({
                          ...form,
                          condition: event.target.value as typeof form.condition,
                        })
                      }
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

                <Field label="Tallas">
                  <input
                    required
                    value={form.sizes}
                    onChange={(event) =>
                      setForm({ ...form, sizes: event.target.value })
                    }
                    placeholder="38, 39, 40, 41"
                    className="input"
                  />
                </Field>

                {/* PRECIOS */}
                <div className="rounded-2xl border border-[#eeeae0] bg-[#faf9f7] p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#77736b]">
                      Precio
                    </span>

                    <span className="h-px flex-1 bg-[#e8e3d8]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Precio actual">
                      <input
                        required
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(event) =>
                          setForm({ ...form, price: event.target.value })
                        }
                        placeholder="450000"
                        className="input"
                      />
                    </Field>

                    <Field label="Precio anterior">
                      <input
                        type="number"
                        min="0"
                        value={form.compareAtPrice}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            compareAtPrice: event.target.value,
                          })
                        }
                        placeholder="520000"
                        className="input"
                      />
                    </Field>
                  </div>

                  {previewPrice ? (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2754F5]" />

                      <p className="text-xs text-[#6b675f]">
                        Vista previa:{" "}
                        <strong className="text-[#141414]">
                          {previewPrice}
                        </strong>
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* DISPONIBILIDAD */}
                <label className="group flex cursor-pointer items-center justify-between rounded-2xl border border-[#eeeae0] bg-white p-4 transition hover:border-[#2754F5]/30 hover:bg-[#fafcff]">
                  <div>
                    <p className="text-sm font-semibold text-[#141414]">
                      Disponible para venta
                    </p>

                    <p className="mt-0.5 text-xs text-[#77736b]">
                      Mostrar este producto como disponible.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        available: event.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-[#2754F5]"
                  />
                </label>

                <Field label="Descripción">
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        description: event.target.value,
                      })
                    }
                    placeholder="Color, material, estado, detalles que le importan al cliente..."
                    className="input resize-none"
                  />
                </Field>
              </div>

              {/* =====================================================
          FOTOS
      ===================================================== */}
              <div className="space-y-5">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2754F5]">
                    Visual
                  </p>

                  <h3 className="mt-1 text-lg font-bold tracking-tight text-[#141414]">
                    Fotografías del modelo
                  </h3>
                </div>

                {/* BOTÓN GALERÍA */}
                <button
                  type="button"
                  onClick={openGallery}
                  className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-[#e4dfd0] bg-[#faf9f7] p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2754F5]/40 hover:bg-[#f8faff] hover:shadow-[0_12px_30px_rgba(39,84,245,0.08)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#141414] text-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                      🖼️
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#141414]">
                        Elegir fotografías
                      </p>

                      <p className="mt-0.5 text-xs text-[#77736b]">
                        Selecciona imágenes de la carpeta Zapatillas
                      </p>
                    </div>
                  </div>

                  {gallery.length > 0 ? (
                    <span className="rounded-full bg-[#2754F5] px-3 py-1 text-xs font-bold text-white shadow-[0_4px_12px_rgba(39,84,245,0.25)]">
                      {gallery.length}
                    </span>
                  ) : (
                    <span className="text-xl text-[#aaa59b] transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>

                {/* SUBIR FOTO */}
                <details className="group rounded-2xl border border-dashed border-[#d9d3c2] bg-[#faf9f7] p-4">
                  <summary className="cursor-pointer list-none text-xs font-semibold text-[#6b675f]">
                    <span className="mr-2 transition group-open:rotate-90 inline-block">
                      ›
                    </span>
                    ¿Quieres subir una foto nueva desde tu equipo?
                  </summary>

                  <div className="mt-4 rounded-xl bg-white p-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) =>
                        uploadFiles(event.target.files)
                      }
                      className="w-full text-sm"
                    />

                    {uploading ? (
                      <p className="mt-2 text-xs font-medium text-[#2754F5]">
                        Subiendo fotografías...
                      </p>
                    ) : null}
                  </div>
                </details>

                {/* GALERÍA */}
                {form.images.length > 0 ? (
                  <div className="rounded-2xl border border-[#eeeae0] bg-[#faf9f7] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#141414]">
                          Fotografías seleccionadas
                        </p>

                        <p className="mt-0.5 text-xs text-[#77736b]">
                          La primera imagen será la principal.
                        </p>
                      </div>

                      <span className="rounded-full bg-[#141414] px-3 py-1 text-xs font-bold text-white">
                        {form.images.length}
                      </span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {form.images.map((src, index) => (
                        <div
                          key={src}
                          className={`group relative shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ${index === 0
                            ? "h-36 w-36 border-2 border-[#2754F5] shadow-[0_6px_20px_rgba(39,84,245,0.12)]"
                            : "h-24 w-24 border border-[#e4dfd0]"
                            }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt=""
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          <div className="absolute left-2 top-2 rounded-full bg-[#141414]/85 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            {index === 0 ? "Principal" : `#${index + 1}`}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                images: current.images.filter(
                                  (item) => item !== src
                                ),
                              }))
                            }
                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-[#141414] opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                            title="Quitar foto"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[170px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9d3c2] bg-[#faf9f7] px-6 text-center">
                    <div className="mb-3 text-3xl opacity-50">
                      📸
                    </div>

                    <p className="text-sm font-semibold text-[#6b675f]">
                      Aún no hay fotografías
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#99948a]">
                      Selecciona las imágenes que quieres utilizar en el catálogo.
                    </p>
                  </div>
                )}

                {/* ERROR */}
                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>

            {/* =====================================================
        ACCIONES
    ===================================================== */}
            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-[#eeeae0] pt-6 sm:flex-row sm:justify-end">
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(empty);
                  }}
                  className="rounded-xl border border-[#e4dfd0] bg-white px-6 py-3.5 text-sm font-semibold text-[#6b675f] transition-all duration-300 hover:border-[#141414] hover:bg-[#faf9f7] hover:text-[#141414]"
                >
                  Cancelar
                </button>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="group relative overflow-hidden rounded-xl bg-[#141414] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(20,20,20,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2754F5] hover:shadow-[0_10px_30px_rgba(39,84,245,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      {editingId ? "Guardar cambios" : "Publicar zapatilla"}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* =========================================================
            CATÁLOGO ACTUAL
        ========================================================= */}
        <div className="mt-14">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-[#eeeae0] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2754F5] shadow-[0_0_8px_rgba(39,84,245,0.5)]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#77736b]">
                  Inventario
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#141414]">
                Catálogo actual
              </h2>

              <p className="mt-1 text-sm text-[#77736b]">
                Administra los modelos publicados en tu tienda.
              </p>
            </div>

            {/* Contador y Buscador */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => {
                    setCatalogSearch(e.target.value);
                    setCatalogVisibleCount(16);
                  }}
                  placeholder="Buscar modelo o marca..."
                  className="w-56 rounded-full border border-[#e4dfd0] bg-[#faf9f7] px-3.5 py-1.5 text-xs text-[#141414] outline-none transition-all placeholder:text-[#99948a] focus:border-[#2754F5] focus:bg-white focus:ring-2 focus:ring-[#2754F5]/10"
                />
                {catalogSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setCatalogSearch("");
                      setCatalogVisibleCount(16);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#99948a] hover:text-[#141414]"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e4dfd0] bg-[#faf9f7] px-4 py-2">
                <span className="text-lg font-black text-[#141414]">
                  {filteredProducts.length}
                </span>

                <span className="text-xs font-medium text-[#77736b]">
                  {filteredProducts.length === 1 ? "zapatilla" : "zapatillas"}
                </span>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-sm text-[#77736b]">
                No se encontraron zapatillas que coincidan con &ldquo;{catalogSearch}&rdquo;.
              </div>
            ) : (
              visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl border border-[#e4dfd0] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#2754F5]/30 hover:shadow-[0_18px_40px_rgba(20,20,20,0.09)]"
                >
                  {/* =================================================
                      IMAGEN
                  ================================================= */}
                  <div className="relative aspect-square overflow-hidden bg-[#f7f4ec]">
                    {product.images[0] ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                        {/* Degradado inferior */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <span className="mb-2 text-2xl opacity-40">📸</span>

                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#99948a]">
                          Sin fotografía
                        </span>
                      </div>
                    )}

                    {/* Marca */}
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#141414] shadow-sm backdrop-blur">
                        {product.brand}
                      </span>
                    </div>

                    {/* Estado */}
                    <div className="absolute right-3 top-3">
                      {product.available ? (
                        <span className="flex items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#141414] shadow-sm backdrop-blur">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2754F5]" />
                          Disponible
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#141414]/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur">
                          Agotado
                        </span>
                      )}
                    </div>

                    {/* Número de imágenes */}
                    {product.images.length > 1 ? (
                      <div className="absolute bottom-3 left-3 rounded-full bg-[#141414]/80 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur">
                        {product.images.length} fotos
                      </div>
                    ) : null}
                  </div>

                  {/* =================================================
                      INFORMACIÓN
                  ================================================= */}
                  <div className="p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#2754F5]">
                      {product.gender
                        ? GENDER_LABEL[product.gender]
                        : "Modelo"}
                    </p>

                    <p className="mt-1 truncate text-sm font-bold tracking-tight text-[#141414]">
                      {product.name}
                    </p>

                    <p className="mt-1.5 truncate text-[11px] text-[#77736b]">
                      Tallas {product.sizes.join(", ")}
                    </p>

                    {/* Precio */}
                    <div className="mt-3 flex items-end justify-between gap-2">
                      <div>
                        <p className="text-base font-black tracking-tight text-[#141414]">
                          {formatPrice(product.price)}
                        </p>

                        {product.compareAtPrice ? (
                          <p className="text-[10px] text-[#99948a] line-through">
                            {formatPrice(product.compareAtPrice)}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* =================================================
                        ACCIONES
                    ================================================= */}
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#eeeae0] pt-3">
                      <button
                        onClick={() => loadProduct(product)}
                        className="group/edit inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e4dfd0] bg-white px-2 py-2 text-[11px] font-bold text-[#141414] transition-all duration-200 hover:border-[#2754F5]/30 hover:bg-[#f8faff] hover:text-[#2754F5]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-3.5 w-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 3.487a2.121 2.121 0 013 3L7.5 18.85 3 20l1.15-4.5L16.862 3.487z"
                          />
                        </svg>

                        Editar
                      </button>

                      <button
                        onClick={() => remove(product.id)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-transparent px-2 py-2 text-[11px] font-bold text-[#77736b] transition-all duration-200 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-3.5 w-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
                          />
                        </svg>

                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* =========================================================
              BOTÓN MOSTRAR MÁS / PAGINACIÓN
          ========================================================= */}
          {catalogVisibleCount < filteredProducts.length ? (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#eeeae0] bg-[#faf9f7] p-6 text-center">
              <p className="text-xs font-medium text-[#77736b]">
                Mostrando <span className="font-bold text-[#141414]">{visibleProducts.length}</span> de{" "}
                <span className="font-bold text-[#141414]">{filteredProducts.length}</span> zapatillas
              </p>

              {/* Barra de progreso */}
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-[#e4dfd0]">
                <div
                  className="h-full rounded-full bg-[#2754F5] transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (visibleProducts.length / filteredProducts.length) * 100)}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCatalogVisibleCount((prev) => prev + 16)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#141414] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#2754F5] hover:shadow-[0_8px_20px_rgba(39,84,245,0.25)] active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  Mostrar más zapatillas (+16)
                </button>

                <button
                  type="button"
                  onClick={() => setCatalogVisibleCount(filteredProducts.length)}
                  className="rounded-xl border border-[#e4dfd0] bg-white px-4 py-2.5 text-xs font-bold text-[#77736b] transition-all hover:border-[#141414] hover:text-[#141414]"
                >
                  Mostrar todas ({filteredProducts.length})
                </button>
              </div>
            </div>
          ) : filteredProducts.length > 16 ? (
            <div className="mt-8 text-center text-xs font-medium text-[#77736b]">
              Mostrando todos los modelos disponibles ({filteredProducts.length}).
            </div>
          ) : null}
        </div>
      </main>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-xl border-2 border-[#141414] bg-white overflow-hidden">
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

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeae0] bg-[#fbf9f5] px-6 py-3">
              <input
                type="text"
                value={gallerySearch}
                onChange={(e) => {
                  setGallerySearch(e.target.value);
                  setGalleryVisibleCount(48);
                }}
                placeholder="Buscar por número o nombre (ej: 001, 054)..."
                className="w-full sm:w-80 rounded-lg border border-[#e4dfd0] bg-white px-3 py-2 text-sm outline-none focus:border-[#141414]"
              />
              <div className="text-xs text-[#6b675f]">
                {form.images.length} foto{form.images.length === 1 ? "" : "s"} seleccionada{form.images.length === 1 ? "" : "s"} para este producto
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingGallery ? (
                <div className="py-20 text-center text-sm text-[#6b675f]">Cargando imágenes de zapatillas...</div>
              ) : filteredGallery.length === 0 ? (
                <div className="py-20 text-center text-sm text-[#6b675f]">
                  No se encontraron fotos que coincidan con la búsqueda.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {visibleGallery.map((imgSrc) => {
                      const isSelected = form.images.includes(imgSrc);
                      const selectedIndex = form.images.indexOf(imgSrc);
                      const fileName = imgSrc.split("/").pop();

                      return (
                        <div
                          key={imgSrc}
                          onClick={() => toggleImageSelection(imgSrc)}
                          className={`group relative cursor-pointer overflow-hidden rounded-lg border transition ${isSelected
                            ? "border-2 border-[#141414] bg-[#141414]/5"
                            : "border-[#e4dfd0] bg-white hover:border-[#6b675f]"
                            }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSrc}
                            alt={fileName || ""}
                            className="aspect-square w-full object-cover transition group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                          {isSelected ? (
                            <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#141414] text-xs font-bold text-white">
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

                  {galleryVisibleCount < filteredGallery.length && (
                    <div className="mt-8 flex flex-col items-center justify-center gap-2 border-t border-[#eeeae0] pt-6">
                      <p className="text-xs text-[#77736b]">
                        Mostrando <span className="font-bold text-[#141414]">{visibleGallery.length}</span> de{" "}
                        <span className="font-bold text-[#141414]">{filteredGallery.length}</span> fotos
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setGalleryVisibleCount((c) => c + 48)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#141414] px-5 py-2 text-xs font-bold text-white transition hover:bg-black shadow-sm"
                        >
                          Cargar más fotos (+48)
                        </button>
                        <button
                          type="button"
                          onClick={() => setGalleryVisibleCount(filteredGallery.length)}
                          className="rounded-full border border-[#e4dfd0] bg-white px-4 py-2 text-xs font-bold text-[#77736b] transition hover:border-[#141414] hover:text-[#141414]"
                        >
                          Cargar todas
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#e4dfd0] bg-[#fbf9f5] px-6 py-4">
              <span className="text-xs text-[#77736b]">
                {visibleGallery.length} de {filteredGallery.length} fotos mostradas ({gallery.length} en total)
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
          border-radius: 0.5rem;
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