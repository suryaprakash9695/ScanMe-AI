import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useLocation, Link } from 'react-router-dom'
import {
  Download, TrendingUp, Award, Github, Code2, FileText,
  Linkedin, Globe, Target, AlertCircle, Share2, ArrowLeft,
  CheckCircle, XCircle, Zap, BarChart3
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend
} from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const API_URL = import.meta.env.VITE_API_URL || ''

/* ── Skeleton ── */
const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
)

const SkeletonDashboard = () => (
  <div className="space-y-6">
    <Skeleton className="h-48 w-full rounded-3xl" />
    <div className="grid md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
    </div>
    <Skeleton className="h-64 rounded-2xl" />
  </div>
)

/* ── Score ring ── */
const ScoreRing = ({ score, size = 160 }) => {
  const r = 60
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r}
          stroke="url(#scoreGrad)" strokeWidth="10" fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold gradient-text">{score}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  )
}

/* ── Score card ── */
const ScoreCard = ({ icon: Icon, label, score, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass rounded-2xl p-5 card-hover"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-sm">{label}</span>
      </div>
      <span className="text-2xl font-extrabold gradient-text">{score}</span>
    </div>
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
      />
    </div>
  </motion.div>
)

/* ── Badge ── */
const getBadge = score => {
  if (score >= 90) return { label: 'Elite Candidate',    color: 'from-yellow-400 to-orange-500', emoji: '🏆', border: 'border-yellow-500/40' }
  if (score >= 75) return { label: 'Strong Candidate',   color: 'from-green-400 to-emerald-500', emoji: '⭐', border: 'border-green-500/40' }
  if (score >= 60) return { label: 'Placement Ready',    color: 'from-blue-400 to-cyan-500',     emoji: '✨', border: 'border-blue-500/40' }
  if (score >= 40) return { label: 'Growing Developer',  color: 'from-purple-400 to-pink-500',   emoji: '🌱', border: 'border-purple-500/40' }
  return               { label: 'Beginner',              color: 'from-gray-400 to-gray-500',     emoji: '🎯', border: 'border-gray-500/40' }
}

const CHART_COLORS = ['#3b82f6','#8b5cf6','#ec4899','#10b981','#f59e0b','#06b6d4']

const tooltipStyle = {
  contentStyle: { backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' },
  cursor: { fill: 'rgba(255,255,255,0.05)' }
}

/* ══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { reportId } = useParams()
  const location = useLocation()
  const [data, setData] = useState(location.state?.reportData || null)
  const [loading, setLoading] = useState(!data)
  const [exporting, setExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const dashRef = useRef(null)

  useEffect(() => {
    if (!data && reportId) {
      fetch(`${API_URL}/api/report/${reportId}`)
        .then(r => r.json())
        .then(d => { setData(d); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [reportId, data])

  const handleDownloadPDF = async () => {
    if (!dashRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(dashRef.current, {
        scale: 2, backgroundColor: '#030712', useCORS: true, logging: false
      })
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pw = pdf.internal.pageSize.getWidth()
      const ph = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pw / canvas.width, ph / canvas.height)
      pdf.addImage(img, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio)
      pdf.save(`ScanMe-AI-${data.candidate.name.replace(/\s+/g,'-')}-${reportId}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/dashboard/${reportId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="pt-24 pb-20 container mx-auto px-4 max-w-6xl">
      <SkeletonDashboard />
    </div>
  )

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass rounded-3xl p-12 text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
        <p className="text-gray-400 mb-6">This report may have expired or the ID is invalid.</p>
        <Link to="/analyze" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold">
          Start New Analysis
        </Link>
      </div>
    </div>
  )

  const { candidate, scores, analysis, suggestions, action_plan } = data
  const badge = getBadge(scores.overall_score)

  const radarData = [
    { subject: 'GitHub',      value: scores.github_score },
    { subject: 'DSA',         value: scores.dsa_score },
    { subject: 'Resume',      value: scores.resume_score },
    { subject: 'LinkedIn',    value: scores.linkedin_score },
    { subject: 'Portfolio',   value: scores.portfolio_score },
    { subject: 'Consistency', value: scores.consistency_score },
  ]

  const barData = radarData.map(d => ({ name: d.subject, Score: d.value }))

  const langData = data.profile_data?.github?.languages
    ? Object.entries(data.profile_data.github.languages)
        .sort((a,b) => b[1]-a[1])
        .slice(0,6)
        .map(([name, value]) => ({ name, value }))
    : []

  const scoreCards = [
    { icon: Github,    label: 'GitHub',      score: scores.github_score },
    { icon: Code2,     label: 'DSA',         score: scores.dsa_score },
    { icon: FileText,  label: 'Resume',      score: scores.resume_score },
    { icon: Linkedin,  label: 'LinkedIn',    score: scores.linkedin_score },
    { icon: Globe,     label: 'Portfolio',   score: scores.portfolio_score },
    { icon: TrendingUp,label: 'Consistency', score: scores.consistency_score },
  ]

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Top action bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Link to="/analyze" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> New Analysis
          </Link>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 glass glass-hover rounded-xl text-sm font-medium"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Share Link'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleDownloadPDF}
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold disabled:opacity-60 hover:shadow-lg hover:shadow-blue-500/40 transition-all"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Download PDF'}
            </motion.button>
          </div>
        </div>

        {/* ── Printable content ── */}
        <div ref={dashRef} className="space-y-6">

          {/* Header card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 md:p-10 gradient-bg"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-1">{candidate.name}</h1>
                <p className="text-gray-400 mb-4">{candidate.email}</p>
                <div className={`inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r ${badge.color} rounded-full font-bold text-sm shadow-lg`}>
                  {badge.emoji} {badge.label}
                </div>
                <div className="mt-4 text-lg font-semibold text-blue-300">
                  {scores.hiring_readiness}% Hiring Ready
                </div>
              </div>
              <ScoreRing score={scores.overall_score} size={160} />
            </div>
          </motion.div>

          {/* Score cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scoreCards.map((c, i) => (
              <ScoreCard key={c.label} {...c} delay={i * 0.07} />
            ))}
          </div>

          {/* Charts row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" /> Skills Radar
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis stroke="#374151" tick={{ fontSize: 10 }} domain={[0,100]} />
                  <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Bar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" /> Platform Scores
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barSize={28}>
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} domain={[0,100]} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="Score" radius={[6,6,0,0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Language pie (only if GitHub data exists) */}
          {langData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4">🌐 Language Distribution</h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={langData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                      {langData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {langData.map((l, i) => (
                    <div key={l.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-gray-300">{l.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Strengths & Weaknesses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-400" /> Profile Analysis
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Strengths
                </h4>
                <ul className="space-y-3">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-4 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Areas to Improve
                </h4>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-orange-400 mt-0.5 shrink-0">→</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6">📋 Prioritised Action Items</h3>
            <div className="space-y-6">
              {[
                { key: 'high',   label: '🔴 High Priority',   cls: 'border-red-500/40 bg-red-500/5' },
                { key: 'medium', label: '🟡 Medium Priority',  cls: 'border-yellow-500/40 bg-yellow-500/5' },
                { key: 'low',    label: '🔵 Low Priority',     cls: 'border-blue-500/40 bg-blue-500/5' },
              ].map(({ key, label, cls }) => (
                <div key={key} className={`rounded-xl p-5 border ${cls}`}>
                  <h4 className="font-semibold mb-3 text-sm">{label}</h4>
                  <ul className="space-y-2">
                    {suggestions[key].map((item, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="mt-0.5 shrink-0">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6">🗓️ 6-Week Action Plan</h3>
            <div className="space-y-5">
              {Object.entries(action_plan).map(([week, tasks], i) => (
                <div key={week} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    {i < Object.keys(action_plan).length - 1 && (
                      <div className="w-0.5 flex-1 bg-white/10 mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h4 className="font-bold text-blue-300 mb-2">{week}</h4>
                    <ul className="space-y-1.5">
                      {tasks.map((t, j) => (
                        <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Future score */}
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-2xl border border-blue-500/25 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Estimated score after completing this plan</p>
                <p className="text-5xl font-extrabold gradient-text">
                  {Math.min(100, scores.overall_score + 15)}
                  <span className="text-xl text-gray-400 font-normal"> / 100</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Potential improvement</p>
                <p className="text-3xl font-bold text-green-400">+{Math.min(15, 100 - scores.overall_score)} pts</p>
              </div>
            </div>
          </motion.div>

          {/* Best roles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" /> Best Roles for You
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {getRoles(scores).map((role, i) => (
                <div key={i} className="glass rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-xl">
                    {role.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{role.title}</p>
                    <p className="text-xs text-gray-400">{role.match}% match</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>{/* end printable */}
      </div>
    </div>
  )
}

/* ── helpers ── */
function getRoles(scores) {
  const roles = []
  if (scores.github_score >= 60 && scores.dsa_score >= 60)
    roles.push({ emoji: '💻', title: 'Software Engineer', match: Math.min(95, scores.overall_score + 10) })
  if (scores.dsa_score >= 70)
    roles.push({ emoji: '🧮', title: 'Backend Developer', match: Math.min(90, scores.dsa_score + 15) })
  if (scores.github_score >= 50)
    roles.push({ emoji: '🎨', title: 'Full Stack Developer', match: Math.min(88, scores.github_score + 12) })
  if (scores.resume_score >= 70)
    roles.push({ emoji: '🚀', title: 'Product Engineer', match: Math.min(85, scores.resume_score + 5) })
  if (scores.dsa_score >= 80)
    roles.push({ emoji: '🔬', title: 'ML / AI Engineer', match: Math.min(82, scores.dsa_score) })
  if (scores.portfolio_score >= 60)
    roles.push({ emoji: '🌐', title: 'Frontend Developer', match: Math.min(80, scores.portfolio_score + 15) })
  // fallback
  if (roles.length === 0)
    roles.push({ emoji: '🎯', title: 'Junior Developer', match: 60 })
  return roles.slice(0, 6)
}
