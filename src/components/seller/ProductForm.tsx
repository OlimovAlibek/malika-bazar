'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

const BRANDS  = ['Apple', 'Samsung', 'Xiaomi', 'Redmi', 'Realme', 'OPPO', 'Vivo', 'OnePlus', 'Huawei']
const STORAGES: (number | null)[] = [32, 64, 128, 256, 512, null]
const MAX_IMAGES = 20

type Slot = { preview: string; file: File | null }

export type FormValues = {
  brand:       string
  model:       string
  storage_gb:  number | null
  condition:   'new' | 'used'
  price_uzs:   number | ''
  description: string
  is_active:   boolean
  images:      string[]
  imageFiles:  (File | null)[]
}

type Props = {
  defaultValues?: Partial<{
    brand:       string
    model:       string
    storage_gb:  number | null
    condition:   'new' | 'used'
    price_uzs:   number | ''
    description: string
    is_active:   boolean
    images:      string[]
  }>
  onSubmit:     (values: FormValues) => void
  isLoading?:   boolean
  submitLabel?: string
  cancelHref?:  string
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Saqlash',
  cancelHref  = '/seller/products',
}: Props) {
  const [brand,       setBrand]       = useState(defaultValues?.brand       ?? 'Apple')
  const [model,       setModel]       = useState(defaultValues?.model       ?? '')
  const [storage,     setStorage]     = useState<number | null>(defaultValues?.storage_gb ?? 128)
  const [condition,   setCondition]   = useState<'new' | 'used'>(defaultValues?.condition ?? 'new')
  const [price,       setPrice]       = useState<number | ''>(defaultValues?.price_uzs ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [isActive,    setIsActive]    = useState(defaultValues?.is_active   ?? true)
  const [error,       setError]       = useState('')

  // ── Rasmlar ──────────────────────────────────────────────────
  const [slots, setSlots] = useState<Slot[]>(() =>
    (defaultValues?.images ?? []).map(url => ({ preview: url, file: null }))
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setSlots(prev => {
      const available = MAX_IMAGES - prev.length
      if (available <= 0) return prev
      const newSlots: Slot[] = files.slice(0, available).map(file => ({
        preview: URL.createObjectURL(file),
        file,
      }))
      return [...prev, ...newSlots]
    })
    e.target.value = ''
  }

  function removeSlot(i: number) {
    setSlots(prev => {
      const next = [...prev]
      if (next[i].file) URL.revokeObjectURL(next[i].preview)
      next.splice(i, 1)
      return next
    })
  }

  // ── Submit ───────────────────────────────────────────────────
  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!model.trim())            { setError('Model nomini kiriting'); return }
    if (!price || Number(price) <= 0) { setError('Narxni kiriting'); return }
    setError('')
    onSubmit({
      brand,
      model:       model.trim(),
      storage_gb:  storage,
      condition,
      price_uzs:   Number(price),
      description: description.trim(),
      is_active:   isActive,
      images:      slots.map(s => s.preview),
      imageFiles:  slots.map(s => s.file),
    })
  }

  const canAddMore = slots.length < MAX_IMAGES

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-6">

        {/* ═══ CHAP: Rasmlar ═══════════════════════════════════ */}
        <div className="space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Rasmlar</p>
            <span className={`text-xs font-black tabular-nums ${
              slots.length >= MAX_IMAGES ? 'text-amber-500' : 'text-gray-400'
            }`}>
              {slots.length} / {MAX_IMAGES}
            </span>
          </div>

          {/* ── Birinchi (asosiy) rasm — katta slot ─────────── */}
          <div
            onClick={() => {
              if (slots.length === 0) fileInputRef.current?.click()
            }}
            className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed transition-colors ${
              slots[0]
                ? 'border-[#FF9900] cursor-default'
                : 'border-gray-200 dark:border-gray-700 hover:border-[#FF9900] cursor-pointer'
            } bg-gray-50 dark:bg-gray-800`}
          >
            {slots[0] ? (
              <>
                <Image
                  src={slots[0].preview}
                  alt="Asosiy rasm"
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-contain p-4"
                  unoptimized={!!slots[0].file}
                />
                {/* Asosiy badge */}
                <span className="absolute top-2 left-2 text-[10px] font-black bg-[#FF9900] text-gray-900 px-2 py-0.5 rounded-full leading-none shadow">
                  ★ Asosiy
                </span>
                {/* O'chirish tugmasi */}
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); removeSlot(0) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors active:scale-90"
                  aria-label="O'chirish"
                >
                  <XIcon size={14} />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 text-gray-300 dark:text-gray-600 hover:text-[#FF9900] transition-colors">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-xs font-semibold text-gray-400">Asosiy rasm qo'shish</span>
                <span className="text-[11px] text-gray-300 dark:text-gray-600">yoki pastdagi + tugmani bosing</span>
              </div>
            )}
          </div>

          {/* ── Qolgan rasmlar — kichik grid ──────────────────── */}
          {(slots.length > 1 || canAddMore) && (
            <div className="grid grid-cols-4 gap-2">
              {/* slots[1 .. n] */}
              {slots.slice(1).map((slot, idx) => {
                const i = idx + 1   // haqiqiy index
                return (
                  <div key={i} className="relative aspect-square group">
                    <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <Image
                        src={slot.preview}
                        alt={`Rasm ${i + 1}`}
                        fill
                        sizes="80px"
                        className="object-contain p-1.5"
                        unoptimized={!!slot.file}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSlot(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors active:scale-90"
                      aria-label="O'chirish"
                    >
                      <XIcon size={10} />
                    </button>
                  </div>
                )
              })}

              {/* + qo'shish tugmasi */}
              {canAddMore && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#FF9900] flex flex-col items-center justify-center gap-1 text-gray-300 dark:text-gray-600 hover:text-[#FF9900] transition-colors bg-gray-50 dark:bg-gray-800 active:scale-95"
                  aria-label="Rasm qo'shish"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-[9px] font-bold">Qo'shish</span>
                </button>
              )}
            </div>
          )}

          {/* Asosiy "Rasm qo'shish" tugmasi (birinchi rasmdan keyin ham ko'rinadi) */}
          {canAddMore && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-[#FF9900]/10 hover:text-[#FF9900] text-gray-500 dark:text-gray-400 text-sm font-semibold transition-colors border border-dashed border-gray-200 dark:border-gray-700 hover:border-[#FF9900] active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {slots.length === 0 ? "Rasm qo'shish" : `Yana rasm qo'shish (${MAX_IMAGES - slots.length} ta qoldi)`}
            </button>
          )}

          {slots.length >= MAX_IMAGES && (
            <p className="text-xs text-amber-600 dark:text-amber-400 text-center font-semibold">
              Maksimal rasm soni ({MAX_IMAGES} ta) ga yetdi
            </p>
          )}

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Ko'pi bilan <b>{MAX_IMAGES}</b> ta rasm. Bir vaqtda bir nechta tanlash mumkin.
            Birinchi rasm katalogda asosiy sifatida ko'rinadi.
          </p>

          {/* Hidden file input — multiple */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
        </div>

        {/* ═══ O'NG: Form maydonlari ═══════════════════════════ */}
        <div className="space-y-5">

          {/* Asosiy ma'lumotlar */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Asosiy ma'lumotlar</p>
            <Field label="Brend">
              <div className="flex flex-wrap gap-2">
                {BRANDS.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${
                      brand === b
                        ? 'bg-[#FF9900] text-gray-900 border-[#FF9900]'
                        : 'bg-white dark:bg-[#16161F] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </Field>
            <div className="mt-4">
              <Field label="Model" required>
                <input
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="Masalan: iPhone 15 Pro Max"
                  className="w-full h-11 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF9900] transition-colors placeholder:text-gray-400"
                />
              </Field>
            </div>
          </div>

          {/* Texnik ma'lumotlar */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Texnik ma'lumotlar</p>
            <Field label="Xotira">
              <div className="flex flex-wrap gap-2">
                {STORAGES.map(s => (
                  <button
                    key={s ?? 'none'}
                    type="button"
                    onClick={() => setStorage(s)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${
                      storage === s
                        ? 'bg-[#FF9900] text-gray-900 border-[#FF9900]'
                        : 'bg-white dark:bg-[#16161F] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                    }`}
                  >
                    {s ? `${s} GB` : "Ko'rsatilmagan"}
                  </button>
                ))}
              </div>
            </Field>
            <div className="mt-4">
              <Field label="Holati">
                <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 w-fit">
                  <button
                    type="button"
                    onClick={() => setCondition('new')}
                    className={`px-5 py-2.5 text-sm font-bold transition-all ${
                      condition === 'new'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white dark:bg-[#16161F] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Yangi
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition('used')}
                    className={`px-5 py-2.5 text-sm font-bold transition-all ${
                      condition === 'used'
                        ? 'bg-amber-400 text-amber-900'
                        : 'bg-white dark:bg-[#16161F] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Ishlatilgan
                  </button>
                </div>
              </Field>
            </div>
          </div>

          {/* Tavsif */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Tavsif</p>
            <Field label="Mahsulot tavsifi">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Mahsulot haqida qo'shimcha ma'lumot (ixtiyoriy)"
                rows={3}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF9900] transition-colors placeholder:text-gray-400 resize-none"
              />
            </Field>
          </div>

          {/* Narx */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Narx</p>
            <Field label="Narx (so'm)" required>
              <div className="flex items-center h-11 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#FF9900] transition-colors">
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="12 000 000"
                  min={0}
                  className="flex-1 px-4 text-sm bg-transparent text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
                />
                <span className="px-4 text-sm font-semibold text-gray-400 border-l border-gray-200 dark:border-gray-700 h-full flex items-center bg-white dark:bg-[#16161F] shrink-0">
                  so'm
                </span>
              </div>
            </Field>
          </div>

          {/* Ko'rinish toggle */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Ko'rinish</p>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Mahsulot holati</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isActive ? "Do'konda ko'rinadi" : 'Hozircha yashirin'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(v => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors active:scale-95 ${isActive ? 'bg-[#FF9900]' : 'bg-gray-300 dark:bg-gray-600'}`}
                role="switch"
                aria-checked={isActive}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${isActive ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div className="mt-6 space-y-3">
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <a
            href={cancelHref}
            className="flex-1 flex items-center justify-center h-12 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95"
          >
            Bekor qilish
          </a>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl bg-[#FF9900] hover:bg-[#e8a000] active:bg-[#d4940a] text-gray-900 text-sm font-black disabled:opacity-60 disabled:cursor-not-allowed transition active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Saqlanmoqda...
              </span>
            ) : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}

/* ── Yordamchi komponentlar ──────────────────────────────── */

function Field({
  label,
  required,
  children,
}: {
  label:    string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
        {required && <span className="text-red-400 ml-0.5 normal-case">*</span>}
      </label>
      {children}
    </div>
  )
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
