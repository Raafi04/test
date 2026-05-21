import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

const emptyForm = { title: '', description: '', year: '' }

export default function Home({ onLogout }) {
  const [timelines, setTimelines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const fetchTimelines = async () => {
      try {
        setLoading(true)
        const response = await api.get('/timelines')
        setTimelines(response.data)
      } catch (err) {
        setError('Gagal memuat data timeline. Silakan coba kembali.')
      } finally {
        setLoading(false)
      }
    }

    fetchTimelines()
  }, [])

  const sortedTimelines = useMemo(() => {
    return [...timelines].sort((a, b) => Number(a.year) - Number(b.year))
  }, [timelines])

  const openCreateModal = () => {
    setForm(emptyForm)
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (timeline) => {
    setForm({
      title: timeline.title,
      description: timeline.description,
      year: timeline.year,
    })
    setEditingId(timeline.id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const payload = {
      ...form,
      year: Number(form.year),
    }

    if (editingId) {
      const previous = timelines.find((item) => item.id === editingId)
      setTimelines((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item))
      )

      try {
        const response = await api.put(`/timelines/${editingId}`, payload)
        setTimelines((prev) =>
          prev.map((item) => (item.id === editingId ? response.data : item))
        )
        closeModal()
      } catch (err) {
        if (previous) {
          setTimelines((prev) =>
            prev.map((item) => (item.id === editingId ? previous : item))
          )
        }
        setError('Gagal memperbarui data. Periksa kembali isian Anda.')
      }

      return
    }

    const tempId = `temp-${Date.now()}`
    const optimistic = {
      id: tempId,
      ...payload,
    }

    setTimelines((prev) => [optimistic, ...prev])

    try {
      const response = await api.post('/timelines', payload)
      setTimelines((prev) =>
        prev.map((item) => (item.id === tempId ? response.data : item))
      )
      closeModal()
    } catch (err) {
      setTimelines((prev) => prev.filter((item) => item.id !== tempId))
      setError('Gagal menambahkan data. Periksa kembali isian Anda.')
    }
  }

  const handleDelete = async (id) => {
    const previous = timelines
    setTimelines((prev) => prev.filter((item) => item.id !== id))

    try {
      await api.delete(`/timelines/${id}`)
    } catch (err) {
      setTimelines(previous)
      setError('Gagal menghapus data.')
    }
  }

  const handleLogoutClick = async () => {
    try {
      await api.post('/logout')
    } finally {
      onLogout()
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-slate-100">
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Jalur Karir</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Timeline Karir</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              Susun perjalanan karir Anda secara rapi dan profesional.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
            >
              [+] Tambah Pencapaian Karir
            </button>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="rounded-full border border-slate-600/60 px-5 py-2 text-sm text-slate-300 transition hover:border-slate-400"
            >
              Keluar
            </button>
          </div>
        </div>

        {error ? <p className="mt-6 text-sm text-rose-300">{error}</p> : null}

        {loading ? (
          <p className="mt-10 text-sm text-slate-400">Memuat data timeline...</p>
        ) : null}

        {!loading && sortedTimelines.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-slate-700/40 bg-slate-900/40 p-10 text-center">
            <p className="text-sm text-slate-400">
              Belum ada data timeline. Mulai petakan jalur karir Anda sekarang!
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-6 rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              [+] Tambah Pencapaian Karir
            </button>
          </div>
        ) : null}

        {sortedTimelines.length > 0 ? (
          <div className="relative mt-16">
            <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 md:left-12 md:block" />
            <div>
              {sortedTimelines.map((timeline) => {
                const descriptionLength = timeline.description?.length ?? 0
                const titleLength = timeline.title?.length ?? 0
                const isMajor = descriptionLength > 120 || titleLength > 28
                const densityClass = isMajor ? 'md:p-7 border-indigo-500/20' : 'md:p-5'

                return (
                  <article key={timeline.id} className="group relative">
                    <div className="ml-16 md:ml-24">
                      <div className="absolute -left-3 top-6 flex h-7 w-7 items-center justify-center rounded-full border-2 border-indigo-500 bg-slate-900 shadow-[0_0_15px_rgba(99,102,241,0.5)] md:-left-4">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.9)]" />
                      </div>
                      <div
                        className={`mb-8 relative rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/60 ${densityClass}`}
                      >
                        <p className="mb-1 text-xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                          {timeline.year}
                        </p>
                        <h3 className="text-lg font-semibold text-slate-100">
                          {timeline.title}
                        </h3>
                        <p className="mt-3 text-sm text-slate-300">
                          {timeline.description}
                        </p>

                        <div className="mt-6 flex justify-end">
                          <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(timeline)}
                              className="rounded-full border border-slate-600/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-indigo-400"
                            >
                              Ubah
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(timeline.id)}
                              className="rounded-full border border-rose-500/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-200 transition hover:border-rose-400"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        ) : null}
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6 py-10 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {editingId ? 'Ubah Informasi Pencapaian' : 'Tambah Pencapaian Baru'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {editingId ? 'Perbarui detail pencapaian Anda' : 'Catat pencapaian terbaru Anda'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-700/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300 transition hover:border-slate-500"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Nama Pekerjaan / Posisi / Instansi
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
                  placeholder="Contoh: Siswa RPL SMKN 2 Buduran"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Deskripsi Singkat / Pencapaian
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="mt-2 min-h-[110px] w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
                  placeholder="Jelaskan keahlian atau tugas yang Anda pelajari..."
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Tahun Pelaksanaan
                </label>
                <input
                  name="year"
                  type="number"
                  value={form.year}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
                  placeholder="Contoh: 2026"
                  min="1900"
                  max="2100"
                  required
                />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-slate-600/60 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
                >
                  {editingId ? 'Simpan Perubahan' : 'Kirim Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  )
}
