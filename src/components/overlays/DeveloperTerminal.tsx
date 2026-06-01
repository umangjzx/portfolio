import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '../../store/portfolioStore';
import { Terminal as TerminalIcon, X } from 'lucide-react';

interface CommandOutput {
  command: string;
  response: string | React.ReactNode;
  isError?: boolean;
}

export function DeveloperTerminal() {
  const isTerminalOpen = usePortfolioStore(s => s.isTerminalOpen);
  const toggleTerminal = usePortfolioStore(s => s.toggleTerminal);
  const addXP = usePortfolioStore(s => s.addXP);
  const unlockAchievement = usePortfolioStore(s => s.unlockAchievement);

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    { command: '', response: 'Nexus Terminal v2.0 — type "help" for commands.' }
  ]);
  const [isMaximized, setIsMaximized] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTerminalOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isTerminalOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim().toLowerCase();
    let response: string | React.ReactNode = '';

    switch (cmd) {
      case 'help':
        response = `Available commands:\n  help       — show this message\n  projects   — navigate to projects\n  skills     — navigate to skills\n  github     — navigate to GitHub section\n  contact    — navigate to contact\n  about      — my bio\n  clear      — clear terminal\n  resume     — download resume (coming soon)\n  easteregg  — 👀`;
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'projects':
        response = '→ Navigating to Projects...';
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(toggleTerminal, 600);
        break;
      case 'skills':
        response = '→ Navigating to Skill Ecosystem...';
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(toggleTerminal, 600);
        break;
      case 'github':
        response = '→ Opening GitHub Command Center...';
        document.getElementById('github')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(toggleTerminal, 600);
        break;
      case 'contact':
        response = '→ Opening secure channel...';
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(toggleTerminal, 600);
        break;
      case 'about':
        response = 'Umang Jaiswal | ML Engineer & Full-Stack Dev | Turning caffeine → code since 2020.';
        break;
      case 'resume':
        response = '📄 Resume download coming soon. Connect on LinkedIn for now!';
        break;
      case 'easteregg':
      case 'sudo':
      case 'sudo rm -rf /':
        response = (
          <span style={{ color: '#f59e0b' }}>
            ⚠️  Nice try. Achievement unlocked: Terminal Hacker (+200 XP)
          </span>
        );
        addXP(200);
        unlockAchievement('🏆 Terminal Hacker');
        break;
      default:
        response = `command not found: ${cmd}`;
    }

    setHistory(prev => [...prev, { command: input, response }]);
    setInput('');
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={toggleTerminal}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-24 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-all hover:scale-110"
        style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
        title="Developer Terminal"
      >
        <TerminalIcon size={20} className="text-gray-700" />
      </motion.button>

      {/* Terminal window — stays dark for premium contrast */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className={`fixed z-[90] flex flex-col font-mono ${
              isMaximized
                ? 'inset-0 rounded-none'
                : 'bottom-6 left-5 right-5 md:left-auto md:right-5 md:w-[580px] h-[400px] rounded-2xl'
            }`}
            style={{
              background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
            }}
          >
            {/* Chrome header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTerminal}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center group"
                >
                  <X size={8} className="opacity-0 group-hover:opacity-100 text-black" />
                </button>
                <button
                  className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400"
                  onClick={() => setIsMaximized(m => !m)}
                />
                <button
                  className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400"
                  onClick={() => setIsMaximized(m => !m)}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <TerminalIcon size={11} />
                <span>nexus — zsh</span>
              </div>
              <div className="w-14" />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 text-sm custom-scrollbar">
              {history.map((entry, i) => (
                <div key={i} className="mb-3">
                  {entry.command && (
                    <div className="flex items-center gap-2 text-white mb-1">
                      <span className="text-green-400">❯</span>
                      <span className="text-gray-400">~</span>
                      <span>{entry.command}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-gray-400 pl-4">{entry.response}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleCommand}
              className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-green-400">❯</span>
              <span className="text-gray-500">~</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder-gray-700"
                placeholder="type a command..."
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default DeveloperTerminal;
