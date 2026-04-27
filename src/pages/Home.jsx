import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Zap, Github, Code2, Award, Target, TrendingUp, Shield,
  FileText, Globe, BarChart3, Download, Users, ArrowRight
} from 'lucide-react'

/* ── tiny helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

const ScoreBadge = ({ label, score, color }) => (
  <div className={`glass rounded-2xl p-4 flex flex-col items-center gap-1 border ${color}`}>
    <span className="text-2xl font-bold gradient-text">{score}</span>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
)

/* ── component ── */
export default function Home() {
  const features = [
    { icon: Github,    title: 'GitHub Deep Scan',      desc: 'Repos, stars, languages, activity & README quality' },
    { icon: Code2,     title: 'DSA Platform Tracker',  desc: 'LeetCode, Codeforces, CodeChef, GFG in one place' },
    { icon: FileText,  title: 'Resume ATS Scorer',     desc: 'Instant ATS compatibility score with fix suggestions' },
    { icon: Zap,       title: 'AI Scoring Engine',     desc: 'Weighted algorithm across 6 dimensions, 0–100 scale' },
    { icon: Target,    title: 'Career Roadmap',        desc: 'Personalised 6-week action plan to boost your score' },
    { icon: Download,  title: 'PDF Report Export',     desc: 'Download a recruiter-ready report in one click' },
    { icon: Users,     title: 'Candidate Compare',     desc: 'Side-by-side comparison for recruiters & teams' },
    { icon: Globe,     title: 'Portfolio Checker',     desc: 'SSL, mobile-friendliness & project detection' },
    { icon: Shield,    title: 'Privacy First',         desc: 'No login, no storage — data deleted after analysis' },
  ]

  const platforms = [
    { name: 'GitHub',      color: 'text-gray-300' },
    { name: 'LeetCode',    color: 'text-yellow-400' },
    { name: 'Codeforces',  color: 'text-blue-400' },
    { name: 'CodeChef',    color: 'text-orange-400' },
    { name: 'GFG',         color: 'text-green-400' },
    { name: 'HackerRank',  color: 'text-emerald-400' },
    { name: 'LinkedIn',    color: 'text-sky-400' },
    { name: 'Portfolio',   color: 'text-purple-400' },
  ]

  const stats = [
    { value: '10K+', label: 'Profiles Analyzed' },
    { value: '8+',   label: 'Platforms Tracked' },
    { value: '95%',  label: 'Accuracy Rate' },
    { value: '< 60s',label: 'Analysis Time' },
  ]

  const levels = [
    { range: '0–39',  label: 'Beginner',        emoji: '🎯', color: 'border-gray-500' },
    { range: '40–59', label: 'Growing Dev',      emoji: '🌱', color: 'border-purple-500' },
    { range: '60–74', label: 'Placement Ready',  emoji: '✨', color: 'border-blue-500' },
    { range: '75–89', label: 'Strong Candidate', emoji: '⭐', color: 'border-cyan-400' },
    { range: '90+',   label: 'Elite Candidate',  emoji: '🏆', color: 'border-yellow-400' },
  ]

  return (
    <div className="pt-20 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        {/* bg blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 text-center">
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-blue-300 mb-8 border border-blue-500/30"
          >
            <Zap className="w-4 h-4" />
            AI-Powered Developer Profile Analyzer
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-extrabold leading-tight mb-6"
          >
            <span className="gradient-text">Scan Your Profiles.</span>
            <br />
            <span className="text-white">Know Your Value.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Get an instant recruiter-ready scorecard from your coding presence.
            Analyze GitHub, DSA platforms, resume, LinkedIn & portfolio — all in one click.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              to="/analyze"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
            >
              <Zap className="w-5 h-5" />
              Analyze Me — It's Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 glass glass-hover rounded-xl font-semibold text-lg"
            >
              How It Works
            </Link>
          </motion.div>

          {/* Platform pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {platforms.map(p => (
              <span key={p.name} className={`px-3 py-1.5 glass rounded-full text-sm font-medium ${p.color}`}>
                {p.name}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="text-3xl font-bold gradient-text mb-1">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOCK DASHBOARD PREVIEW ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your <span className="gradient-text">Score Dashboard</span>
            </h2>
            <p className="text-gray-400 text-lg">See exactly how recruiters evaluate your profile</p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="glass rounded-3xl p-6 md:p-10 max-w-4xl mx-auto gradient-bg">
            {/* header row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-1">Alex Johnson</h3>
                <p className="text-gray-400 text-sm mb-3">alex@example.com</p>
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-sm font-semibold">
                  ✨ Placement Ready
                </span>
              </div>
              <div className="text-center">
                <div className="text-6xl font-extrabold gradient-text">72</div>
                <div className="text-gray-400 text-sm">Overall Score / 100</div>
                <div className="text-blue-400 font-semibold mt-1">79% Hiring Ready</div>
              </div>
            </div>
            {/* score cards */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <ScoreBadge label="GitHub"      score="68" color="border-gray-700" />
              <ScoreBadge label="DSA"         score="75" color="border-yellow-700" />
              <ScoreBadge label="Resume"      score="80" color="border-blue-700" />
              <ScoreBadge label="LinkedIn"    score="60" color="border-sky-700" />
              <ScoreBadge label="Portfolio"   score="55" color="border-purple-700" />
              <ScoreBadge label="Consistency" score="70" color="border-green-700" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Everything You Need</span>
            </h2>
            <p className="text-gray-400 text-lg">One tool to rule your developer presence</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.05)}
                  className="glass glass-hover card-hover rounded-2xl p-6 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SCORE LEVELS ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Where Do You <span className="gradient-text">Stand?</span>
            </h2>
            <p className="text-gray-400 text-lg">5 levels based on your overall developer score</p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
            {levels.map((l, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.08)}
                className={`flex-1 glass rounded-2xl p-6 text-center border-t-2 ${l.color} card-hover`}
              >
                <div className="text-4xl mb-3">{l.emoji}</div>
                <div className="text-xl font-bold mb-1">{l.label}</div>
                <div className="text-sm text-gray-400">{l.range}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Enter Profiles',   desc: 'Add your GitHub, LeetCode, and other platform usernames' },
              { step: '02', title: 'Upload Resume',    desc: 'Upload your PDF resume for ATS analysis' },
              { step: '03', title: 'AI Analyzes',      desc: 'Our engine scrapes and scores all your profiles' },
              { step: '04', title: 'Get Your Report',  desc: 'View dashboard, download PDF, share with recruiters' },
            ].map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="glass rounded-2xl p-6 text-center card-hover">
                <div className="text-4xl font-extrabold gradient-text mb-3">{s.step}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeUp()}
            className="glass rounded-3xl p-12 md:p-20 text-center gradient-bg max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              Ready to Stand Out?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-xl mx-auto">
              Get your free developer readiness report in under 60 seconds.
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <Zap className="w-6 h-6" />
              Start Your Free Analysis
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>
          © 2026 ScanMe AI — Designed & Developed by{' '}
          <a
            href="https://teamtechpro.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Team TechPro
          </a>
        </p>
      </footer>
    </div>
  )
}
