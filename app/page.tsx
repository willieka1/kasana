"use client";

import { useEffect, useMemo, useState } from "react";
import { exchangePrograms, scholarshipPrograms, type ExchangeProgram, type ScholarshipProgram } from "./program-data";

type Tab = "exchange" | "scholarship";
type Selected = { type: Tab; item: ExchangeProgram | ScholarshipProgram } | null;
type StaticImageItem = { src: string; alt: string; width: number; height: number };

const PROGRAM_VISUALS = {
  planning: "/program-images/program-planning.webp",
  asianStudents: "/program-images/asian-students.webp",
  globalStudents: "/program-images/global-students.webp",
  lpdp: "/program-images/lpdp.webp",
  taiwan: "/program-images/taiwan.webp",
  japan: "/program-images/japan.webp",
  europe: "/program-images/europe.webp",
  waseda: "/program-images/waseda.webp",
  scholarshipCampus: "/program-images/scholarship-campus.webp",
  daad: "/program-images/daad.webp",
  germany: "/program-images/germany.webp",
  ukInternational: "/program-images/uk-international.webp",
} as const;

function getProgramImage(item: ExchangeProgram | ScholarshipProgram, type: Tab): string {
  const text = `${item.name} ${item.country}`.toLowerCase();

  // Foto spesifik berdasarkan judul/program yang dikirim pengguna.
  if (text.includes("lpdp")) return PROGRAM_VISUALS.lpdp;
  if (text.includes("taiwan")) return PROGRAM_VISUALS.taiwan;
  if (text.includes("waseda")) return PROGRAM_VISUALS.waseda;
  if (text.includes("daad epos")) return PROGRAM_VISUALS.daad;
  if (text.includes("daad")) return PROGRAM_VISUALS.germany;
  if (text.includes("erasmus") || text.includes("europe") || text.includes("eropa")) return PROGRAM_VISUALS.europe;
  if (text.includes("chevening") || text.includes("commonwealth") || text.includes("cambridge") || text.includes("oxford") || text.includes("rhodes") || text.includes("inggris") || text.includes("united kingdom") || text.includes(" uk")) return PROGRAM_VISUALS.ukInternational;
  if (text.includes("japan") || text.includes("jepang") || text.includes("mext") || text.includes("jasso") || text.includes("jenesys") || text.includes("sakura") || text.includes("chiba") || text.includes("kyoto") || text.includes("tokyo") || text.includes("keio") || text.includes("tohoku") || text.includes("sophia") || text.includes("kanazawa") || text.includes("kyushu") || text.includes("sseayp")) return PROGRAM_VISUALS.japan;

  // Program yang bersifat riset, internship, atau professional mobility.
  if (text.includes("iaeste") || text.includes("research exchange") || text.includes("scope") || text.includes("score") || text.includes("global talent") || text.includes("internship")) return PROGRAM_VISUALS.planning;

  // Program Asia/ASEAN menggunakan foto kelompok mahasiswa Asia.
  if (text.includes("korea") || text.includes("gks") || text.includes("china") || text.includes("chinese") || text.includes("hong kong") || text.includes("hkust") || text.includes("asean") || text.includes("asia") || text.includes("umap") || text.includes("aims") || text.includes("aun") || text.includes("singapura") || text.includes("thailand") || text.includes("malaysia") || text.includes("brunei")) return PROGRAM_VISUALS.asianStudents;

  // Amerika dan beasiswa kampus umum memakai visual lingkungan kampus.
  if (text.includes("amerika") || text.includes("stanford") || text.includes("fulbright") || text.includes("undergraduate exchange") || text.includes("global ugrad")) return PROGRAM_VISUALS.scholarshipCampus;

  // Exchange dari kampus Indonesia/Global dan program lintas negara.
  if (type === "exchange") {
    if (text.includes("indonesia / global") || text.includes("indonesia → global") || text.includes("kampus merdeka")) return PROGRAM_VISUALS.asianStudents;
    return PROGRAM_VISUALS.globalStudents;
  }

  // Beasiswa nasional/internasional lain tetap menggunakan konteks pendidikan/kampus.
  return PROGRAM_VISUALS.scholarshipCampus;
}
const INITIAL_LIMIT = 6;

