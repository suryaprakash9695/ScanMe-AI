import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Shield, TrendingUp, Users, Target, Award, Code2, Github, FileText, Globe } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
})

export default function About() {
  const features = [
    { icon: Zap,       title: 'Lightning Fast',    desc: 'Complete developer analysis in under 60 seconds using async parallel scraping' },
    { icon: Shield,    title: 'Privacy First',     desc: 'No login, no database. All data is processed in-memory and discarded after analysis' },
    { icon: TrendingUp,title: 'Actionable Insights',desc: 'Specific, prioritised steps to improve your profile — not vague advice' },
    { icon: Users,     title: 'Recruiter Ready',   desc: 'Reports designed to impress hiring managers with professional formatting' },
    { icon: Target,    title: 'Multi-Platform',    desc: 'Analyze 8+ coding platforms in one comprehensive, weighted report' },
    { icon: Award,     title: 'AI Scoring Engine', desc: 'Intelligent weighted algorithm across 6 dimensions with 5 career levels' },
  ]

  const stack = [
    { icon: Code2,    label: 'React 18',       desc: 'Frontend framework' },
    { icon: Zap,      label: 'Tailwind CSS',   desc: 'Utility-first styling' },
    { icon: TrendingUp,label: 'Framer Motion', desc: 'Smooth animations' },
    { icon: Target,   label: 'Recharts',       desc: 'Data visualisation' },
    { icon: Github,   label: 'FastAPI',        desc: 'Python backend' },
    { icon: FileText, label: 'pdfplumber',     desc: 'Resume parsing' },
    { icon: Globe,    label: 'BeautifulSoup',  desc: 'Web scraping' },
    { icon: Shield,   label: 'Playwright',     desc: 'JS-heavy pages' },
  ]

  const weights = [
    { label: 'GitHub Activity',       pct: 25, color: 'from-blue-500 to-blue-600' },
    { label: 'DSA Platforms',         pct: 25, color: 'from-purple-500 to-purple-600' },
    { label: 'Resume Quality',        pct: 20, color: 'from-pink-500 to-pink-600' },
    { label: 'Professional Presence', pct: 15, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Platform Diversity',    pct: 10, color: 'from-green-500 to-green-600' },
    { label: 'Portfolio',             pct:  5, color: 'from-yellow-500 to-yellow-600' },
  ]

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Hero */}
        <motion.div {...fadeUp()} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            About <span className="gradient-text">ScanMe AI</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We help developers understand their true market value by analyzing their complete
            online coding presence and generating recruiter-ready reports — instantly, for free.
          </p>
        </motion.div>

        {/* Problem */}
        <motion.div {...fadeUp(0.05)} className="glass rounded-3xl p-8 md:p-12 mb-10 gradient-bg">
          <h2 className="text-3xl font-bold mb-4">The Problem We Solve</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Recruiters spend hours manually checking GitHub profiles, LeetCode stats, resumes, and LinkedIn pages.
            Students and developers often don't know how they compare to others or what to improve.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            <span className="text-white font-semibold">ScanMe AI</span> solves this by providing instant,
            comprehensive analysis with actionable insights that help developers stand out in the competitive job market.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div {...fadeUp(0.1)} className="mb-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Why ScanMe AI?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.06)} className="glass rounded-2xl p-6 card-hover">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Scoring weights */}
        <motion.div {...fadeUp(0.15)} className="glass rounded-3xl p-8 mb-10">
          <h2 className="text-3xl font-bold mb-8">Scoring Breakdown</h2>
          <div className="space-y-4">
            {weights.map((w, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-300 font-medium">{w.label}</span>
                  <span className="font-bold text-white">{w.pct}%</span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${w.color} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${w.pct * 4}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div {...fadeUp(0.2)} className="mb-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stack.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.05)} className="glass rounded-2xl p-4 text-center card-hover">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-blue-300" />
                  </div>
                  <p className="font-semibold text-sm">{s.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.25)} className="glass rounded-3xl p-10 text-center gradient-bg">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of developers who've improved their profiles and landed their dream jobs.
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <Zap className="w-5 h-5" />
            Analyze Your Profile Now
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
