import { useState } from 'react'
import api from '../api/axios'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register({ onSuccess, onSwitch }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.name.trim().length < 2) {
      setError('Nama minimal 2 karakter.')
      return
    }
    if (!emailPattern.test(form.email)) {
      setError('Silakan masukkan alamat email yang valid.')
      return
    }
    if (form.password.length < 8) {
      setError('Kata sandi minimal 8 karakter.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/register', form)
      onSuccess(response.data)
    } catch (err) {
      setError('Pendaftaran gagal. Silakan coba kembali.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center px-6 pb-16">
      <section className="w-full max-w-md rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-white">Daftar Akun Baru</h2>
        <p className="mt-2 text-sm text-slate-400">Lengkapi data untuk mulai memetakan jalur karir.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Nama Lengkap
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-700/60 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
              placeholder="Nama lengkap Anda"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Alamat Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-700/60 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
              placeholder="contoh@email.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Kata Sandi
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-700/60 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
              placeholder="Minimal 8 karakter"
            />
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Sedang memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Sudah punya akun?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold text-indigo-300 hover:text-white"
          >
            Masuk di sini
          </button>
        </p>
      </section>
    </main>
  )
}
