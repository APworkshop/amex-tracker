import { useState, useEffect } from "react";

const DEFAULT_APPS = [
  {
    id: "amex-tracker",
    name: "Amex Tracker",
    description: "Calendar view of your Amex charges by day, week & month",
    icon: "💳",
    color: "#e8845a",
    category: "Finance",
    url: "",
    builtWith: "Claude",
    date: "2026-05-21",
  },
];

const CATEGORIES = ["All", "Finance", "Productivity", "Health", "Creative", "Research", "Other"];

const CAT_COLORS = {
  Finance: "#e8845a",
  Productivity: "#5b8fda",
  Health: "#4fc4a8",
  Creative: "#b07fd4",
  Research: "#e8c44b",
  Other: "#888",
};

function loadApps() {
  try {
    const raw = localStorage.getItem("workshop_apps_v1");
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_APPS;
}

function saveApps(apps) {
  try { localStorage.setItem("workshop_apps_v1", JSON.stringify(apps)); } catch {}
}

export default function Workshop() {
  const [apps, setApps] = useState(loadApps);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", icon: "🔧", color: "#5b8fda", category: "Other", url: "" });
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => { saveApps(apps); }, [apps]);

  const filtered = apps.filter(a => {
    const matchCat = filter === "All" || a.category === filter;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openForm = (app = null) => {
    if (app) { setForm({ name: app.name, description: app.description, icon: app.icon, color: app.color, category: app.category, url: app.url || "" }); setEditing(app.id); }
    else { setForm({ name: "", description: "", icon: "🔧", color: "#5b8fda", category: "Other", url: "" }); setEditing(null); }
    setAdding(true);
  };

  const saveApp = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setApps(prev => prev.map(a => a.id === editing ? { ...a, ...form } : a));
    } else {
      setApps(prev => [...prev, { ...form, id: Date.now().toString(), builtWith: "Claude", date: new Date().toISOString().split("T")[0] }]);
    }
    setAdding(false); setEditing(null);
  };

  const deleteApp = (id) => setApps(prev => prev.filter(a => a.id !== id));

  const ICONS = ["💳","📊","📅","🔍","📝","🎯","💰","🏋️","🎨","📚","🤖","⚡","🗂","📈","🛠","🔧","💡","🌐","📱","🔔"];

  const s = {
    app: { minHeight: "100vh", background: "#0d0d10", color: "#e8e4dc", fontFamily: "'DM Sans', system-ui, sans-serif" },
    sidebar: { width: 220, background: "#111116", borderRight: "1px solid #1e1e28", padding: "28px 16px", display: "flex", flexDirection: "column", gap: 4, position: "fixed", top: 0, left: 0, bottom: 0 },
    logo: { fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: "#f0ece4", padding: "0 8px 24px", borderBottom: "1px solid #1e1e28", marginBottom: 12 },
    logoSub: { fontSize: 11, color: "#444", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", display: "block" },
    catBtn: (active) => ({ padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontFamily: "inherit", textAlign: "left", background: active ? "#1e1e2e" : "transparent", color: active ? "#a78bfa" : "#666", fontWeight: active ? 600 : 400, transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "space-between" }),
    main: { marginLeft: 220, padding: "40px 40px" },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 },
    greeting: { fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "#f0ece4" },
    greetingSub: { fontSize: 14, color: "#555", marginTop: 4 },
    searchBox: { background: "#16161e", border: "1px solid #22222e", borderRadius: 10, padding: "10px 16px", color: "#e8e4dc", fontSize: 14, fontFamily: "inherit", width: 240, outline: "none" },
    addBtn: { background: "#a78bfa", color: "#0d0d10", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit", letterSpacing: "-0.01em" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 36 },
    statCard: { background: "#111116", border: "1px solid #1e1e28", borderRadius: 12, padding: "16px 20px" },
    statLabel: { fontSize: 11, letterSpacing: "0.12em", color: "#444", textTransform: "uppercase", marginBottom: 8 },
    statVal: { fontSize: 24, fontWeight: 700, color: "#f0ece4", letterSpacing: "-0.03em" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
    appCard: (color) => ({ background: "#111116", border: "1px solid #1e1e28", borderRadius: 14, padding: "20px", cursor: "pointer", transition: "all 0.15s", position: "relative", overflow: "hidden" }),
    appIcon: { fontSize: 32, marginBottom: 14, display: "block" },
    appName: { fontSize: 16, fontWeight: 700, color: "#f0ece4", marginBottom: 6, letterSpacing: "-0.02em" },
    appDesc: { fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 16 },
    appMeta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    catPill: (cat) => ({ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: `${CAT_COLORS[cat] || "#888"}18`, color: CAT_COLORS[cat] || "#888", fontWeight: 600, letterSpacing: "0.05em" }),
    appDate: { fontSize: 11, color: "#333" },
    cardActions: { position: "absolute", top: 12, right: 12, display: "flex", gap: 4 },
    actionBtn: (color) => ({ background: color + "22", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11, color: color, fontFamily: "inherit", fontWeight: 600 }),
    openBtn: { width: "100%", background: "#1e1e2e", border: "1px solid #2a2a3e", borderRadius: 8, padding: "9px", cursor: "pointer", fontSize: 13, color: "#a78bfa", fontFamily: "inherit", fontWeight: 600, marginTop: 12, transition: "all 0.15s" },
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
    modalBox: { background: "#111116", border: "1px solid #22222e", borderRadius: 16, padding: "28px", width: 420, maxWidth: "90vw" },
    modalTitle: { fontSize: 20, fontWeight: 700, color: "#f0ece4", marginBottom: 24, letterSpacing: "-0.02em" },
    label: { fontSize: 11, letterSpacing: "0.12em", color: "#555", textTransform: "uppercase", marginBottom: 6, display: "block" },
    input: { width: "100%", background: "#16161e", border: "1px solid #22222e", borderRadius: 8, padding: "10px 14px", color: "#e8e4dc", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 16 },
    iconGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 },
    iconBtn: (selected) => ({ fontSize: 22, background: selected ? "#1e1e2e" : "transparent", border: selected ? "2px solid #a78bfa" : "1px solid #22222e", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }),
    modalBtns: { display: "flex", gap: 8, marginTop: 8 },
    cancelBtn: { flex: 1, background: "transparent", border: "1px solid #22222e", borderRadius: 8, padding: "10px", cursor: "pointer", fontSize: 14, color: "#666", fontFamily: "inherit" },
    saveBtn: { flex: 2, background: "#a78bfa", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#0d0d10", fontFamily: "inherit" },
    emptyState: { textAlign: "center", padding: "60px 0", color: "#333" },
  };

  const categoryCounts = {};
  apps.forEach(a => { categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1; });

  return (
    <div style={s.app}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.logo}>
          Workshop
          <span style={s.logoSub}>Built with Claude</span>
        </div>
        {CATEGORIES.map(cat => (
          <button key={cat} style={s.catBtn(filter === cat)} onClick={() => setFilter(cat)}>
            <span>{cat}</span>
            {cat !== "All" && categoryCounts[cat] && <span style={{fontSize:11,color:"#333"}}>{categoryCounts[cat]}</span>}
          </button>
        ))}
        <div style={{flex:1}} />
        <div style={{fontSize:11,color:"#333",padding:"0 8px"}}>
          {apps.length} tool{apps.length !== 1 ? "s" : ""} built
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        {/* Top bar */}
        <div style={s.topBar}>
          <div>
            <div style={s.greeting}>{greeting} 👋</div>
            <div style={s.greetingSub}>Your personal AI-built toolkit</div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <input
              style={s.searchBox}
              placeholder="Search tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button style={s.addBtn} onClick={() => openForm()}>+ Add tool</button>
          </div>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { label: "Total tools", val: apps.length },
            { label: "Categories", val: Object.keys(categoryCounts).length },
            { label: "Built this month", val: apps.filter(a => a.date?.startsWith(new Date().toISOString().slice(0,7))).length },
            { label: "With live URL", val: apps.filter(a => a.url).length },
          ].map(s2 => (
            <div key={s2.label} style={s.statCard}>
              <div style={s.statLabel}>{s2.label}</div>
              <div style={s.statVal}>{s2.val}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{fontSize:40,marginBottom:12}}>🔧</div>
            <div style={{fontSize:16,color:"#444"}}>No tools here yet</div>
            <div style={{fontSize:13,color:"#333",marginTop:4}}>Add your first tool above</div>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map(app => (
              <div key={app.id} style={s.appCard(app.color)}
                onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${app.color}44`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.border = "1px solid #1e1e28"; e.currentTarget.style.transform = "none"; }}
              >
                {/* Accent bar */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:app.color,borderRadius:"14px 14px 0 0"}} />

                <div style={s.cardActions}>
                  <button style={s.actionBtn("#5b8fda")} onClick={() => openForm(app)}>edit</button>
                  <button style={s.actionBtn("#e07b54")} onClick={() => deleteApp(app.id)}>✕</button>
                </div>

                <span style={s.appIcon}>{app.icon}</span>
                <div style={s.appName}>{app.name}</div>
                <div style={s.appDesc}>{app.description || "No description yet."}</div>
                <div style={s.appMeta}>
                  <span style={s.catPill(app.category)}>{app.category}</span>
                  <span style={s.appDate}>{app.date}</span>
                </div>
                {app.url && (
                  <button style={s.openBtn} onClick={() => window.open(app.url, "_blank")}>
                    Open → {app.url.replace(/^https?:\/\//, "").split("/")[0]}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {adding && (
        <div style={s.modal} onClick={e => { if(e.target === e.currentTarget) setAdding(false); }}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>{editing ? "Edit tool" : "Add a tool"}</div>

            <label style={s.label}>Name</label>
            <input style={s.input} value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Budget Tracker" />

            <label style={s.label}>Description</label>
            <input style={s.input} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="What does it do?" />

            <label style={s.label}>Live URL (optional)</label>
            <input style={s.input} value={form.url} onChange={e => setForm(f=>({...f,url:e.target.value}))} placeholder="https://your-app.vercel.app" />

            <label style={s.label}>Category</label>
            <select style={{...s.input, marginBottom:16}} value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
              {CATEGORIES.filter(c=>c!=="All").map(c => <option key={c}>{c}</option>)}
            </select>

            <label style={s.label}>Icon</label>
            <div style={s.iconGrid}>
              {ICONS.map(ic => (
                <button key={ic} style={s.iconBtn(form.icon===ic)} onClick={() => setForm(f=>({...f,icon:ic}))}>{ic}</button>
              ))}
            </div>

            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setAdding(false)}>Cancel</button>
              <button style={s.saveBtn} onClick={saveApp}>{editing ? "Save changes" : "Add to Workshop"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
