import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '../../store/portfolioStore';
import { fuzzySearchService } from '../../services/fuzzySearch';
import { COMMANDS } from '../../data/commands';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { Command } from '../../types';

function getCommandsWithActions(): Command[] {
  return COMMANDS.map((cmd) => {
    switch (cmd.id) {
      case 'view-projects':
        return { ...cmd, action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) };
      case 'download-resume':
        return { ...cmd, action: () => { const a = document.createElement('a'); a.href = '/resume.pdf'; a.download = 'Umang_Jaiswal_Resume.pdf'; a.click(); } };
      case 'contact':
        return { ...cmd, action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) };
      case 'github':
        return { ...cmd, action: () => window.open('https://github.com/umangjaiswal', '_blank') };
      case 'linkedin':
        return { ...cmd, action: () => window.open('https://linkedin.com/in/umangjaiswal', '_blank') };
      default: return cmd;
    }
  });
}

export function CommandPalette() {
  const isOpen = usePortfolioStore((s) => s.isCommandPaletteOpen);
  const toggleCommandPalette = usePortfolioStore((s) => s.toggleCommandPalette);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [commands] = useState<Command[]>(getCommandsWithActions);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const focusTrapRef = useFocusTrap(isOpen, { onEscape: toggleCommandPalette, initialFocusRef: inputRef });
  const filteredCommands = fuzzySearchService.search(query, commands);

  useEffect(() => {
    if (isOpen) { setQuery(''); setHighlightedIndex(0); }
  }, [isOpen]);

  useEffect(() => {
    if (highlightedIndex >= filteredCommands.length) setHighlightedIndex(Math.max(0, filteredCommands.length - 1));
  }, [filteredCommands.length, highlightedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); toggleCommandPalette(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  const executeCommand = useCallback((command: Command) => { command.action(); toggleCommandPalette(); }, [toggleCommandPalette]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setHighlightedIndex(p => p < filteredCommands.length - 1 ? p + 1 : 0); break;
      case 'ArrowUp': e.preventDefault(); setHighlightedIndex(p => p > 0 ? p - 1 : filteredCommands.length - 1); break;
      case 'Enter': e.preventDefault(); if (filteredCommands[highlightedIndex]) executeCommand(filteredCommands[highlightedIndex]); break;
      case 'Escape': e.preventDefault(); toggleCommandPalette(); break;
    }
  }, [filteredCommands, highlightedIndex, executeCommand, toggleCommandPalette]);

  useEffect(() => {
    if (listRef.current) {
      const highlighted = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlighted) highlighted.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-[9998] bg-gray-900/20 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={toggleCommandPalette} />
          <motion.div ref={focusTrapRef} className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh]" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} onKeyDown={handleKeyDown}>
            <div className="w-full max-w-lg mx-4 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input ref={inputRef} type="text" className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-base outline-none font-medium" placeholder="Type a command or search..." value={query} onChange={(e) => { setQuery(e.target.value); setHighlightedIndex(0); }} />
                <kbd className="hidden sm:inline-flex px-2 py-1 text-[10px] font-bold text-gray-500 bg-gray-100 rounded">ESC</kbd>
              </div>

              <div ref={listRef} className="max-h-[300px] overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, index) => (
                    <div key={cmd.id} data-index={index} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${index === highlightedIndex ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`} onClick={() => executeCommand(cmd)} onMouseEnter={() => setHighlightedIndex(index)}>
                      {cmd.icon && <span className="text-lg opacity-70">{cmd.icon}</span>}
                      <span className="text-sm font-medium">{cmd.label}</span>
                      {index === highlightedIndex && <span className="ml-auto text-gray-400">↵</span>}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-12 text-center text-gray-500 text-sm">No commands found for "{query}"</div>
                )}
              </div>

              <div className="flex items-center justify-between px-5 py-3 bg-gray-50/80 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold shadow-sm">↑↓</kbd> navigate</span>
                  <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold shadow-sm">↵</kbd> select</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
