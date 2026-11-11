import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Shield, Users, Gamepad2, Search, LogOut, Terminal, Zap, Cpu, Plus, Trash2, Edit3, RefreshCw, LockKeyhole, Eye, EyeOff, ChevronRight } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:4000/api`;
const themes = [
  { id: 'matrix', label: 'MATRIX', color: '#36ff83' },
  { id: 'cyber', label: 'CYBERPUNK', color: '#b66cff' },
  { id: 'underground', label: 'UNDERGROUND', color: '#00d7b0' },
];
// Katalog referensi slot publik. Bukan feed resmi/live dari situs operator.
const gameCatalog = [
  {
    "name": "Mahjong Ways",
    "provider": "PG SOFT"
  },
  {
    "name": "Mahjong Ways 2",
    "provider": "PG SOFT"
  },
  {
    "name": "Wild Bandito",
    "provider": "PG SOFT"
  },
  {
    "name": "Lucky Neko",
    "provider": "PG SOFT"
  },
  {
    "name": "Fortune Tiger",
    "provider": "PG SOFT"
  },
  {
    "name": "Fortune Ox",
    "provider": "PG SOFT"
  },
  {
    "name": "Fortune Rabbit",
    "provider": "PG SOFT"
  },
  {
    "name": "Fortune Dragon",
    "provider": "PG SOFT"
  },
  {
    "name": "Wild Bounty Showdown",
    "provider": "PG SOFT"
  },
  {
    "name": "Fortune Mouse",
    "provider": "PG SOFT"
  },
  {
    "name": "Fortune Gems",
    "provider": "PG SOFT"
  },
  {
    "name": "Gem Saviour",
    "provider": "PG SOFT"
  },
  {
    "name": "Dragon Hatch",
    "provider": "PG SOFT"
  },
  {
    "name": "Caishen Wins",
    "provider": "PG SOFT"
  },
  {
    "name": "Treasures of Aztec",
    "provider": "PG SOFT"
  },
  {
    "name": "Prosperity Lanterns",
    "provider": "PG SOFT"
  },
  {
    "name": "Fortune Trio: Minions of Fu",
    "provider": "PG SOFT"
  },
  {
    "name": "Gates of Olympus",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Gates of Olympus 2500",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Starlight Princess",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Sweet Bonanza",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Sugar Rush",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "The Dog House",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "The Dog House Megaways",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Big Bass Bonanza",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Big Bass Splash",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Fruit Party",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Wolf Gold",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Wild West Gold",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Mustang Gold",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "John Hunter and the Tomb of the Scarab Queen",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "5 Lions Megaways",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Sweet Bonanza Xmas",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Jade Legends",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Congo Cash",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Jewels of Ra",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Moonlight Princess",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Sugar Megarush",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Chests of Cai Shen Infinity",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Rat Royale",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Wonders of Aztec",
    "provider": "PRAGMATIC PLAY"
  },
  {
    "name": "Hot Hot Fruit",
    "provider": "HABANERO"
  },
  {
    "name": "Koi Gate",
    "provider": "HABANERO"
  },
  {
    "name": "Ways of the Qilin",
    "provider": "HABANERO"
  },
  {
    "name": "Fa Cai Shen",
    "provider": "HABANERO"
  },
  {
    "name": "Four Divine Beasts",
    "provider": "HABANERO"
  },
  {
    "name": "Egyptian Dreams Deluxe",
    "provider": "HABANERO"
  },
  {
    "name": "Super Ace",
    "provider": "JILI"
  },
  {
    "name": "Golden Empire",
    "provider": "JILI"
  },
  {
    "name": "Money Coming",
    "provider": "JILI"
  },
  {
    "name": "Boxing King",
    "provider": "JILI"
  },
  {
    "name": "Charge Buffalo",
    "provider": "JILI"
  },
  {
    "name": "Chaos Crew",
    "provider": "HACKSAW GAMING"
  },
  {
    "name": "Wanted Dead or a Wild",
    "provider": "HACKSAW GAMING"
  },
  {
    "name": "Hand of Anubis",
    "provider": "HACKSAW GAMING"
  },
  {
    "name": "Le Bandit",
    "provider": "HACKSAW GAMING"
  },
  {
    "name": "Duel at Dawn",
    "provider": "HACKSAW GAMING"
  },
  {
    "name": "Razor Shark",
    "provider": "PUSH GAMING"
  },
  {
    "name": "Jammin Jars",
    "provider": "PUSH GAMING"
  },
  {
    "name": "Big Bamboo",
    "provider": "PUSH GAMING"
  },
  {
    "name": "Fat Rabbit",
    "provider": "PUSH GAMING"
  },
  {
    "name": "Money Train 2",
    "provider": "RELAX GAMING"
  },
  {
    "name": "Money Train 3",
    "provider": "RELAX GAMING"
  },
  {
    "name": "Temple Tumble",
    "provider": "RELAX GAMING"
  },
  {
    "name": "Snake Arena",
    "provider": "RELAX GAMING"
  },
  {
    "name": "Book of 99",
    "provider": "RELAX GAMING"
  },
  {
    "name": "Book of Dead",
    "provider": "PLAY'N GO"
  },
  {
    "name": "Reactoonz",
    "provider": "PLAY'N GO"
  },
  {
    "name": "Rise of Apollo",
    "provider": "PLAY'N GO"
  },
  {
    "name": "Moon Princess",
    "provider": "PLAY'N GO"
  },
  {
    "name": "Legacy of Dead",
    "provider": "PLAY'N GO"
  },
  {
    "name": "Fire Joker",
    "provider": "PLAY'N GO"
  },
  {
    "name": "Starburst",
    "provider": "NETENT"
  },
  {
    "name": "Gonzo's Quest",
    "provider": "NETENT"
  },
  {
    "name": "Dead or Alive 2",
    "provider": "NETENT"
  },
  {
    "name": "Twin Spin",
    "provider": "NETENT"
  },
  {
    "name": "Divine Fortune",
    "provider": "NETENT"
  },
  {
    "name": "Immortal Romance",
    "provider": "MICROGAMING"
  },
  {
    "name": "Thunderstruck II",
    "provider": "MICROGAMING"
  },
  {
    "name": "Break da Bank Again",
    "provider": "MICROGAMING"
  },
  {
    "name": "108 Heroes",
    "provider": "MICROGAMING"
  },
  {
    "name": "Bonanza",
    "provider": "BIG TIME GAMING"
  },
  {
    "name": "Who Wants to Be a Millionaire",
    "provider": "BIG TIME GAMING"
  },
  {
    "name": "White Rabbit",
    "provider": "BIG TIME GAMING"
  },
  {
    "name": "Fire in the Hole",
    "provider": "NOLIMIT CITY"
  },
  {
    "name": "Mental",
    "provider": "NOLIMIT CITY"
  },
  {
    "name": "San Quentin",
    "provider": "NOLIMIT CITY"
  },
  {
    "name": "Tombstone",
    "provider": "NOLIMIT CITY"
  },
  {
    "name": "Age of the Gods",
    "provider": "PLAYTECH"
  },
  {
    "name": "Buffalo Blitz",
    "provider": "PLAYTECH"
  },
  {
    "name": "Gold Rush",
    "provider": "PLAYTECH"
  },
  {
    "name": "The Goonies",
    "provider": "RED TIGER"
  },
  {
    "name": "Dragon's Luck",
    "provider": "RED TIGER"
  },
  {
    "name": "Dynamite Riches",
    "provider": "RED TIGER"
  },
  {
    "name": "Book of Darkness",
    "provider": "SPADEGAMING"
  },
  {
    "name": "Brothers Kingdom",
    "provider": "SPADEGAMING"
  },
  {
    "name": "Royal Katt",
    "provider": "SPADEGAMING"
  },
  {
    "name": "Raging Rex",
    "provider": "NETENT"
  },
  {
    "name": "Sakura Fortune",
    "provider": "HABANERO"
  },
  {
    "name": "Rave Party Fever",
    "provider": "RED TIGER"
  },
  {
    "name": "Golden Lotus",
    "provider": "CQ9"
  },
  {
    "name": "Gu Gu Gu",
    "provider": "CQ9"
  },
  {
    "name": "Dragon's Treasure",
    "provider": "JILI"
  },
  {
    "name": "Lucky Jaguar",
    "provider": "JILI"
  },
  {
    "name": "Yeti",
    "provider": "FASTSPIN"
  },
  {
    "name": "Pegasus",
    "provider": "PEGASUS"
  },
  {
    "name": "Jammin Jars 2",
    "provider": "PUSH GAMING"
  },
  {
    "name": "Wild Frames",
    "provider": "HACKSAW GAMING"
  },
  {
    "name": "Chaos Crew 2",
    "provider": "HACKSAW GAMING"
  }
];
const games = [...new Set(gameCatalog.map(item => item.name))];
const gameProviders = Object.fromEntries(gameCatalog.map(item => [item.name, item.provider]));
const getGameProvider = (game) => gameProviders[game] || 'PROVIDER BELUM TERVERIFIKASI';
const providerDirectory = [
  "PG SOFT",
  "PRAGMATIC PLAY",
  "PP POP",
  "JILI",
  "MICROGAMING",
  "5G GAMES",
  "NL / NOLIMIT CITY",
  "NETENT",
  "HABANERO",
  "PLAYSTAR",
  "HACKSAW GAMING",
  "PLAYTECH",
  "SPADEGAMING",
  "ASKMESLOT",
  "CQ9",
  "SKYWIND",
  "BESOFT",
  "CROWD PLAY",
  "MIMI GAMING",
  "BT GAMING",
  "RTG SLOTS",
  "GALAXY",
  "R88",
  "DRAGON SOFT",
  "NEXT SPIN",
  "SMARTSOFT",
  "CREATIVE GAMING",
  "ONE GAME",
  "LIVE22",
  "DRAGON GAMING",
  "RELAX GAMING",
  "PLAY'N GO",
  "BETSOFT",
  "SIMPLEPLAY",
  "CONNECT",
  "AI GAMING",
  "ILOVEU",
  "FASTSPIN",
  "PEGASUS",
  "ADVANTPLAY"
];

const referralNames = [
  'KINGAZTEC88 — Angelika Putry',
  'CICIAZTEC88 — Adel Mutia',
  'DRAGON168 — Jessy Ang',
  'DEWIFORTUNA — Velicia',
  'MISTERI77 — Vanessa',
  'ATHENA666 — Valen',
];

const gameCover = (name) => `/game-covers/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webp`;

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('cs26-theme') || 'matrix');
  const [token, setToken] = useState(localStorage.getItem('cs26-token') || '');
  const [role, setRole] = useState(localStorage.getItem('cs26-role') || '');
  const [selectedReferral, setSelectedReferral] = useState(() => localStorage.getItem('cs26-admin-referral') || 'KINGAZTEC88 — Angelika Putry');
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogProvider, setCatalogProvider] = useState('ALL');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ userId: '', password: '', name: '', game: games[0], status: 'Aktif', notes: '' });
  const [memberLookup, setMemberLookup] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [selectedGame, setSelectedGame] = useState(games[0]);
  const [gameSelectionMode, setGameSelectionMode] = useState('manual');
  const [totalDeposit, setTotalDeposit] = useState(() => localStorage.getItem('cs26-total-deposit') || '');

  const headers = useMemo(() => ({ 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }), [token]);
  const api = async (path, options = {}) => {
    const response = await fetch(`${API}${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Terjadi kesalahan.');
    return data;
  };
  const logout = () => { localStorage.removeItem('cs26-token'); localStorage.removeItem('cs26-role'); setToken(''); setRole(''); setUser(null); setUsers([]); };
  const loadUsers = async () => { try { setUsers(await api('/users')); } catch (e) { setError(e.message); } };
  useEffect(() => { localStorage.setItem('cs26-theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('cs26-admin-referral', selectedReferral); }, [selectedReferral]);
  useEffect(() => { localStorage.setItem('cs26-total-deposit', totalDeposit); }, [totalDeposit]);
  useEffect(() => {
    if (!token) return;
    api('/me').then(data => { setRole(data.role); setUser(data.user); }).catch(logout);
  }, [token]);
  useEffect(() => { if (token && role === 'admin') loadUsers(); }, [token, role]);

  async function login(e) {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const data = await api('/login', { method: 'POST', body: JSON.stringify({ userId: userId.trim(), password }) });
      localStorage.setItem('cs26-token', data.token); localStorage.setItem('cs26-role', data.role);
      setToken(data.token); setRole(data.role); setUser(data.user); setPassword('');
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }
  function openCreate() { setEditing(null); setForm({ userId: '', password: '', name: '', game: games[0], status: 'Aktif', notes: '' }); setModal(true); }
  function openEdit(u) { setEditing(u.userId); setForm({ userId: u.userId, password: '', name: u.name || '', game: u.game || games[0], status: u.status || 'Aktif', notes: u.notes || '' }); setModal(true); }
  async function saveUser(e) {
    e.preventDefault(); setError('');
    try {
      if (editing) {
        const payload = { name: form.name, game: form.game, status: form.status, notes: form.notes };
        if (form.password) payload.password = form.password;
        await api(`/users/${encodeURIComponent(editing)}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else await api('/users', { method: 'POST', body: JSON.stringify(form) });
      setModal(false); loadUsers();
    } catch (e) { setError(e.message); }
  }
  async function deleteUser(id) {
    if (!confirm(`Hapus akun ${id}?`)) return;
    try { await api(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' }); loadUsers(); }
    catch (e) { setError(e.message); }
  }
  const filtered = users.filter(u => `${u.userId} ${u.name} ${u.game}`.toLowerCase().includes(query.toLowerCase()));
  const filteredCatalog = gameCatalog.filter(item => (catalogProvider === 'ALL' || item.provider === catalogProvider) && `${item.name} ${item.provider}`.toLowerCase().includes(catalogQuery.toLowerCase()));
  const catalogProviders = [...new Set(gameCatalog.map(item => item.provider))].sort();
  function generateForMember(id) {
    const cleanId = id.trim();
    if (!cleanId) { setError('Masukkan User ID terlebih dahulu.'); return; }
    const found = users.find(u => u.userId.toLowerCase() === cleanId.toLowerCase());
    const member = found || { userId: cleanId, name: 'Quick lookup', status: 'Quick lookup', active: true, game: 'Random' };
    setSelectedMember(member);
    const game = gameSelectionMode === 'random'
      ? games[Math.floor(Math.random() * games.length)]
      : selectedGame;
    const totalWin = Math.floor(400000 + Math.random() * (2500000 - 400000 + 1));
    const next = { game, totalWin, winRate: Math.floor(70 + Math.random() * 31), duration: Math.floor(5 + Math.random() * 116), spin: Math.floor(1 + Math.random() * 250), totalSpin: Math.floor(80 + Math.random() * 1800), createdAt: new Date().toLocaleTimeString('id-ID') };
    setRecommendation(next);
    setError('');
  }
  function findMember() { generateForMember(memberLookup); }
  function generateRecommendation() { if (selectedMember) generateForMember(selectedMember.userId); }

  return <div className={`app theme-${theme}`}>
    <div className="scanlines" />
    <header className="topbar"><div className="brand"><div className="brand-icon"><Terminal size={21}/></div><div><strong>CYBERCORE</strong><small>COMMAND CENTER / SYSTEM ONLINE</small></div></div><div className="top-right"><div className="live"><i/> SYSTEM ONLINE</div><div className="theme-switch">{themes.map(t => <button key={t.id} className={theme === t.id ? 'selected' : ''} onClick={() => setTheme(t.id)}>{t.label}</button>)}</div>{token && <button className="icon-btn" title="Keluar" onClick={logout}><LogOut size={17}/></button>}</div></header>
    {!token ? <main className="login-wrap"><div className="login-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="core"><Cpu size={54}/></div><div className="floating f1">AUTH_GATE // 01</div><div className="floating f2">ENCRYPTION: ACTIVE</div><div className="floating f3">USER PROFILE LINK</div></div><form className="login-panel" onSubmit={login}><div className="eyebrow"><span/> SECURE ACCESS PORTAL</div><h1>ACCESS<br/><em>CONTROL.</em></h1><p className="muted">Masuk untuk membuka dashboard dan konfigurasi profil.</p><label>USER ID</label><div className="field"><Users size={17}/><input value={userId} onChange={e => setUserId(e.target.value)} placeholder="Masukkan User ID" autoComplete="username" required/></div><label>PASSWORD</label><div className="field"><LockKeyhole size={17}/><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password" autoComplete="current-password" required/><button type="button" className="reveal" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div>{error && <div className="error">{error}</div>}<button className="primary-btn" disabled={loading}>{loading ? 'MEMERIKSA...' : 'INITIALIZE SESSION'} <ChevronRight size={18}/></button><div className="login-foot"><Shield size={14}/> CONNECTION ENCRYPTED <span>BUILD 26.11</span></div></form></main> : <main className="dashboard"><div className="welcome-row"><div><div className="eyebrow"><span/> {role === 'admin' ? 'ADMINISTRATOR CONSOLE' : 'USER PROFILE CONSOLE'}</div>{role === 'admin' ? <><h1>COMMAND CENTER</h1></> : <h1>{`WELCOME, ${(user?.name || user?.userId || '').toUpperCase()}`}</h1>}<p className="muted">{role === 'admin' ? 'CHEAT SLOT ENGINE' : 'Informasi profil dan konfigurasi akun yang ditetapkan administrator.'}</p></div>{role === 'admin' ? <div className="session-chip referral-session"><span>ADMIN REFERRAL</span><select aria-label="Pilih admin referral" value={selectedReferral} onChange={e => setSelectedReferral(e.target.value)} style={{background:'transparent',color:'var(--accent, #36ff83)',border:'0',fontWeight:700,fontFamily:'inherit',fontSize:'inherit',maxWidth:'100%',outline:'none',cursor:'pointer'}}>{referralNames.map(item => <option key={item} value={item} style={{background:'#07100d',color:'#36ff83'}}>{item}</option>)}</select></div> : <div className="session-chip"><span>SESSION ID</span><b>{user?.userId || 'USER'}</b></div>}</div>
      {error && <div className="error global-error">{error}<button onClick={() => setError('')}>×</button></div>}<div className="brand-kicker">CYBERCORE</div>
      {role === 'admin' ? <><section className="panel member-generator"><div className="panel-head"><div><div className="eyebrow">MEMBER INTELLIGENCE / RANDOM ENGINE</div><h2>MEMBER GAME GENERATOR</h2><p className="muted">Masukkan User ID, tentukan mode pemilihan game, lalu buat simulasi rekomendasi.</p></div><div className="generator-mark"><Cpu size={28}/><span>ENGINE READY</span></div></div><div className="lookup-row"><div className="searchbox lookup-input"><Search size={17}/><input value={memberLookup} onChange={e=>setMemberLookup(e.target.value)} onKeyDown={e=>e.key==='Enter' && findMember()} placeholder="Masukkan User ID member..."/></div><button className="primary-btn compact" onClick={findMember}>FIND MEMBER</button></div>{selectedMember && <><div className="member-found"><div><small>MEMBER DETECTED</small><strong>{selectedMember.userId}</strong><span>{selectedMember.name || 'Member'} · {selectedMember.status || 'Aktif'}</span></div><button className="primary-btn generate-btn" onClick={generateRecommendation}><Zap size={16}/> {gameSelectionMode === 'random' ? 'GENERATE RANDOM GAME' : 'GENERATE SELECTED GAME'}</button></div>{recommendation && <div className="recommendation-grid"><div className="recommended-game"><div className="eyebrow">GAME WIN</div><img className="game-cover-large" src={gameCover(recommendation.game)} alt={`Cover ${recommendation.game}`} onError={e => { e.currentTarget.style.display = 'none'; }}/><h3>{recommendation.game}</h3><span>{getGameProvider(recommendation.game)}</span></div><div className="metric-tile"><small>WIN RATE</small><strong>{recommendation.winRate}%</strong><span>SIMULATED METRIC</span></div><div className="metric-tile"><small>PLAY DURATION</small><strong>{recommendation.duration} <i>min</i></strong><span>SESSION ESTIMATE</span></div><div className="metric-tile"><small>SPIN NUMBER</small><strong>#{recommendation.spin}</strong><span>RANDOM SPIN</span></div><div className="metric-tile"><small>TOTAL SPIN</small><strong>{recommendation.totalSpin.toLocaleString('id-ID')}</strong><span>GENERATED VALUE</span></div><div className="recommendation-foot">SIMULATION OUTPUT · GENERATED {recommendation.createdAt}</div></div>}</>}</section><section className="stats-grid"><div className="stat-card deposit-stat"><div className="stat-top"><span>TOTAL DEPO</span><i><Users/></i></div><div className="deposit-input-wrap"><span>Rp</span><input aria-label="Isi total deposit" inputMode="numeric" type="text" value={totalDeposit ? Number(totalDeposit).toLocaleString('id-ID') : ''} onChange={e=>setTotalDeposit(e.target.value.replace(/\D/g,''))} placeholder="Isi total depo" /></div><small>Diisi manual oleh admin</small></div><Stat icon={<Activity/>} label="TOTAL WIN" value={recommendation ? `Rp${recommendation.totalWin.toLocaleString('id-ID')}` : 'Rp0'}/><Stat icon={<Gamepad2/>} label="GAME WIN" value={recommendation ? recommendation.game : '--'}/><Stat icon={<Zap/>} label="STATUS ENGINE" value="ON"/></section><section className="panel users-panel"><div className="panel-head"><div><div className="eyebrow">DATABASE / USERS</div><h2>USER MANAGEMENT</h2></div><div className="panel-actions"><div className="searchbox"><Search size={16}/><input placeholder="Cari User ID / nama..." value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="primary-btn compact" onClick={openCreate}><Plus size={16}/> ADD USER</button><button className="icon-btn" onClick={loadUsers} title="Refresh"><RefreshCw size={16}/></button></div></div><div className="table-wrap"><table><thead><tr><th>USER ID / NAMA</th><th>GAME PROFILE</th><th>STATUS</th><th>DIBUAT</th><th>AKSI</th></tr></thead><tbody>{filtered.map(u=><tr key={u.userId}><td><b className="user-code">{u.userId}</b><small>{u.name}</small></td><td><span className="game-tag"><Gamepad2 size={13}/>{u.game}</span></td><td><span className={`status ${u.active ? 'active' : 'inactive'}`}><i/>{u.active ? (u.status || 'Aktif') : 'Nonaktif'}</span></td><td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}</td><td><div className="actions"><button onClick={()=>openEdit(u)} title="Edit"><Edit3 size={15}/></button><button className="danger" onClick={()=>deleteUser(u.userId)} title="Hapus"><Trash2 size={15}/></button></div></td></tr>)}{filtered.length===0 && <tr><td colSpan="5" className="empty">Belum ada akun tersimpan. Quick lookup tetap bisa digunakan di atas.</td></tr>}</tbody></table></div><div className="table-foot">MENAMPILKAN {filtered.length} DARI {users.length} USER <span>DATA DISIMPAN DI SERVER</span></div></section><section className="panel game-selection-bottom"><div className="panel-head"><div><div className="eyebrow">GENERATOR CONFIGURATION</div><h2>MODE PEMILIHAN GAME</h2><p className="muted">Tentukan apakah game dipilih secara acak atau ditentukan sendiri.</p></div></div><div className="game-selection-row" style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}><button type="button" className={`primary-btn compact ${gameSelectionMode === 'random' ? '' : 'mode-option'}`} aria-pressed={gameSelectionMode === 'random'} onClick={()=>setGameSelectionMode('random')} style={{opacity:gameSelectionMode === 'random' ? 1 : 0.65}}>RANDOM GAME</button><button type="button" className={`primary-btn compact ${gameSelectionMode === 'manual' ? '' : 'mode-option'}`} aria-pressed={gameSelectionMode === 'manual'} onClick={()=>setGameSelectionMode('manual')} style={{opacity:gameSelectionMode === 'manual' ? 1 : 0.65}}>MANUAL GAME</button>{gameSelectionMode === 'manual' ? <select id="manual-game-select" className="catalog-select" value={selectedGame} onChange={e=>setSelectedGame(e.target.value)} style={{flex:'1 1 320px',minWidth:'260px'}}>{games.map(game=><option key={game} value={game}>{game} — {getGameProvider(game)}</option>)}</select> : <span className="muted" style={{flex:'1 1 260px'}}>Game akan dipilih secara acak dari katalog saat simulasi dibuat.</span>}</div></section><section className="panel catalog-panel"><div className="panel-head"><div><div className="eyebrow">PUBLIC SLOT REFERENCE / GAME LIBRARY</div><h2>GAME CATALOGUE</h2><p className="muted">Daftar referensi judul slot dan studio pengembang. Ketersediaan di situs operator belum dikonfirmasi.</p></div><div className="catalog-count"><strong>{filteredCatalog.length}</strong><small>GAMES SHOWN</small></div></div><div className="catalog-tools"><div className="searchbox"><Search size={16}/><input value={catalogQuery} onChange={e=>setCatalogQuery(e.target.value)} placeholder="Cari nama game atau provider..."/></div><select className="catalog-select" value={catalogProvider} onChange={e=>setCatalogProvider(e.target.value)}><option value="ALL">SEMUA PROVIDER</option>{catalogProviders.map(provider=><option key={provider} value={provider}>{provider}</option>)}</select></div><div className="catalog-provider-list"><span>PROVIDER DIRECTORY</span>{providerDirectory.map(provider=><button key={provider} className={catalogProvider===provider?'active':''} onClick={()=>setCatalogProvider(catalogProvider===provider?'ALL':provider)}>{provider}</button>)}</div><div className="catalog-grid">{filteredCatalog.map(item=><div className="catalog-game" key={`${item.provider}-${item.name}`}><Gamepad2 size={17}/><div><b>{item.name}</b><small>{item.provider}</small></div></div>)}{filteredCatalog.length===0 && <div className="catalog-empty">Tidak ada judul dalam katalog referensi untuk pencarian/provider ini.</div>}</div><div className="catalog-disclaimer">KATALOG REFERENSI PUBLIK · DAFTAR RESMI · TIDAK TERHUBUNG KE GAME ATAU HASIL PERMAINAN</div></section></> : <><section className="stats-grid"><Stat icon={<Gamepad2/>} label="GAME PROFILE" value="01" note={user?.game || 'Belum ditetapkan'}/><Stat icon={<Shield/>} label="ACCOUNT STATUS" value={user?.active ? 'ON' : 'OFF'} note={user?.status || 'Aktif'}/><Stat icon={<Activity/>} label="SESSION" value="LIVE" note="Sesi akun saat ini"/><Stat icon={<Zap/>} label="CONNECTION" value="SECURE" note="Dashboard terhubung"/></section><section className="user-detail-grid"><div className="panel profile-card"><div className="eyebrow">PERSONAL PROFILE</div><h2>{user?.name}</h2><div className="profile-line"><span>USER ID</span><b>{user?.userId}</b></div><div className="profile-line"><span>GAME CONFIGURATION</span><b>{user?.game}</b></div><div className="profile-line"><span>ACCOUNT STATUS</span><b className="green-text">{user?.status || 'Aktif'}</b></div><div className="profile-line"><span>CREATED</span><b>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}</b></div>{user?.notes && <p className="notes">{user.notes}</p>}</div><div className="panel profile-card"><div className="eyebrow">GAME OVERVIEW</div><div className="game-visual"><Gamepad2 size={38}/><div><b>{user?.game}</b><small>PROFILE CONFIGURATION</small></div></div><p className="muted">Konfigurasi ini merupakan informasi dashboard yang ditetapkan administrator. Dashboard tidak mengubah RNG, peluang, hasil, atau mekanisme permainan.</p><div className="demo-note">DEMO / MONITORING ONLY</div></div></section></>}
      <footer className="footer"><span>© 2026 MAHKOTABOS</span><span>DEMO DATA · VISUAL MONITORING ONLY · NO GAME INTERVENTION</span></footer></main>}
    {modal && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><form className="modal" onSubmit={saveUser}><div className="modal-head"><div><div className="eyebrow">USER DATABASE</div><h2>{editing ? 'EDIT USER PROFILE' : 'CREATE NEW USER'}</h2></div><button type="button" className="icon-btn" onClick={()=>setModal(false)}>×</button></div><label>USER ID</label><input className="plain-input" value={form.userId} disabled={!!editing} onChange={e=>setForm({...form,userId:e.target.value})} placeholder="Contoh: USER001" required/><label>{editing ? 'PASSWORD BARU (OPSIONAL)' : 'PASSWORD'}</label><input className="plain-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder={editing ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'} required={!editing}/><label>NAMA TAMPILAN</label><input className="plain-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nama pengguna"/><label>GAME PROFILE</label><select className="plain-input" value={form.game} onChange={e=>setForm({...form,game:e.target.value})}>{games.map(g=><option key={g}>{g}</option>)}</select><label>STATUS</label><select className="plain-input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Aktif</option><option>Review</option><option>Maintenance</option></select><label>CATATAN</label><textarea className="plain-input" rows="2" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Catatan internal (opsional)"/>{error && <div className="error">{error}</div>}<button className="primary-btn">{editing ? 'SAVE CHANGES' : 'CREATE USER'} <ChevronRight size={17}/></button></form></div>}
  </div>;
}
function Stat({icon,label,value,note}) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><i>{icon}</i></div><strong>{value}</strong>{note && <small>{note}</small>}</div>; }
