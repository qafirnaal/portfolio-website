import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

/* ── Persistent blocks (never cleared) ─────────────────────── */

const BANNER = `
  ██████╗  █████╗ ███████╗██╗██████╗ ███╗   ██╗ █████╗  █████╗ ██╗     
 ██╔═══██╗██╔══██╗██╔════╝██║██╔══██╗████╗  ██║██╔══██╗██╔══██╗██║     
 ██║   ██║███████║█████╗  ██║██████╔╝██╔██╗ ██║███████║███████║██║     
 ██║▄▄ ██║██╔══██║██╔══╝  ██║██╔══██╗██║╚██╗██║██╔══██║██╔══██║██║     
 ╚██████╔╝██║  ██║██║     ██║██║  ██║██║ ╚████║██║  ██║██║  ██║███████╗
  ╚══▀▀═╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝`;

const HELP_OUTPUT = (
  <div className="output">
    Available commands:
    <br />
    <span className="highlight">projects</span> — View my recent work
    <br />
    <span className="highlight">resume</span>   — Download my resume
    <br />
    <span className="highlight">contact</span>  — Get in touch
    <br />
    <span className="highlight">clear</span>    — Clear terminal history
  </div>
);

const ABOUT_OUTPUT = (
  <div className="output">
    Hey, I'm <span className="highlight">devrathore</span>.{' '}
    <span className="pink">"I break stuff (intentionally)"</span>
    <br /><br />
    Currently studying at <span className="highlight">BITS Pilani</span>.
    <br />
    CTF player · Security enthusiast · Builder of things that occasionally work.
  </div>
);

const PROJECTS_OUTPUT = (
  <div className="output">
    <span className="highlight">01</span>  CTF Tooling — Automation scripts for reverse engineering &amp; pwn.
    <br />
    <span className="highlight">02</span>  qafirnaal — This terminal you're staring at right now.
    <br />
    <span className="highlight">03</span>  Compiler — A real compiler. Written at BITS. It compiles.
    <br />
    <span className="highlight">04</span>  Mass Mailing CRM — A system for managing mass email campaigns and customer relationships.
  </div>
);

const CONTACT_OUTPUT = (
  <div className="output">
    Email:    <a className="link" href="mailto:keitamineee@gmail.com">keitamineee@gmail.com</a>
    <br />
    GitHub:   <a className="link" href="https://github.com/qafirnaal" target="_blank" rel="noreferrer">github.com/qafirnaal</a>
    <br />
    LinkedIn: <a className="link" href="https://www.linkedin.com/in/dev-rathore-770b8a350/" target="_blank" rel="noreferrer">dev-rathore-770b8a350</a>
  </div>
);

/* ── SVG Bunny ─────────────────────────────────────────────── */

function BunnySVG({ hopping }: { hopping: boolean }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="26" rx="10" ry="8" fill="#e8e8e8" stroke="#888" strokeWidth="1" />
      {/* Head */}
      <circle cx="28" cy="18" r="7" fill="#e8e8e8" stroke="#888" strokeWidth="1" />
      {/* Left ear */}
      <ellipse cx="25" cy="6" rx="2.5" ry="7" fill="#e8e8e8" stroke="#888" strokeWidth="1"
        transform={hopping ? 'rotate(-10 25 6)' : 'rotate(0 25 6)'} />
      <ellipse cx="25" cy="6" rx="1.2" ry="5" fill="#c47070"
        transform={hopping ? 'rotate(-10 25 6)' : 'rotate(0 25 6)'} />
      {/* Right ear */}
      <ellipse cx="31" cy="5" rx="2.5" ry="7" fill="#e8e8e8" stroke="#888" strokeWidth="1"
        transform={hopping ? 'rotate(5 31 5)' : 'rotate(15 31 5)'} />
      <ellipse cx="31" cy="5" rx="1.2" ry="5" fill="#c47070"
        transform={hopping ? 'rotate(5 31 5)' : 'rotate(15 31 5)'} />
      {/* Eye */}
      <circle cx="31" cy="17" r="1.2" fill="#333" />
      {/* Nose */}
      <circle cx="34" cy="19" r="0.8" fill="#c47070" />
      {/* Tail */}
      <circle cx="10" cy="23" r="3" fill="#e8e8e8" stroke="#888" strokeWidth="1" />
      {/* Front leg */}
      <ellipse cx={hopping ? 30 : 28} cy={hopping ? 32 : 33} rx="2" ry="3.5" fill="#e8e8e8" stroke="#888" strokeWidth="1" />
      {/* Back leg */}
      <ellipse cx={hopping ? 13 : 14} cy={hopping ? 31 : 33} rx="3" ry={hopping ? 3 : 3.5} fill="#e8e8e8" stroke="#888" strokeWidth="1" />
    </svg>
  );
}

