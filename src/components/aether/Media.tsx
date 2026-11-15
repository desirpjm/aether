import { useState } from 'react';
import { cn } from '@/lib/utils';

const portraits: Record<string, string> = {
  vance: '/vance.png',
  chen: '/chen.png',
  lin: '/lin.png',
};

export function Portrait({ id, name, className }: { id: string; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={cn('inline-flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-node font-brand text-3xl', className)}>
      {portraits[id] && !failed ? (
        <img src={portraits[id]} alt={name} className="h-full w-full object-cover grayscale" onError={() => setFailed(true)} />
      ) : (
        name.split(' ').map(n => n[0]).slice(-2).join('')
      )}
    </span>
  );
}

export function Illustration({ kind }: { kind: 'emblem' | 'helmet' }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <svg viewBox="0 0 200 200" className={kind === 'emblem' ? 'mx-auto h-24 w-44' : 'w-full'} fill="none" stroke="currentColor">
        <ellipse cx="100" cy="100" rx="45" ry="60" />
        <ellipse cx="100" cy="100" rx="90" ry="20" transform="rotate(-25 100 100)" />
        {kind === 'helmet' && <path d="M55 90 Q100 45 145 90 L145 130 Q100 160 55 130 Z" />}
      </svg>
    );
  }
  return (
    <img
      src={kind === 'emblem' ? '/aether-emblem.png' : '/helmet-seal.png'}
      alt={kind === 'emblem' ? 'Aether orbital emblem' : 'Suit helmet and oxygen seal'}
      onError={() => setFailed(true)}
      className={kind === 'emblem' ? 'emblem mx-auto h-24 w-44 object-contain dark:invert' : 'h-full w-full object-contain dark:invert'}
    />
  );
}

export function ScientificFooter() {
  return (
    <footer className="mx-auto mt-10 max-w-3xl border-t border-meta px-5 py-8 font-mono text-[10px] leading-relaxed text-meta">
      BIOMEDICAL &amp; ENVIRONMENTAL MODELS REFERENCED FROM: NASA HUMAN RESEARCH PROGRAM (5 HAZARDS &amp; RISKS) • NASA-STD-3001 • ARTEMIS II ARCHeR / CIPHER / SANS • MARS 2020 MEDA • CSA CANS NEUTRON RADIATION MONITORING.
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-meta/40 pt-4 text-foreground">
        <a
          href="https://github.com/desirpjm/aether/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 transition-opacity hover:opacity-60"
        >
          SOURCE CODE (GITHUB) 
        </a>
        <span>•</span>
        <a
          href="https://aether-manual.tiiny.site/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 transition-opacity hover:opacity-60"
        >
          CREW FLIGHT MANUAL 
        </a>
      </div>
      <p className="mt-4">
        NASA Space Apps • Self-contained demonstration • Not a medical device. Readings, personalized limits, mission trends, and dispatch acknowledgments are simulated; reference constants are scenario assumptions, not certified operational settings.
      </p>
    </footer>
  );
}
