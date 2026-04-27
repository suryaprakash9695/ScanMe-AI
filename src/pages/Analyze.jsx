import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Loader2, Github, Linkedin, Code2, Trophy,
  Globe, CheckCircle, AlertCircle, X, FileText, Zap
} from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const platforms = [
  { name: 'github',     label: 'GitHub',      icon: Github,   placeholder: 'e.g. octocat',      hint: 'Username only' },
  { name: 'linkedin',   label: 'LinkedIn',    icon: Linkedin, placeholder: 'e.g. john-doe',     hint: 'Username only' },
  { name: 'leetcode',   label: 'LeetCode',    icon: Code2,    placeholder: 'e.g. leetcoder',    hint: 'Username only' },
  { name: 'codeforces', label: 'Codeforces',  icon: Trophy,   placeholder: 'e.g. tourist',      hint: 'Handle' },
  { name: 'codechef',   label: 'CodeChef',    icon: Code2,    placeholder: 'e.g. chef123',      hint: 'Username only' },
  { name: 'gfg',        label: 'GeeksforGeeks', icon: Code2,  placeholder: 'e.g. geek123',      hint: 'Username only' },
  { name: 'hackerrank', label: 'HackerRank',  icon: Trophy,   placeholder: 'e.g. hacker123',    hint: 'Username only' },
  { name: 'portfolio',  label: 'Portfolio',   icon: Globe,    placeholder: 'https://yoursite.com', hint: 'Full URL' },
]

const steps = [
  'Fetching GitHub data...',
  'Analyzing DSA platforms...',
  'Parsing resume...',
  'Checking portfolio...',
  'Running AI scoring engine...',
  'Generating your report...',
]

export default function Analyze() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    github: '', linkedin: '', leetcode: '', codeforces: '',
    codechef: '', gfg: '', hackerrank: '', portfolio: ''
  })
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [toast, setToast] = useState(null) // { type: 'error'|'success', msg }

  const showToast = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleFile = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') { showToast('error', 'Please upload a PDF file'); return }
    if (file.size > 10 * 1024 * 1024) { showToast('error', 'File too large (max 10 MB)'); return }
    setResume(file)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const hasAny = Object.values(form).some(v => v.trim())
    if (!hasAny) { showToast('error', 'Please enter at least one profile username'); return }

    setLoading(true)
    setProgress(0)
    setStepIdx(0)

    // Animate progress + steps
    const total = steps.length
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + (90 / total)
        if (next >= 90) clearInterval(interval)
        return Math.min(next, 90)
      })
      setStepIdx(i => Math.min(i + 1, total - 1))
    }, 1200)

    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v.trim()) fd.append(k, v.trim()) })
      if (resume) fd.append('resume', resume)

      const { data } = await axios.post(`${API_URL}/api/analyze`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 90000,
      })

      clearInterval(interval)
      setProgress(100)

      setTimeout(() => {
        navigate(`/dashboard/${data.report_id}`, { state: { reportData: data } })
      }, 600)

    } catch (err) {
      clearInterval(interval)
      setLoading(false)
      setProgress(0)
      setStepIdx(0)
      const msg = err.response?.data?.detail || 'Analysis failed. Please check your inputs and try again.'
      showToast('error', msg)
    }
  }

  const filledCount = Object.values(form).filter(v => v.trim()).length

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-red-500/90 text-white'
                : 'bg-green-500/90 text-white'
            }`}
          >
            {toast.type === 'error'
              ? <AlertCircle className="w-4 h-4 shrink-0" />
              : <CheckCircle className="w-4 h-4 shrink-0" />}
            {toast.msg}
            <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-blue-300 mb-6 border border-blue-500/30">
            <Zap className="w-4 h-4" />
            Free · No login required · Results in &lt; 60s
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            <span className="gradient-text">Analyze Your Profile</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Enter your usernames below — the more you add, the better your score
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-6 md:p-10"
        >
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-400">
              {filledCount} / {platforms.length} platforms added
            </span>
            <div className="flex gap-1">
              {platforms.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                    i < filledCount ? 'bg-blue-500' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Platform inputs */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {platforms.map((p, i) => {
              const Icon = p.icon
              const filled = form[p.name].trim().length > 0
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <label className="flex items-center justify-between text-sm font-medium mb-1.5">
                    <span className="text-gray-300">{p.label}</span>
                    <span className="text-xs text-gray-500">{p.hint}</span>
                  </label>
                  <div className="relative">
                    <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${filled ? 'text-blue-400' : 'text-gray-500'}`} />
                    <input
                      type="text"
                      name={p.name}
                      value={form[p.name]}
                      onChange={handleChange}
                      placeholder={p.placeholder}
                      disabled={loading}
                      className={`w-full pl-10 pr-10 py-3 bg-white/5 border rounded-xl text-sm focus:outline-none transition-all duration-200 disabled:opacity-50 ${
                        filled
                          ? 'border-blue-500/60 focus:border-blue-400'
                          : 'border-white/10 focus:border-white/30'
                      }`}
                    />
                    {filled && (
                      <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Resume upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Resume <span className="text-gray-500">(PDF, max 10 MB — optional but recommended)</span>
            </label>
            <input type="file" accept=".pdf" onChange={handleFile} className="hidden" id="resume-upload" disabled={loading} />
            <label
              htmlFor="resume-upload"
              className={`flex items-center justify-center gap-3 w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                resume
                  ? 'border-green-500/60 bg-green-500/5'
                  : 'border-white/15 hover:border-blue-500/50 hover:bg-white/5'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {resume ? (
                <>
                  <FileText className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">{resume.name}</span>
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); setResume(null) }}
                    className="ml-auto text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 text-sm">Click to upload your resume PDF</span>
                </>
              )}
            </label>
          </div>

          {/* Loading progress */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-300 font-medium flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {steps[stepIdx]}
                    </span>
                    <span className="text-sm font-bold text-blue-400">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="flex gap-1 mt-3">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                          i <= stepIdx ? 'bg-blue-500' : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing your profile...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Analyze Me
              </span>
            )}
          </motion.button>

          <p className="text-center text-xs text-gray-500 mt-4">
            🔒 Your data is processed securely and never stored permanently
          </p>
        </motion.form>
      </div>
    </div>
  )
}
