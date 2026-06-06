import React, { useState, useEffect, useRef } from 'react';
import { useProjects } from '@shell/hooks/useContent';
import { useDatabase } from '@shell/contexts/ServicesContext';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}

export const Terminal: React.FC = () => {
  const { data: projects } = useProjects();
  const db = useDatabase();
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'sspirial.systems [Version 2.1.0]', type: 'system' },
    { text: '(c) 2026 sspirial.systems. All rights reserved.', type: 'system' },
    { text: 'Initializing R&D Core Shell...', type: 'system' },
    { text: 'DB status: CONNECTED (InstantDB Node)', type: 'success' },
    { text: 'Type "help" to list available commands.', type: 'system' },
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newHistory = [...history, { text: `sspirial@systems:~$ ${trimmed}`, type: 'input' as const }];
    const parts = trimmed.split(' ');
    const baseCommand = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: TerminalLine[] = [];

    switch (baseCommand) {
      case 'help':
        output = [
          { text: 'Available commands:', type: 'system' },
          { text: '  help       - Display this instruction manual', type: 'output' },
          { text: '  status     - Query diagnostic metrics and connection states', type: 'output' },
          { text: '  manifesto  - Stream the studio\'s R&D philosophy and heuristics', type: 'output' },
          { text: '  projects   - Index all deployed projects & prototypes', type: 'output' },
          { text: '  agents     - Monitor autonomous R&D subagents', type: 'output' },
          { text: '  llms.txt   - Query AI-friendly indexing specification', type: 'output' },
          { text: '  clear      - Clear the console history', type: 'output' },
        ];
        break;

      case 'status':
        output = [
          { text: '--- SYSTEM METRICS ---', type: 'system' },
          { text: 'Core Shell: ACTIVE', type: 'success' },
          { text: 'Database:   CONNECTED (InstantDB serverless network)', type: 'success' },
          { text: `Uptime:     ${Math.floor(window.performance.now() / 1000)}s (Local session)`, type: 'output' },
          { text: 'Latency:    24ms (estimated)', type: 'output' },
          { text: `Host Node:  ${navigator.userAgent.slice(0, 40)}...`, type: 'output' },
        ];
        break;

      case 'manifesto':
      case 'about':
        output = [
          { text: '--- STUDIO MANIFESTO ---', type: 'system' },
          { text: 'sspirial.systems functions as an independent R&D studio.', type: 'output' },
          { text: 'We design tiny tools, local-first architectures, and explore autonomous intelligence.', type: 'output' },
          { text: 'CORE HEURISTICS:', type: 'system' },
          { text: '  1. BUILD FOR $0    - Zero infrastructure bills. Pure client/serverless runtimes.', type: 'output' },
          { text: '  2. LOCAL-FIRST     - Data belongs to the device. Sync is a convenience, not a lock.', type: 'output' },
          { text: '  3. AGENT ORGANISMS - Dynamic systems driven by reactive loops, not rigid pipelines.', type: 'output' },
        ];
        break;

      case 'projects':
      case 'work':
        if (!projects || projects.length === 0) {
          output = [{ text: 'No project nodes found in database registry.', type: 'error' }];
        } else {
          output = [
            { text: `Found ${projects.length} project node(s) in registry:`, type: 'system' },
            ...projects.map((p) => ({
              text: `  [${p.featured ? '★' : ' '}] ${p.title.padEnd(20)} | ${p.tags.slice(0, 3).join(', ')} | v${p.version || '1.0'}`,
              type: 'success' as const,
            })),
            { text: 'Type "projects <name>" to inspect a node or visit the Work page.', type: 'output' },
          ];
        }
        break;

      case 'agents':
        output = [
          { text: '--- AUTONOMOUS R&D AGENT LOGS ---', type: 'system' },
          { text: '[01/AETHER]: Running - Scanning Web Ontology APIs (100% load)', type: 'success' },
          { text: '[02/CHRONOS]: Sleeping - Awaiting system trigger (Uptime: 4.8h)', type: 'output' },
          { text: '[03/HEURISTIC]: Active - Monitoring data mutations (Sync active)', type: 'success' },
        ];
        break;

      case 'llms.txt':
      case 'llmstxt':
      case 'llms':
        output = [
          { text: '--- LLMS.TXT FILE INDEX ---', type: 'system' },
          { text: 'Title:       sspirial.systems - R&D Micro-Studio', type: 'output' },
          { text: 'Description: Sovereign technical lab exploring local-first architectures & agents.', type: 'output' },
          { text: 'Paths Indexed:', type: 'system' },
          { text: '  /          - Dashboard & Interactive Terminal', type: 'output' },
          { text: '  /projects  - Project Registry & Manifestos', type: 'output' },
          { text: '  /research  - Lab Knowledge base & Split-screen explorer', type: 'output' },
          { text: '  /about     - Values, Timelines, & Core Philosophy', type: 'output' },
          { text: '  /llms.txt  - Clean LLM-readable manifest', type: 'output' },
          { text: 'Type "cat llms.txt" to read the raw index, or visit sspirial.systems/llms.txt.', type: 'success' },
        ];
        break;

      case 'cat':
        if (args.length > 0 && args[0].toLowerCase() === 'llms.txt') {
          output = [
            { text: '# sspirial.systems', type: 'system' },
            { text: '> Sovereign systems R&D studio and autonomous agents lab.', type: 'output' },
            { text: 'Navigation:', type: 'system' },
            { text: '  - [/] Home console & terminal', type: 'output' },
            { text: '  - [/projects] Registry and READMEs', type: 'output' },
            { text: '  - [/research] Technical note explorer', type: 'output' },
            { text: '  - [/about] Manifestos & logs', type: 'output' },
            { text: 'Heuristics: Build for $0, Local-First, Agent Organisms.', type: 'output' },
          ];
        } else {
          output = [{ text: 'Usage: cat <filename>. Example: cat llms.txt', type: 'error' }];
        }
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        // Try to match project details
        if (baseCommand.startsWith('proj') && args.length > 0) {
          const searchName = args.join(' ').toLowerCase();
          const match = projects?.find(p => p.title.toLowerCase().includes(searchName));
          if (match) {
            output = [
              { text: `--- NODE DESCRIPTION: ${match.title.toUpperCase()} ---`, type: 'system' },
              { text: `Version:    v${match.version || '1.0.0'}`, type: 'output' },
              { text: `Stack:      ${match.tags.join(', ')}`, type: 'output' },
              { text: `Summary:    ${match.description}`, type: 'output' },
            ];
            break;
          }
        }
        output = [
          { text: `Command not found: "${baseCommand}". Type "help" for a list of system routines.`, type: 'error' },
        ];
    }

    setHistory([...newHistory, ...output]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <div 
      className="w-full h-[320px] rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-[#f9fafb] dark:bg-black/80 font-mono text-xs flex flex-col overflow-hidden shadow-2xl relative cursor-text text-left"
      onClick={focusInput}
      role="application"
      aria-label="Interactive Terminal Console"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#e5e7eb] dark:border-white/10 bg-[#e5e7eb]/50 dark:bg-zinc-900/50 backdrop-blur select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
        </div>
        <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-500 tracking-wider">
          sspirial@terminal: ~ (WebSocket Active)
        </div>
        <div className="w-8"></div>
      </div>

      {/* Terminal Screen Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 select-text scanline relative bg-white dark:bg-black/60">
        {history.map((line, idx) => {
          let colorClass = 'text-[#111318] dark:text-gray-300';
          if (line.type === 'input') colorClass = 'text-accent dark:text-primary font-bold';
          if (line.type === 'error') colorClass = 'text-red-600 dark:text-red-400';
          if (line.type === 'success') colorClass = 'text-emerald-600 dark:text-emerald-400';
          if (line.type === 'system') colorClass = 'text-primary dark:text-amber-500/80';
          
          return (
            <div key={idx} className={`${colorClass} leading-relaxed break-words whitespace-pre-wrap`}>
              {line.text}
            </div>
          );
        })}
        
        {/* Terminal Input Line */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-accent dark:text-primary font-bold">sspirial@systems:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-[#111318] dark:text-white font-mono text-xs caret-transparent"
            aria-label="Terminal command prompt"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {/* Custom Blinking Cursor */}
          <span 
            className="w-1.5 h-3.5 bg-primary dark:bg-primary cursor-blink inline-block"
            style={{ marginLeft: `${-input.length * 0}px`, transform: 'translateX(-4px)' }}
          ></span>
        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

export default Terminal;