const GUIDE_STEPS = [
  { image: "/course-template/blog-1.svg", title: "Pilih kategori", description: "Tentukan apakah kamu mencari exchange atau beasiswa." },
  { image: "/course-template/blog2.svg", title: "Cari program", description: "Gunakan nama, negara, atau jenjang untuk mempersempit hasil." },
  { image: "/course-template/blog3.svg", title: "Baca informasi", description: "Buka kartu program dan pelajari informasi awal yang tersedia." },
  { image: "/course-template/blog4.svg", title: "Verifikasi & daftar", description: "Konfirmasi deadline dan persyaratan melalui tautan resmi." },
];

// Cara maintenance logo:
// 1. Masukkan file gambar ke public/partner-logos
// 2. Samakan nama file dengan nilai "src" di bawah
// 3. Gunakan path web yang diawali "/", bukan path Windows seperti C:/Users/...
const PARTNER_LOGOS: StaticImageItem[] = [
  { src: "/partner-logos/lpdp.png", alt: "LPDP", width: 678, height: 452 },
  { src: "/partner-logos/kampus-merdeka.png", alt: "Kampus Merdeka", width: 560, height: 357 },
  { src: "/partner-logos/chevening.png", alt: "Chevening Scholarships", width: 320, height: 320 },
  { src: "/partner-logos/mext.png", alt: "MEXT Scholarships", width: 738, height: 309 },
  { src: "/partner-logos/daad.png", alt: "DAAD", width: 400, height: 200 },
  { src: "/partner-logos/erasmus-plus.png", alt: "Erasmus Plus", width: 652, height: 366 },
];

function StaticImage({ src, alt, width, height, className }: StaticImageItem & { className?: string }) {
  return <img src={src} alt={alt} width={width} height={height} className={className} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/course-template/blog3.svg"; }} />;
}

function ProgramModal({ selected, onClose }: { selected: Selected; onClose: () => void }) {
  useEffect(() => {
    if (!selected) return;
    const escape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", escape);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", escape);
      document.body.classList.remove("modal-open");
    };
  }, [selected, onClose]);

  if (!selected) return null;
  const item = selected.item;
  const exchange = selected.type === "exchange";

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Tutup detail">×</button>
        <span className="blue-label">{exchange ? "EXCHANGE / STUDENT MOBILITY" : (item as ScholarshipProgram).category.toUpperCase()}</span>
        <h2 id="modal-title">{item.name}</h2>
        <p className="modal-lead">Informasi ringkas untuk membantu pengecekan awal. Selalu gunakan halaman resmi untuk memastikan ketentuan pendaftaran terbaru.</p>
        {exchange ? (
          <div className="detail-list">
            <div><span>Negara</span><strong>{(item as ExchangeProgram).country}</strong></div>
            <div><span>Jenjang</span><strong>{(item as ExchangeProgram).level}</strong></div>
            <div><span>Pendanaan</span><strong>{(item as ExchangeProgram).funding}</strong></div>
            <div><span>Benefit</span><strong>{(item as ExchangeProgram).benefits}</strong></div>
            <div><span>Syarat IPK</span><strong>{(item as ExchangeProgram).gpa}</strong></div>
            <div><span>IELTS / TOEFL</span><strong>{(item as ExchangeProgram).language}</strong></div>
            <div><span>Deadline</span><strong>{(item as ExchangeProgram).deadline}</strong></div>
          </div>
        ) : (
          <div className="detail-list">
            <div><span>Kategori</span><strong>{(item as ScholarshipProgram).category}</strong></div>
            <div><span>Negara / cakupan</span><strong>{(item as ScholarshipProgram).country}</strong></div>
            <div><span>Jenjang</span><strong>{(item as ScholarshipProgram).level}</strong></div>
          </div>
        )}
        <div className="check-note"><strong>Catatan pengecekan</strong><p>Deadline, benefit, kuota, dan persyaratan dapat berubah pada setiap periode. Periksa kembali sebelum mendaftar.</p></div>
        <a className="dark-button full-button" href={item.link} target="_blank" rel="noreferrer">Buka link resmi <span aria-hidden="true">↗</span></a>
      </section>
    </div>
  );
}