function Bunny() {
  const [pos, setPos] = useState({ x: 120, y: 200 });
  const [flipped, setFlipped] = useState(false);
  const [hopping, setHopping] = useState(false);
  const prevX = useRef(120);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const hop = () => {
      const pad = 60;
      const newX = pad + Math.random() * (window.innerWidth - pad * 2);
      const newY = pad + Math.random() * (window.innerHeight - pad * 2);
      setFlipped(newX < prevX.current);
      prevX.current = newX;

      setHopping(true);
      setPos({ x: newX, y: newY });
      setTimeout(() => setHopping(false), 2500);

      timeout = setTimeout(hop, 7000 + Math.random() * 7000); // 7–14s
    };

    timeout = setTimeout(hop, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      className="bunny"
      animate={{
        x: pos.x,
        y: pos.y,
        rotate: hopping ? (flipped ? 6 : -6) : 0,
      }}
      transition={{ type: 'spring', stiffness: 12, damping: 14, mass: 1.5 }}
      style={{ scaleX: flipped ? -1 : 1 }}
    >
      <BunnySVG hopping={hopping} />
    </motion.div>
  );
}

/* ── Spotify widget — Last.fm version ───────────── */

// Replace this with your actual Last.fm username
const LASTFM_USERNAME = 'qafirnaal';
// We use Vite environment variables so the API key isn't pushed to GitHub
const LASTFM_API_KEY = import.meta.env.VITE_LASTFM_API_KEY || '';

function SpotifyWidget() {
  const [track, setTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useState(0);

  // Animated ASCII equalizer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setFrame((f) => f + 1), 250);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (LASTFM_USERNAME === 'YOUR_LASTFM_USERNAME') return;

    const fetchLastFm = async () => {
      try {
        const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`);
        const data = await res.json();

        if (data.recenttracks && data.recenttracks.track.length > 0) {
          const latestTrack = data.recenttracks.track[0];
          if (latestTrack['@attr'] && latestTrack['@attr'].nowplaying === 'true') {
            setTrack(latestTrack);
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
        }
      } catch (err) {
        console.error("Last.fm fetch error:", err);
      }
    };

    fetchLastFm();
    const interval = setInterval(fetchLastFm, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (!isPlaying || !track) {
    return (
      <div className="spotify-widget">
        <pre className="spotify-ascii">{`♫ Not playing anything right now`}</pre>
      </div>
    );
  }

  const songName = track.name;
  const artistName = track.artist['#text'];

  const eqFrames = [
    ' ▂▃▄▅',
    '▂▃▄▅▆',
    '▃▄▅▆▇',
    '▄▅▆▇█',
    '▅▆▇█▇',
    '▆▇█▇▆',
    '▇█▇▆▅',
    '█▇▆▅▄',
    '▇▆▅▄▃',
    '▆▅▄▃▂',
    '▅▄▃▂ ',
    '▄▃▂ ▂'
  ];
  const eq = eqFrames[frame % eqFrames.length];

  return (
    <div className="spotify-widget">
      <pre className="spotify-ascii">{
        `♫ Now Playing [${eq}]\n> ${songName} — ${artistName}`
      }</pre>
    </div>
  );
}

/* ── Prompt component ──────────────────────────────────────── */

function Prompt() {
  return (
    <span className="prompt">
      <span className="prompt-root">root</span>
      <span className="prompt-at">@</span>
      <span className="prompt-host">qafirnaal</span>
      <span className="prompt-sep">:~# </span>
    </span>
  );
}

/* ── App ───────────────────────────────────────────────────── */

export default function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    let output: React.ReactNode = (
      <div className="output">
        bash: {trimmed}: command not found. Type <span className="highlight">help</span> for available commands.
      </div>
    );

    switch (trimmed) {
      case 'help':
        output = HELP_OUTPUT;
        break;
      case 'projects':
      case 'ls projects':
        output = PROJECTS_OUTPUT;
        break;
      case 'contact':
        output = CONTACT_OUTPUT;
        break;
      case 'resume':
        window.open('/resume.pdf', '_blank');
        output = (
          <div className="output">
            Opening resume.pdf in a new tab...
          </div>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="terminal-container" onClick={() => inputRef.current?.focus()}>
      <Bunny />
      <SpotifyWidget />

      {/* ── Persistent header block ── */}
      <pre className="banner">{BANNER}</pre>
      <div className="info-block">
        <div className="terminal-line">
          <div><Prompt /><span className="command-echo">whoami</span></div>
          {ABOUT_OUTPUT}
        </div>
        <div className="terminal-line">
          <div><Prompt /><span className="command-echo">help</span></div>
          {HELP_OUTPUT}
        </div>
      </div>

      <div className="divider">─────────────────────────────────────</div>

      {/* ── Scrollable command history ── */}
      <div className="terminal-history">
        <AnimatePresence>
          {history.map((item, idx) => (
            <motion.div
              key={idx}
              className="terminal-line"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div>
                <Prompt />
                <span className="command-echo">{item.command}</span>
              </div>
              {item.output}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Input ── */}
      <div className="input-row">
        <Prompt />
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
