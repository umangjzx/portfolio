import { motion } from 'framer-motion';
import { FlaskConical, Beaker, Workflow } from 'lucide-react';

export function DeveloperLab() {
  return (
    <section id="lab" className="py-32 px-6 md:px-12 lg:px-24 bg-transparent relative overflow-hidden">
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-xs font-semibold text-gray-500 tracking-widest uppercase mb-6">
            <FlaskConical size={12} className="text-purple-500" /> Research & Development
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
            Developer Lab
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl font-light">
            Where ideas incubate. Live R&D, learning paths, and experiments in progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Experiments */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 group relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
                <Beaker size={20} className="text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Active Experiments</h3>
            </div>

            <div className="space-y-5">
              {[
                {
                  title: 'AI-Powered Code Assistant',
                  status: 'In Progress',
                  statusColor: '#f59e0b',
                  statusBg: 'rgba(245,158,11,0.08)',
                  desc: 'Exploring local LLMs (Llama 3, Mistral) for real-time code suggestions without cloud dependencies.',
                  stack: ['Python', 'PyTorch', 'Ollama'],
                },
                {
                  title: 'WebGPU Physics Engine',
                  status: 'Research',
                  statusColor: '#4285F4',
                  statusBg: 'rgba(66,133,244,0.08)',
                  desc: 'Testing WebGPU capabilities for massive particle simulations in the browser.',
                  stack: ['Rust', 'WASM', 'WebGPU'],
                },
              ].map((exp) => (
                <div
                  key={exp.title}
                  className="rounded-2xl p-5 border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <h4 className="font-bold text-gray-900">{exp.title}</h4>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: exp.statusColor, background: exp.statusBg }}
                    >
                      {exp.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{exp.desc}</p>
                  <div className="flex gap-2 flex-wrap">
                    {exp.stack.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 bg-white rounded-lg border border-gray-200 text-gray-600">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Learning Roadmap */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <Workflow size={20} className="text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Learning Roadmap</h3>
            </div>

            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
              {[
                {
                  title: 'Advanced Distributed Systems',
                  desc: 'Deep dive into consensus algorithms, vector clocks, and CRDTs.',
                  color: '#4285F4',
                  active: true,
                },
                {
                  title: 'Go Concurrency Patterns',
                  desc: 'Mastering channels, select statements, and goroutine synchronization.',
                  color: '#f59e0b',
                  active: true,
                },
                {
                  title: 'Kubernetes Operators',
                  desc: 'Building custom controllers to automate complex application lifecycle management.',
                  color: '#9ca3af',
                  active: false,
                },
              ].map((item) => (
                <div key={item.title} className="relative pl-6">
                  <div
                    className="absolute w-3.5 h-3.5 rounded-full -left-[9px] top-1"
                    style={{
                      background: item.active ? item.color : '#e5e7eb',
                      boxShadow: item.active ? `0 0 10px ${item.color}60` : 'none',
                    }}
                  />
                  <h4 className={`font-bold mb-1 ${item.active ? 'text-gray-900' : 'text-gray-400'}`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm leading-relaxed ${item.active ? 'text-gray-500' : 'text-gray-300'}`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default DeveloperLab;
