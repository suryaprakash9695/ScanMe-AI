import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCompare, Loader2, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const DiffBadge = ({ diff }) => {
  if (diff > 0) return <span className="text-green-400 flex items-center gap-1 text-sm font-semibold"><TrendingUp className="w-3 h-3" />+{diff}</span>
  if (diff < 0) return <span className="text-red-400 flex items-center gap-1 text-sm font-semibold"><TrendingDown className="w-3 h-3" />{diff}</span>
  return <span className="text-gray-400 flex items-center gap-1 text-sm"><Minus className="w-3 h-3" />0</span>
}

const ScoreRow = ({ label, s1, s2 }) => {
  const diff = s1 - s2
  const winner = diff > 0 ? 1 : diff < 0 ? 2 : 0
  return (
    <div className="grid grid-cols-3 items-center gap-4 py-3 border-b border-white/5">
      <div className={`text-right text-lg font-bold ${winner === 1 ? 'text-blue-400' : 'text-gray-300'}`}>{s1}</div>
      <div className="text-center text-xs text-gray-500 font-medium">{label}</div>
      <div className={`text-left text-lg font-bold ${winner === 2 ? 'text-purple-400' : 'text-gray-300'}`}>{s2}</div>
    </div>
  )
}

export default function Compare() {
  const [id1, setId1] = useState('')
  const [id2, setId2] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompare = async e => {
    e.preventDefault()
    if (!id1.trim() || !id2.trim()) { setError('Please enter both report IDs'); return }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('report_id_1', id1.trim())
      fd.append('report_id_2', id2.trim())
      const { data } = await axios.post(`${API_URL}/api/compare`, fd)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not load one or both reports. Make sure the IDs are correct.')
    } finally {
      setLoading(false)
    }
  }

  const metrics = result ? [
    { label: 'Overall',     s1: result.candidate_1?.overall_score,  s2: result.candidate_2?.overall_score },
    { label: 'GitHub',      s1: result.score_differences?.github  != null ? result.candidate_1?.overall_score : 0, s2: 0 },
    { label: 'DSA',         s1: result.score_differences?.dsa     != null ? result.candidate_1?.overall_score : 0, s2: 0 },
    { label: 'Resume',      s1: result.score_differences?.resume  != null ? result.candidate_1?.overall_score : 0, s2: 0 },
  ] : []

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <GitCompare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="gradient-text">Compare Candidates</span>
          </h1>
          <p className="text-gray-400">Side-by-side comparison using report IDs from previous analyses</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleCompare}
          className="glass rounded-3xl p-8 mb-6"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {[
              { label: 'Candidate 1 Report ID', val: id1, set: setId1, color: 'focus:border-blue-500', badge: 'bg-blue-500' },
              { label: 'Candidate 2 Report ID', val: id2, set: setId2, color: 'focus:border-purple-500', badge: 'bg-purple-500' },
            ].map((f, i) => (
              <div key={i}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span className={`w-5 h-5 rounded-full ${f.badge} flex items-center justify-center text-xs font-bold`}>{i+1}</span>
                  {f.label}
                </label>
                <input
                  type="text"
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
                  placeholder="e.g. a1b2c3d4"
                  className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none ${f.color} transition-colors`}
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg disabled:opacity-60 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Comparing...
              </span>
            ) : 'Compare Profiles'}
          </button>
        </motion.form>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass rounded-3xl p-8"
            >
              {/* Names header */}
              <div className="grid grid-cols-3 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{result.candidate_1?.name}</div>
                  <div className="text-xs text-gray-500">Candidate 1</div>
                </div>
                <div className="text-center text-gray-500 text-sm font-medium self-center">VS</div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">{result.candidate_2?.name}</div>
                  <div className="text-xs text-gray-500">Candidate 2</div>
                </div>
              </div>

              {/* Overall scores */}
              <div className="grid grid-cols-3 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-blue-400">{result.candidate_1?.overall_score}</div>
                  <div className="text-xs text-gray-400 mt-1">Overall Score</div>
                </div>
                <div className="flex items-center justify-center">
                  <DiffBadge diff={result.candidate_1?.overall_score - result.candidate_2?.overall_score} />
                </div>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-purple-400">{result.candidate_2?.overall_score}</div>
                  <div className="text-xs text-gray-400 mt-1">Overall Score</div>
                </div>
              </div>

              {/* Winner banner */}
              {result.candidate_1?.overall_score !== result.candidate_2?.overall_score && (
                <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10">
                  <span className="font-bold text-lg">
                    🏆 {result.candidate_1?.overall_score > result.candidate_2?.overall_score
                      ? result.candidate_1?.name
                      : result.candidate_2?.name} leads by {Math.abs(result.candidate_1?.overall_score - result.candidate_2?.overall_score)} points
                  </span>
                </div>
              )}

              {/* Score diffs */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3 text-center">Score Differences</h4>
                {Object.entries(result.score_differences || {}).map(([key, diff]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm capitalize text-gray-300">{key}</span>
                    <DiffBadge diff={diff} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tip */}
        {!result && !loading && (
          <div className="text-center text-gray-500 text-sm mt-4">
            💡 Run two analyses first, then paste the report IDs above to compare
          </div>
        )}
      </div>
    </div>
  )
}