function ThreadModal({ thread, onClose }: { thread: any; onClose: () => void }) {
  const [repliesList, setRepliesList] = useState<string[]>([]);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    if (!thread) return;
    const escape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", escape);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", escape);
      document.body.classList.remove("modal-open");
    };
  }, [thread, onClose]);

  if (!thread) return null;

  const getMockReplies = (id: string) => {
    if (id === "t-1") {
      return [
        { author: "Maulidya", content: "Biasanya kirim email dengan subjek 'Inquiry about Internship/Study' dan sertakan CV serta draf rencana riset singkat. Jangan lupa sebutkan kenapa tertarik ke lab beliau.", time: "1 jam lalu" },
        { author: "William", content: "Betul, perhatikan juga waktu pengiriman email. Sebaiknya kirim jam 9-10 pagi waktu Jepang agar email kita ada di urutan atas inbox mereka." }
      ];
    } else if (id === "t-2") {
      return [
        { author: "Ajeng Ayu", content: "Untuk Erasmus+, biasanya syarat minimal IELTS 6.5. Namun beberapa universitas memperbolehkan 6.0 jika ada surat keterangan pengantar bahasa Inggris dari kampus asal.", time: "3 jam lalu" }
      ];
    } else if (id === "t-3") {
      return [
        { author: "Flavia", content: "Wah pas banget lagi cari grup region Asia. Terima kasih link-nya kak!", time: "18 jam lalu" },
        { author: "Budi", content: "Sama-sama! Mari berdiskusi sehat di grup ya teman-teman.", time: "15 jam lalu" }
      ];
    }
    return [
      { author: "Alumni KASANA", content: "Pertanyaan yang bagus! Saya menyarankan untuk sering ikut mentoring gratis seperti ini untuk memperbanyak insight.", time: "Baru saja" }
    ];
  };

  const allReplies = [...getMockReplies(thread.id), ...repliesList.map(r => ({ author: "Pengguna (Anda)", content: r, time: "Baru saja" }))];

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    setRepliesList([...repliesList, newReply]);
    setNewReply("");
  };

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="thread-modal-title" onMouseDown={(event) => event.stopPropagation()} style={{ maxWidth: '640px' }}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Tutup diskusi">×</button>
        <span className="blue-label" style={{ textTransform: 'uppercase' }}>Diskusi · {thread.category}</span>
        <h2 id="thread-modal-title" style={{ fontSize: '24px', marginTop: '8px' }}>{thread.title}</h2>
        <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--muted)', marginBottom: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
          <span>Ditanyakan oleh <strong>{thread.author}</strong></span>
          <span>•</span>
          <span>{thread.time}</span>
        </div>

        <div className="thread-replies-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--navy)' }}>Balasan ({allReplies.length})</h4>
          {allReplies.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Belum ada balasan. Jadilah yang pertama membalas!</p>
          ) : (
            allReplies.map((reply, i) => (
              <div key={i} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: '8px', background: 'var(--soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>
                  <strong>{reply.author}</strong>
                  <span>{reply.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: 'var(--ink)' }}>{reply.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmitReply} style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <label htmlFor="reply-input" style={{ fontSize: '13px', fontWeight: '700', color: '#4b5260' }}>Tulis Balasan Anda</label>
            <textarea
              id="reply-input"
              rows={3}
              placeholder="Berikan tanggapan atau bantuan Anda..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d9dde3', borderRadius: '6px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="dark-button" style={{ alignSelf: 'flex-end', minHeight: '38px', padding: '8px 16px' }}>Kirim Balasan</button>
        </form>
      </section>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("exchange");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Selected>(null);

  // --- STATE FOR MY TRACKER ---
  const [trackerList, setTrackerList] = useState<{ id: string; name: string; deadline: string }[]>([]);
  const [activeTrackerId, setActiveTrackerId] = useState<string>("");
  const [checklists, setChecklists] = useState<Record<string, Record<string, boolean>>>({});

  // --- STATE FOR FORUM ---
  const [forumCategory, setForumCategory] = useState<string>("Semua");
  const [threads, setThreads] = useState([
    { id: "t-1", title: "Bagaimana cara meminta LoA dari profesor universitas di Jepang? Ada template email?", category: "Tips & Trik", author: "Budi Santoso", upvotes: 42, replies: 12, time: "2 jam lalu", upvoted: false },
    { id: "t-2", title: "Apakah IELTS 6.0 cukup untuk melamar Exchange ke Eropa (Erasmus)?", category: "Syarat Bahasa", author: "Siti Rahma", upvotes: 18, replies: 6, time: "4 jam lalu", upvoted: false },
    { id: "t-3", title: "Grup WhatsApp Pendaftaran IISMA 2026 Region Asia - yuk gabung!", category: "Komunitas", author: "William Eka", upvotes: 89, replies: 34, time: "1 hari lalu", upvoted: false },
    { id: "t-4", title: "Tips menulis Motivation Letter LPDP agar lolos screening administrasi", category: "Tips & Trik", author: "Ajeng Ayu", upvotes: 56, replies: 15, time: "2 hari lalu", upvoted: false }
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("Tips & Trik");
  const [selectedThread, setSelectedThread] = useState<any>(null);

  useEffect(() => {
    // Load from localStorage or pre-populate defaults for BPC Demo
    const savedTracker = localStorage.getItem("kasana_tracker");
    const savedChecklists = localStorage.getItem("kasana_checklist");

    if (savedTracker) {
      const parsed = JSON.parse(savedTracker);
      setTrackerList(parsed);
      if (parsed.length > 0) {
        setActiveTrackerId(parsed[0].id);
      }
    } else {
      const defaults = [
        { id: "exchange-1", name: "IISMA (Indonesian International Student Mobility Awards)", deadline: "31 Maret 2026" },
        { id: "scholarship-1", name: "Beasiswa LPDP Tahap 1", deadline: "25 Februari 2026" }
      ];
      setTrackerList(defaults);
      setActiveTrackerId("exchange-1");
      localStorage.setItem("kasana_tracker", JSON.stringify(defaults));
    }

    if (savedChecklists) {
      setChecklists(JSON.parse(savedChecklists));
    } else {
      const defaultChecklists = {
        "exchange-1": { cv: true, essay: true, recommendation: false, language: false, transcript: true },
        "scholarship-1": { cv: true, essay: false, recommendation: false, language: true, transcript: true }
      };
      setChecklists(defaultChecklists);
      localStorage.setItem("kasana_checklist", JSON.stringify(defaultChecklists));
    }
  }, []);

  const isTracked = (id: string) => trackerList.some(item => item.id === id);

  const toggleTrack = (item: ExchangeProgram | ScholarshipProgram) => {
    let newList;
    if (isTracked(item.id)) {
      newList = trackerList.filter(t => t.id !== item.id);
      setTrackerList(newList);
      if (activeTrackerId === item.id) {
        setActiveTrackerId(newList.length > 0 ? newList[0].id : "");
      }
    } else {
      const deadline = "deadline" in item ? item.deadline : "Cek situs resmi penyelenggara";
      newList = [...trackerList, { id: item.id, name: item.name, deadline }];
      setTrackerList(newList);
      setActiveTrackerId(item.id);
      
      if (!checklists[item.id]) {
        const updatedChecklists = {
          ...checklists,
          [item.id]: { cv: false, essay: false, recommendation: false, language: false, transcript: false }
        };
        setChecklists(updatedChecklists);
        localStorage.setItem("kasana_checklist", JSON.stringify(updatedChecklists));
      }
    }
    localStorage.setItem("kasana_tracker", JSON.stringify(newList));
  };

  const handleRemoveTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newList = trackerList.filter(t => t.id !== id);
    setTrackerList(newList);
    if (activeTrackerId === id) {
      setActiveTrackerId(newList.length > 0 ? newList[0].id : "");
    }
    localStorage.setItem("kasana_tracker", JSON.stringify(newList));
  };

  const toggleChecklist = (programId: string, itemKey: string) => {
    const programChecklist = checklists[programId] || { cv: false, essay: false, recommendation: false, language: false, transcript: false };
    const updated = {
      ...checklists,
      [programId]: {
        ...programChecklist,
        [itemKey]: !programChecklist[itemKey]
      }
    };
    setChecklists(updated);
    localStorage.setItem("kasana_checklist", JSON.stringify(updated));
  };

  const getProgress = (programId: string) => {
    const programChecklist = checklists[programId];
    if (!programChecklist) return 0;
    const values = Object.values(programChecklist);
    const checked = values.filter(Boolean).length;
    return Math.round((checked / values.length) * 100);
  };

  const handleUpvote = (id: string) => {
    setThreads(threads.map(t => {
      if (t.id === id) {
        return {
          ...t,
          upvotes: t.upvoted ? t.upvotes - 1 : t.upvotes + 1,
          upvoted: !t.upvoted
        };
      }
      return t;
    }));
  };

  const handleAddThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newThread = {
      id: `t-${Date.now()}`,
      title: newTitle,
      category: newCat,
      author: "Pengguna (Anda)",
      upvotes: 1,
      replies: 0,
      time: "Baru saja",
      upvoted: true
    };
    setThreads([newThread, ...threads]);
    setNewTitle("");
  };

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (tab === "exchange") return exchangePrograms.filter((item) => !keyword || `${item.name} ${item.country} ${item.level}`.toLowerCase().includes(keyword));
    return scholarshipPrograms.filter((item) => (category === "Semua" || item.category === category) && (!keyword || `${item.name} ${item.country} ${item.level}`.toLowerCase().includes(keyword)));
  }, [tab, query, category]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_LIMIT);
  const changeTab = (next: Tab) => {
    setTab(next);
    setQuery("");
    setCategory("Semua");
    setShowAll(false);
  };

  return (
    <>
      <header className="floating-nav">
        <a className="brand" href="#home" aria-label="KASANA beranda"><img src="/kasana-logo.png" alt="KASANA" width={48} height={54} /></a>
        <nav aria-label="Navigasi utama"><a href="#tentang">Tentang</a><a href="#kategori">Kategori</a><a href="#program">Program</a><a href="#tracker">Tracker</a><a href="#komunitas">Komunitas</a><a href="#panduan">Panduan</a></nav>
        <a className="dark-button nav-button" href="#program">Lihat Program</a>
      </header>

      <main id="home">
        <section className="template-hero">
          <img src="/course-template/hero.svg" alt="" width={721} height={720} className="hero-image" />
          <div className="hero-container">
            <div className="hero-card">
              <span className="blue-label">PLATFORM INFORMASI AKADEMIK</span>
              <h1>Temukan peluang belajar tanpa batas.</h1>
              <p>KASANA menghadirkan program exchange, student mobility, serta beasiswa nasional dan internasional dalam satu direktori terintegrasi.</p>
              <div className="hero-buttons"><a className="dark-button" href="#program">Lihat semua program</a><a className="outline-button" href="#tentang">Tentang KASANA</a></div>
              <div className="hero-metrics">
                <div><strong>50</strong><span>Exchange</span></div>
                <div><strong>20</strong><span>Nasional</span></div>
                <div><strong>30</strong><span>Internasional</span></div>
                <div><strong>100</strong><span>Total program</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section" id="tentang">
          <div className="section-heading"><h2>Informasi penting dalam satu platform</h2><p>KASANA membantu pengguna menemukan titik awal yang jelas sebelum menuju situs resmi penyelenggara.</p></div>
          <div className="stats-grid">
            <article><span className="stat-icon">01</span><strong>100</strong><p>Program terkurasi</p></article>
            <article><span className="stat-icon">02</span><strong>50</strong><p>Student mobility</p></article>
            <article><span className="stat-icon">03</span><strong>50</strong><p>Beasiswa pilihan</p></article>
            <article><span className="stat-icon">04</span><strong>30+</strong><p>Negara & cakupan</p></article>
          </div>
        </section>

        <section className="categories-section" id="kategori">
          <div className="section-heading"><h2>Kategori program</h2><p>Pilih kelompok informasi sesuai kebutuhan pendidikan dan rencana mobilitasmu.</p></div>
          <div className="category-layout">
            <article className="category-main">
              <div className="category-shade" />
              <div className="category-main-content"><span>100 PROGRAM TERPILIH</span><h3>Mulai perjalanan akademikmu bersama KASANA</h3><p>Gunakan kategori dan pencarian untuk menemukan program yang sesuai.</p><a className="light-button" href="#program">Jelajahi sekarang</a></div>
            </article>
            <div className="category-stack">
              <button type="button" className="category-card cat-one" onClick={() => { changeTab("exchange"); location.hash = "program"; }}><span>↗</span><div><h3>Exchange & Student Mobility</h3><p>50 program</p></div></button>
              <button type="button" className="category-card cat-two" onClick={() => { changeTab("scholarship"); setCategory("Beasiswa Nasional"); location.hash = "program"; }}><span>⌂</span><div><h3>Beasiswa Nasional</h3><p>20 program</p></div></button>
            </div>
            <div className="category-stack">
              <button type="button" className="category-card cat-three" onClick={() => { changeTab("scholarship"); setCategory("Beasiswa Internasional"); location.hash = "program"; }}><span>◎</span><div><h3>Beasiswa Internasional</h3><p>30 program</p></div></button>
              <a className="category-card cat-four" href="#panduan"><span>✓</span><div><h3>Panduan Pengecekan</h3><p>Deadline & persyaratan</p></div></a>
            </div>
          </div>
        </section>

        <section className="programs-section" id="program">
          <div className="section-heading"><h2>Jelajahi program</h2><p>Telusuri seluruh data milik KASANA dan buka informasi lengkap pada setiap kartu.</p></div>
          <div className="directory-controls">
            <div className="tab-buttons"><button type="button" className={tab === "exchange" ? "active" : ""} onClick={() => changeTab("exchange")}>Exchange / Student Mobility</button><button type="button" className={tab === "scholarship" ? "active" : ""} onClick={() => changeTab("scholarship")}>Beasiswa</button></div>
            <div className="filter-row">
              <label><span>Cari program</span><input value={query} onChange={(event) => { setQuery(event.target.value); setShowAll(false); }} placeholder="Nama program, negara, atau jenjang" /></label>
              {tab === "scholarship" && <label><span>Kategori</span><select value={category} onChange={(event) => { setCategory(event.target.value); setShowAll(false); }}><option>Semua</option><option>Beasiswa Nasional</option><option>Beasiswa Internasional</option></select></label>}
              <div className="result-number"><strong>{filtered.length}</strong><span>program ditemukan</span></div>
            </div>
          </div>

          {visible.length ? <div className="course-grid">{visible.map((item, index) => (
            <article className="course-card" key={item.id}>
              <div className="course-image"><StaticImage src={getProgramImage(item, tab)} alt={`Visual ${item.name}`} width={768} height={520} /></div>
              <div className="course-body">
                <span className="course-tag">{tab === "exchange" ? `Exchange · ${item.level}` : `${(item as ScholarshipProgram).category} · ${item.level}`}</span>
                <h3>{item.name}</h3>
                <p>{item.country}. Informasi awal tersedia dan terhubung langsung ke sumber resmi penyelenggara.</p>
                <div className="course-buttons-row">
                  <button type="button" className="outline-button" onClick={() => setSelected({ type: tab, item })}>Lihat detail</button>
                  <button 
                    type="button" 
                    className={`tracker-toggle-btn ${isTracked(item.id) ? "active" : ""}`} 
                    onClick={() => toggleTrack(item)}
                    aria-label={isTracked(item.id) ? "Hapus dari pelacak pendaftaran" : "Tambah ke pelacak pendaftaran"}
                  >
                    {isTracked(item.id) ? "✓ Di Pelacak" : "+ Ke Pelacak"}
                  </button>
                </div>
              </div>
            </article>
          ))}</div> : <div className="empty-message"><strong>Program tidak ditemukan.</strong><p>Coba kata kunci atau kategori lain.</p></div>}
          {filtered.length > INITIAL_LIMIT && <button type="button" className="load-button" onClick={() => setShowAll((value) => !value)}>{showAll ? "Tampilkan lebih sedikit" : `Lihat ${filtered.length - INITIAL_LIMIT} program lainnya`}</button>}
        </section>

        {/* --- SECTION MY TRACKER --- */}
        <section className="tracker-section" id="tracker">
          <div className="section-heading">
            <h2>Pelacak Pendaftaran Saya</h2>
            <p>Simpan program favoritmu, pantau kelengkapan dokumen pendaftaran, dan lihat tingkat kesiapan aplikasi beasiswamu secara terorganisir.</p>
          </div>

          <div className="tracker-container">
            {trackerList.length === 0 ? (
              <div className="tracker-empty">
                <strong>Belum ada program di pelacakmu.</strong>
                <p>Jelajahi program di atas dan klik tombol "+ Ke Pelacak" untuk mulai memantau dokumen persyaratan.</p>
              </div>
            ) : (
              <>
                <div className="tracker-list">
                  {trackerList.map((item) => {
                    const percent = getProgress(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`tracker-item-btn ${activeTrackerId === item.id ? "active" : ""}`}
                        onClick={() => setActiveTrackerId(item.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setActiveTrackerId(item.id)}
                      >
                        <button
                          type="button"
                          className="tracker-remove-btn"
                          onClick={(e) => handleRemoveTrack(item.id, e)}
                          title="Hapus dari pelacak"
                        >
                          ×
                        </button>
                        <div className="tracker-item-header">
                          <h3>{item.name}</h3>
                        </div>
                        <div className="tracker-item-deadline">Deadline: {item.deadline}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <div className="tracker-progress-bar-bg" style={{ flex: 1, marginRight: '12px' }}>
                            <div className="tracker-progress-bar-fill" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="tracker-item-percent">{percent}% Selesai</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="tracker-checklist-card">
                  {activeTrackerId && trackerList.some(t => t.id === activeTrackerId) ? (
                    (() => {
                      const activeProgram = trackerList.find(t => t.id === activeTrackerId)!;
                      const percent = getProgress(activeProgram.id);
                      const checklist = checklists[activeProgram.id] || { cv: false, essay: false, recommendation: false, language: false, transcript: false };
                      return (
                        <>
                          <h3>Persyaratan Dokumen</h3>
                          <p style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: '16px' }}>{activeProgram.name}</p>
                          
                          <div className="checklist-progress-summary">
                            <span className="checklist-progress-text">{percent}%</span>
                            <div>
                              <strong>Kesiapan Dokumen</strong>
                              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                                {Object.values(checklist).filter(Boolean).length} dari 5 dokumen siap diunggah.
                              </p>
                            </div>
                          </div>

                          <div className="checklist-items">
                            <label className={`checklist-label ${checklist.cv ? "checked" : ""}`}>
                              <input
                                type="checkbox"
                                checked={checklist.cv || false}
                                onChange={() => toggleChecklist(activeProgram.id, "cv")}
                              />
                              <span>Curriculum Vitae (CV) / Resume Terbaru</span>
                            </label>
                            <label className={`checklist-label ${checklist.essay ? "checked" : ""}`}>
                              <input
                                type="checkbox"
                                checked={checklist.essay || false}
                                onChange={() => toggleChecklist(activeProgram.id, "essay")}
                              />
                              <span>Esai Persyaratan / Motivation Letter</span>
                            </label>
                            <label className={`checklist-label ${checklist.recommendation ? "checked" : ""}`}>
                              <input
                                type="checkbox"
                                checked={checklist.recommendation || false}
                                onChange={() => toggleChecklist(activeProgram.id, "recommendation")}
                              />
                              <span>Surat Rekomendasi Akademik</span>
                            </label>
                            <label className={`checklist-label ${checklist.language ? "checked" : ""}`}>
                              <input
                                type="checkbox"
                                checked={checklist.language || false}
                                onChange={() => toggleChecklist(activeProgram.id, "language")}
                              />
                              <span>Sertifikat Kemampuan Bahasa (IELTS/TOEFL)</span>
                            </label>
                            <label className={`checklist-label ${checklist.transcript ? "checked" : ""}`}>
                              <input
                                type="checkbox"
                                checked={checklist.transcript || false}
                                onChange={() => toggleChecklist(activeProgram.id, "transcript")}
                              />
                              <span>Transkrip Nilai Akademik Terjemahan</span>
                            </label>
                          </div>
                          
                          <div style={{ marginTop: '24px', padding: '16px', borderRadius: '8px', background: 'var(--soft)', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '18px', color: 'var(--blue)' }}>ℹ</span>
                            <p style={{ margin: 0, color: 'var(--muted)' }}>Sistem melacak progres Anda secara lokal. KASANA akan mengirimkan email pengingat saat Anda menyalakan sinkronisasi akun.</p>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>
                      Pilih program di sebelah kiri untuk melihat detail dokumen.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* --- SECTION FORUM --- */}
        <section className="forum-section" id="komunitas">
          <div className="section-heading">
            <h2>Komunitas & Tanya Jawab</h2>
            <p>Hubungkan dirimu dengan sesama pelamar program, bagikan pengalaman menulis esai, serta diskusikan info terbaru seputar beasiswa dan exchange.</p>
          </div>

          <div className="forum-container">
            <div>
              <div className="forum-filters">
                {["Semua", "Tips & Trik", "Syarat Bahasa", "Komunitas"].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    className={`forum-filter-btn ${forumCategory === cat ? "active" : ""}`}
                    onClick={() => setForumCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="thread-list">
                {threads
                  .filter(t => forumCategory === "Semua" || t.category === forumCategory)
                  .map((thread) => (
                    <article 
                      className="thread-card" 
                      key={thread.id}
                      onClick={() => setSelectedThread(thread)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="thread-main">
                        <span className={`thread-category ${
                          thread.category === "Tips & Trik" ? "cat-tips" :
                          thread.category === "Syarat Bahasa" ? "cat-bahasa" : "cat-komunitas"
                        }`}>
                          {thread.category}
                        </span>
                        <h3 className="thread-title">{thread.title}</h3>
                        <div className="thread-meta">
                          <span>Oleh: <strong>{thread.author}</strong></span>
                          <span>•</span>
                          <span>{thread.time}</span>
                        </div>
                      </div>
                      <div className="thread-stats">
                        <button
                          type="button"
                          className={`upvote-btn ${thread.upvoted ? "upvoted" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvote(thread.id);
                          }}
                        >
                          <span className="like-icon">❤️</span>
                          <span>{thread.upvotes}</span>
                        </button>
                        <span className="reply-count">💬 {thread.replies} balasan</span>
                      </div>
                    </article>
                  ))}
              </div>
            </div>

            <div className="forum-sidebar">
              <div className="post-form-card">
                <h3>Buat Diskusi Baru</h3>
                <form onSubmit={handleAddThread}>
                  <div className="form-group">
                    <label htmlFor="thread-title">Judul Diskusi</label>
                    <input
                      id="thread-title"
                      placeholder="Apa yang ingin Anda tanyakan atau bagikan?"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="thread-cat">Kategori</label>
                    <select
                      id="thread-cat"
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                    >
                      <option>Tips & Trik</option>
                      <option>Syarat Bahasa</option>
                      <option>Komunitas</option>
                    </select>
                  </div>
                  <button type="submit" className="dark-button" style={{ marginTop: '8px' }}>Posting Pertanyaan</button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-section">
          <div className="feature-image"><StaticImage src="/course-template/blog6.svg" alt="" width={768} height={768} /></div>
          <div className="feature-copy"><span className="blue-label">INFORMASI TERPUSAT</span><h2>Dari pencarian menuju sumber resmi.</h2><p>KASANA merangkum informasi utama agar pengguna dapat memahami gambaran program sebelum membuka halaman penyelenggara.</p><ul><li>Daftar exchange dan student mobility</li><li>Beasiswa nasional dan internasional</li><li>Catatan pengecekan deadline dan persyaratan</li></ul><div className="team-inline"><img src="/kasana-logo.png" alt="KASANA" width={58} height={58} /><div><strong>KASANA</strong><span>Inovasi Digital & Berkelanjutan</span></div></div></div>
        </section>

        <section className="guide-section" id="panduan">
          <div className="section-heading"><h2>Cara menggunakan KASANA</h2><p>Empat langkah sederhana sebelum melakukan pendaftaran pada situs resmi.</p></div>
          <div className="guide-grid">
            {GUIDE_STEPS.map((step, index) => <article key={step.title}><StaticImage src={step.image} alt="" width={520} height={330} /><div><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></div></article>)}
          </div>
        </section>

        <section className="principles-section">
          <div className="section-heading"><h2>Prinsip informasi KASANA</h2><p>Konten disusun untuk membantu pencarian tanpa menggantikan informasi resmi.</p></div>
          <div className="principles-grid"><article><span>✓</span><h3>Ringkas dan terstruktur</h3><p>Informasi inti disajikan dengan format yang konsisten.</p></article><article><span>✓</span><h3>Tautan sumber resmi</h3><p>Setiap program memiliki jalur menuju penyelenggara.</p></article><article><span>✓</span><h3>Tanpa asumsi</h3><p>Informasi yang belum tersedia diarahkan untuk diverifikasi.</p></article></div>
        </section>

        <section className="sources-section">
          <p>SUMBER INFORMASI PROGRAM</p><h2>Terhubung dengan berbagai penyelenggara</h2>
          <div className="partner-grid">
            {PARTNER_LOGOS.map((logo) => (
              <div className="partner-logo" key={logo.src}>
                <StaticImage {...logo} />
              </div>
            ))}
          </div>
          <p className="partner-note">dan berbagai penyelenggara program pendidikan lainnya.</p>
        </section>
      </main>

      <footer>
        <div className="footer-columns">
          <div className="footer-brand"><img src="/kasana-logo.png" alt="KASANA" width={97} height={110} /><p>Platform informasi exchange dan beasiswa yang terhubung dengan sumber resmi.</p></div>
          <div><strong>Platform</strong><a href="#tentang">Tentang</a><a href="#kategori">Kategori</a><a href="#program">Program</a></div>
          <div><strong>Program</strong><button type="button" onClick={() => { changeTab("exchange"); location.hash = "program"; }}>Exchange</button><button type="button" onClick={() => { changeTab("scholarship"); location.hash = "program"; }}>Beasiswa</button></div>
          <div><strong>Tim KASANA</strong><span>Ajeng Ayu Nurkaidah</span><span>Flavia Estrela T. Firmansyah</span><span>Maulidya Sayyidina A. Syamsul</span><span>William Eka Chandra</span></div>
        </div>
        <p className="copyright">© 2026 KASANA · Inovasi Digital & Berkelanjutan</p>
      </footer>

      <ProgramModal selected={selected} onClose={() => setSelected(null)} />
      <ThreadModal thread={selectedThread} onClose={() => setSelectedThread(null)} />
    </>
  );
}
