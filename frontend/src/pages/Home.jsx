import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CulturalMap from '../components/CulturalMap'
import { Camera, ChevronRight, Sparkles, Zap, X, ScanLine, Scan } from 'lucide-react'

/* ── Inject keyframes ────────────────────────────────────────────────────── */
const HOME_STYLE = `
@keyframes orbDrift1 {
  0%,100% { transform: translate(0px, 0px) scale(1); }
  33%      { transform: translate(40px, -30px) scale(1.08); }
  66%      { transform: translate(-25px, 20px) scale(0.95); }
}
@keyframes orbDrift2 {
  0%,100% { transform: translate(0px, 0px) scale(1); }
  33%      { transform: translate(-35px, 25px) scale(1.06); }
  66%      { transform: translate(30px, -20px) scale(0.97); }
}
@keyframes shimmerBtn {
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
}
@keyframes fabFloat {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-5px); }
}
@keyframes ringPulseWarm {
  0%   { transform: scale(1);   opacity: 0.5; }
  100% { transform: scale(2.0); opacity: 0;   }
}
@keyframes scanLine {
  0%   { top: 8px; }
  50%  { top: calc(100% - 8px); }
  100% { top: 8px; }
}
@keyframes mandalaSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes mandalaSpinReverse {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}
@keyframes flickerDiya {
  0%,100% { opacity: 1; transform: scaleY(1) translateX(0); }
  25%      { opacity: 0.88; transform: scaleY(1.05) translateX(1px); }
  50%      { opacity: 0.95; transform: scaleY(0.97) translateX(-1px); }
  75%      { opacity: 0.92; transform: scaleY(1.03) translateX(0.5px); }
}
.artform-card-img {
  transition: transform 0.7s cubic-bezier(.25,.46,.45,.94);
}
.artform-card:hover .artform-card-img {
  transform: scale(1.1);
}
.artform-card {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.artform-card:hover {
  box-shadow: 0 28px 60px rgba(60,20,0,0.32) !important;
  transform: translateY(-4px);
}
.shimmer-btn {
  background: linear-gradient(
    100deg,
    #9B3A0A 0%, #C45C1A 25%, #D96B2A 40%,
    #F0A050 50%, #D96B2A 60%, #C45C1A 75%, #9B3A0A 100%
  );
  background-size: 300% auto;
  animation: shimmerBtn 3.5s linear infinite, fabFloat 4.5s ease-in-out infinite;
}
.shimmer-btn:hover {
  animation: shimmerBtn 1.8s linear infinite, fabFloat 4.5s ease-in-out infinite;
  box-shadow: 0 8px 36px rgba(196,92,26,0.55) !important;
}
.discover-option-card {
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}
.discover-option-card:hover {
  transform: translateY(-3px);
}
.qr-scanner-wrap video {
  border-radius: 12px;
  width: 100% !important;
  height: auto !important;
}
.qr-scanner-wrap > div {
  border-radius: 12px !important;
  overflow: hidden !important;
}
/* Rangoli background pattern for hero */
.rangoli-section {
  background-image:
    radial-gradient(circle at 15% 85%, rgba(196,92,26,0.05) 0%, transparent 45%),
    radial-gradient(circle at 85% 15%, rgba(55,48,163,0.04) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, rgba(212,147,10,0.03) 0%, transparent 55%);
}
`
let homeStyleInjected = false
function ensureHomeStyle() {
    if (homeStyleInjected) return
    const s = document.createElement('style')
    s.textContent = HOME_STYLE
    document.head.appendChild(s)
    homeStyleInjected = true
}
ensureHomeStyle()

/* ── Decorative mandala SVG ──────────────────────────────────────────────── */
function MandalaBg({ size = 320, opacity = 0.035, spin = false, reverse = false }) {
    const style = spin
        ? { animation: `${reverse ? 'mandalaSpinReverse' : 'mandalaSpin'} ${reverse ? 80 : 120}s linear infinite` }
        : {}
    return (
        <svg width={size} height={size} viewBox="0 0 200 200" style={{ ...style, display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <g opacity={opacity} stroke="#C45C1A" fill="none">
                <circle cx="100" cy="100" r="90" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="75" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="55" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="35" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="15" strokeWidth="0.5" />
                {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
                    <line key={a}
                        x1={100 + 15*Math.cos(a*Math.PI/180)} y1={100 + 15*Math.sin(a*Math.PI/180)}
                        x2={100 + 90*Math.cos(a*Math.PI/180)} y2={100 + 90*Math.sin(a*Math.PI/180)}
                        strokeWidth="0.4" />
                ))}
                {[0,45,90,135,180,225,270,315].map(a => (
                    <ellipse key={a} cx={100 + 55*Math.cos(a*Math.PI/180)} cy={100 + 55*Math.sin(a*Math.PI/180)}
                        rx="8" ry="4"
                        transform={`rotate(${a}, ${100 + 55*Math.cos(a*Math.PI/180)}, ${100 + 55*Math.sin(a*Math.PI/180)})`}
                        strokeWidth="0.5" />
                ))}
                {[0,60,120,180,240,300].map(a => (
                    <polygon key={a}
                        points={`${100 + 75*Math.cos(a*Math.PI/180)},${100 + 75*Math.sin(a*Math.PI/180)} ${100 + 67*Math.cos((a+10)*Math.PI/180)},${100 + 67*Math.sin((a+10)*Math.PI/180)} ${100 + 67*Math.cos((a-10)*Math.PI/180)},${100 + 67*Math.sin((a-10)*Math.PI/180)}`}
                        strokeWidth="0.5" />
                ))}
            </g>
        </svg>
    )
}

/* ── Art form data ───────────────────────────────────────────────────────── */
const ART_FORMS = [
    { slug: 'warli',      name: 'Warli',      origin: 'Maharashtra',     emoji: '🌿', image: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=800', accent: '#C45C1A', desc: 'Tribal geometry of life' },
    { slug: 'madhubani',  name: 'Madhubani',  origin: 'Bihar',           emoji: '🌸', image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800', accent: '#3730A3', desc: 'Mithila women\'s devotion' },
    { slug: 'gond',       name: 'Gond Art',   origin: 'Madhya Pradesh',  emoji: '🌳', image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=800', accent: '#166534', desc: 'Tribal forest whispers' },
    { slug: 'pattachitra',name: 'Pattachitra',origin: 'Odisha',          emoji: '📜', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',    accent: '#7C3AED', desc: 'Sacred cloth painting' },
    { slug: 'dhokra',     name: 'Dhokra',     origin: 'Chhattisgarh',   emoji: '🔱', image: 'https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=600&q=80',  accent: '#92400E', desc: '4000 years of lost-wax' },
    { slug: 'kalamkari',  name: 'Kalamkari',  origin: 'Andhra Pradesh',  emoji: '✒️', image: 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=600&q=80',  accent: '#0F766E', desc: 'Pen craft on living cloth' },
]

/* ── Framer variants ─────────────────────────────────────────────────────── */
const heroVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.75, delay: i * 0.18, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
}
const cardContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.11, delayChildren: 0.3 } },
}
const cardVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const modalVariants = {
    hidden: { opacity: 0, scale: 0.93, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
}

/* ── ArtFormCard ─────────────────────────────────────────────────────────── */
function ArtFormCard({ art }) {
    const [hovered, setHovered] = useState(false)
    return (
        <motion.div variants={cardVariants}>
            <Link to={`/artform/${art.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                    id={`artform-card-${art.slug}`}
                    className="artform-card"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                        position: 'relative', borderRadius: '4px', overflow: 'hidden',
                        border: hovered ? `1.5px solid ${art.accent}66` : '1.5px solid #C4A870',
                        cursor: 'pointer', aspectRatio: '4/3',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                        boxShadow: '0 2px 0 rgba(180,130,50,0.3), 0 6px 20px rgba(60,25,5,0.14)',
                        background: '#e8ded4',
                    }}
                >
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                        <img className="artform-card-img" src={art.image} alt={art.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            onError={e => { e.currentTarget.style.display = 'none' }} />
                    </div>
                    {/* Gradient overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,4,1,0.93) 0%, rgba(10,4,1,0.45) 42%, rgba(10,4,1,0.04) 100%)' }} />
                    {hovered && <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at bottom left, ${art.accent}30 0%, transparent 65%)` }} />}

                    {/* Ornamental corner frame on hover */}
                    {hovered && <>
                        <div style={{ position: 'absolute', top: 8, left: 8, width: 20, height: 20, borderTop: `2px solid ${art.accent}`, borderLeft: `2px solid ${art.accent}`, opacity: 0.8 }} />
                        <div style={{ position: 'absolute', bottom: 8, right: 8, width: 20, height: 20, borderBottom: `2px solid ${art.accent}`, borderRight: `2px solid ${art.accent}`, opacity: 0.8 }} />
                    </>}

                    <div style={{ position: 'relative', zIndex: 2, padding: '14px 16px 18px' }}>
                        {/* Decorative rule */}
                        <div style={{ height: '1px', background: `linear-gradient(90deg, ${art.accent}80, transparent)`, marginBottom: '10px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{art.emoji}</div>
                                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '700', fontSize: '20px', color: '#FFF5E8', marginBottom: '2px', lineHeight: 1.1, letterSpacing: '0.3px' }}>{art.name}</h3>
                                <p style={{ color: 'rgba(255,230,190,0.6)', fontSize: '11px', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', marginBottom: '2px' }}>📍 {art.origin}</p>
                                {hovered && <p style={{ color: 'rgba(255,220,160,0.75)', fontSize: '11.5px', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>{art.desc}</p>}
                            </div>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '2px',
                                background: hovered ? art.accent : 'rgba(255,255,255,0.12)',
                                border: `1px solid ${hovered ? art.accent : 'rgba(255,255,255,0.2)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.25s', flexShrink: 0,
                            }}>
                                <ChevronRight size={15} color="white" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

/* ── QR Scanner ──────────────────────────────────────────────────────────── */
function QRScannerView({ onDetect, onCancel }) {
    const [ScannerComponent, setScannerComponent] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useState(() => {
        import('@yudiel/react-qr-scanner').then(mod => {
            setScannerComponent(() => mod.Scanner || mod.default)
            setLoading(false)
        }).catch(() => {
            setError('Camera library failed to load.')
            setLoading(false)
        })
    })

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '32px 0' }}>
            <div style={{ width: 32, height: 32, border: '3px solid #C4A870', borderTopColor: '#C45C1A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#78614A', fontSize: '15px', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>Starting camera…</p>
        </div>
    )
    if (error) return <p style={{ color: '#C45C1A', textAlign: 'center', padding: '24px', fontFamily: "'Crimson Pro', serif" }}>{error}</p>

    return (
        <div>
            <div className="qr-scanner-wrap" style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#000', marginBottom: '12px', border: '1px solid #C4A870' }}>
                {ScannerComponent && (
                    <ScannerComponent
                        onScan={(results) => {
                            if (results && results.length > 0) {
                                onDetect(results[0].rawValue || results[0].text || String(results[0]))
                            }
                        }}
                        onError={() => setError('Camera access denied. Please allow camera permissions.')}
                        constraints={{ facingMode: 'environment' }}
                        components={{ audio: false, torch: false }}
                        styles={{ container: { borderRadius: '4px', overflow: 'hidden' } }}
                    />
                )}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute', left: '12px', right: '12px', height: '2px',
                        background: 'linear-gradient(90deg, transparent, #D4930A, #F97316, #D4930A, transparent)',
                        animation: 'scanLine 2s ease-in-out infinite', boxShadow: '0 0 10px rgba(212,147,10,0.6)',
                    }} />
                    {[['0','0','bottom','right'], ['0','auto','bottom','left'], ['auto','0','top','right'], ['auto','auto','top','left']].map(([t,r,b,l], i) => (
                        <div key={i} style={{ position: 'absolute', top: t !== 'auto' ? '12px' : undefined, bottom: b !== 'auto' ? '12px' : undefined, left: l !== 'auto' ? '12px' : undefined, right: r !== 'auto' ? '12px' : undefined, width: '24px', height: '24px', borderStyle: 'solid', borderColor: '#D4930A', borderWidth: 0, borderTopWidth: t !== 'auto' ? '2px' : 0, borderBottomWidth: b !== 'auto' ? '2px' : 0, borderLeftWidth: l !== 'auto' ? '2px' : 0, borderRightWidth: r !== 'auto' ? '2px' : 0 }} />
                    ))}
                </div>
            </div>
            <p style={{ textAlign: 'center', color: '#78614A', fontSize: '13px', marginBottom: '16px', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>
                Point your camera at a KalaSetu QR code
            </p>
            <button onClick={onCancel} style={{ width: '100%', padding: '11px', borderRadius: '3px', border: '1px solid #C4A870', background: '#FBF5EA', color: '#78614A', cursor: 'pointer', fontSize: '15px', fontWeight: '600', fontFamily: "'Cormorant Garamond', serif" }}>
                ← Back to options
            </button>
        </div>
    )
}

/* ── Discovery Modal ─────────────────────────────────────────────────────── */
function DiscoveryModal({ onClose, navigate }) {
    const [view, setView] = useState('options')

    const handleQRDetect = useCallback((raw) => {
        const match = raw.match(/\/scan\/([a-zA-Z0-9_-]+)/)
        if (match) {
            onClose()
            navigate(`/scan/${match[1]}`)
        } else {
            const id = raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || 'demo'
            onClose()
            navigate(`/scan/${id}`)
        }
    }, [navigate, onClose])

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(30,15,5,0.6)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px',
            }}
        >
            <motion.div
                key="modal"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#FBF5EA',
                    border: '1px solid #C4A870',
                    borderTop: '3px solid #C45C1A',
                    borderRadius: '4px',
                    padding: '0',
                    width: '100%',
                    maxWidth: '460px',
                    boxShadow: '0 2px 0 rgba(155,90,10,0.4), 0 24px 64px rgba(30,15,5,0.25)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Ikat strip */}
                <div style={{
                    height: '4px',
                    background: 'repeating-linear-gradient(90deg, #C45C1A 0px, #C45C1A 8px, #D4930A 8px, #D4930A 12px, #D4790A 12px, #D4790A 16px, #3730A3 16px, #3730A3 20px)',
                    opacity: 0.75,
                }} />

                <div style={{ padding: '28px 28px 28px' }}>
                    {/* Close */}
                    <button
                        id="discovery-modal-close"
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: '16px', right: '16px',
                            width: '30px', height: '30px', borderRadius: '2px',
                            background: '#EDE5D0', border: '1px solid #C4A870',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#78614A',
                        }}
                    >
                        <X size={14} />
                    </button>

                    {view === 'options' ? (
                        <>
                            <div style={{ marginBottom: '22px', paddingRight: '32px' }}>
                                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: '700', color: '#1E0F05', marginBottom: '6px', letterSpacing: '0.3px' }}>
                                    Explore an Artifact
                                </h2>
                                <div style={{ height: '1px', background: 'linear-gradient(90deg, #C4A870, transparent)', marginBottom: '10px' }} />
                                <p style={{ color: '#78614A', fontSize: '14px', lineHeight: '1.7', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>
                                    How would you like to discover this piece of heritage?
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                                <button
                                    id="discovery-option-qr"
                                    className="discover-option-card"
                                    onClick={() => setView('qr')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '18px',
                                        padding: '18px 18px',
                                        background: '#FFF8EE',
                                        border: '1px solid #C4A870',
                                        borderLeft: '3px solid #C45C1A',
                                        borderRadius: '3px',
                                        cursor: 'pointer', textAlign: 'left',
                                        boxShadow: '0 2px 10px rgba(60,25,5,0.07)',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#FDF0E0'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(196,92,26,0.16)' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#FFF8EE'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(60,25,5,0.07)' }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '3px', background: 'linear-gradient(135deg, #FDF0E0, #F5DFC0)', border: '1px solid #D4A870', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Scan size={24} color="#C45C1A" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '700', fontSize: '17px', color: '#1E0F05', marginBottom: '2px' }}>
                                            🔳 Scan Living Tag
                                        </p>
                                        <p style={{ color: '#78614A', fontSize: '12.5px', lineHeight: '1.5', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>
                                            I have a KalaSetu QR code on a craft piece
                                        </p>
                                    </div>
                                    <ChevronRight size={17} color="#C45C1A" />
                                </button>

                                <Link
                                    id="discovery-option-artsnap"
                                    to="/artsnap"
                                    onClick={onClose}
                                    className="discover-option-card"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '18px',
                                        padding: '18px 18px',
                                        background: '#F8F7FF',
                                        border: '1px solid #C4A870',
                                        borderLeft: '3px solid #3730A3',
                                        borderRadius: '3px',
                                        cursor: 'pointer', textDecoration: 'none',
                                        boxShadow: '0 2px 10px rgba(60,25,5,0.07)',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#EEEEFF'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(55,48,163,0.14)' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#F8F7FF'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(60,25,5,0.07)' }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '3px', background: 'linear-gradient(135deg, #EDE9FF, #DDD6FE)', border: '1px solid #C4BCEE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Camera size={24} color="#3730A3" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '700', fontSize: '17px', color: '#1E0F05', marginBottom: '2px' }}>
                                            📷 Identify Art (AI Lens)
                                        </p>
                                        <p style={{ color: '#78614A', fontSize: '12.5px', lineHeight: '1.5', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>
                                            I want to identify an unknown Indian art piece
                                        </p>
                                    </div>
                                    <ChevronRight size={17} color="#3730A3" />
                                </Link>
                            </div>

                            <p style={{ textAlign: 'center', color: '#B09070', fontSize: '12px', marginTop: '18px', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>
                                ◆ Both options are free · Powered by KalaSetu AI ◆
                            </p>
                        </>
                    ) : (
                        <>
                            <div style={{ marginBottom: '18px', paddingRight: '32px' }}>
                                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '700', color: '#1E0F05', marginBottom: '4px' }}>
                                    🔳 Scan QR Code
                                </h2>
                                <div style={{ height: '1px', background: 'linear-gradient(90deg, #C4A870, transparent)', marginBottom: '8px' }} />
                                <p style={{ color: '#78614A', fontSize: '13px', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>
                                    Hold your camera steady over the KalaSetu tag
                                </p>
                            </div>
                            <QRScannerView onDetect={handleQRDetect} onCancel={() => setView('options')} />
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

/* ── Hero CTA Button ─────────────────────────────────────────────────────── */
function ExploreArtifactBtn({ onClick }) {
    const [pressed, setPressed] = useState(false)
    return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: '-18px', borderRadius: '4px', border: '1.5px solid rgba(196,92,26,0.25)', animation: 'ringPulseWarm 2.6s ease-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: '-18px', borderRadius: '4px', border: '1.5px solid rgba(212,147,10,0.18)', animation: 'ringPulseWarm 2.6s ease-out infinite 1.0s', pointerEvents: 'none' }} />
            <button
                id="explore-artifact-btn"
                className="shimmer-btn"
                onClick={onClick}
                onMouseDown={() => setPressed(true)}
                onMouseUp={() => setPressed(false)}
                onMouseLeave={() => setPressed(false)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '18px 48px',
                    borderRadius: '3px',
                    border: 'none',
                    color: '#FFF8EE',
                    cursor: 'pointer',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '18px', fontWeight: '700',
                    letterSpacing: '0.8px',
                    boxShadow: '0 3px 0 #9B3A0A, 0 6px 28px rgba(196,92,26,0.42)',
                    transform: pressed ? 'scale(0.97) translateY(2px)' : 'scale(1)',
                    transition: 'transform 0.1s',
                }}
            >
                <ScanLine size={19} />
                <span>Explore an Artifact</span>
                <Sparkles size={15} color="rgba(255,240,200,0.85)" />
            </button>
        </div>
    )
}

/* ── Home ────────────────────────────────────────────────────────────────── */
export default function Home() {
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)

    const openModal = useCallback(() => setModalOpen(true), [])
    const closeModal = useCallback(() => setModalOpen(false), [])

    return (
        <div style={{ minHeight: '100vh', background: '#FBF7F0', overflow: 'hidden', position: 'relative' }}>

            {/* ── Background mandala ornaments ─────────────────────────── */}
            <div style={{ position: 'fixed', top: '-100px', left: '-100px', pointerEvents: 'none', zIndex: 0 }}>
                <MandalaBg size={380} opacity={0.045} spin />
            </div>
            <div style={{ position: 'fixed', bottom: '-120px', right: '-120px', pointerEvents: 'none', zIndex: 0 }}>
                <MandalaBg size={420} opacity={0.035} spin reverse />
            </div>

            {/* ── Ambient warm orbs ────────────────────────────────────── */}
            <div style={{ position: 'fixed', top: '-100px', left: '-60px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,147,10,0.14) 0%, rgba(196,92,26,0.07) 40%, transparent 70%)', filter: 'blur(52px)', animation: 'orbDrift1 20s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-80px', right: '-50px', width: '460px', height: '460px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(55,48,163,0.1) 0%, rgba(55,48,163,0.03) 50%, transparent 70%)', filter: 'blur(56px)', animation: 'orbDrift2 24s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 1 }}>

                {/* ═══════════════════════════════════════════
                    HERO SECTION
                ═══════════════════════════════════════════ */}
                <section className="rangoli-section" style={{ padding: '72px 24px 60px', maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>

                        <motion.div custom={0} variants={heroVariants} initial="hidden" animate="visible">
                            <span className="tag-chip" style={{ marginBottom: '24px', display: 'inline-flex' }}>
                                🇮🇳 400+ GI-Tagged Craft Forms
                            </span>
                        </motion.div>

                        {/* Decorative Sanskrit-inspired ornament */}
                        <motion.div custom={0.5} variants={heroVariants} initial="hidden" animate="visible"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, transparent, #C4A870)' }} />
                            <span style={{ color: '#C4A870', fontSize: '12px', letterSpacing: '4px' }}>✦ ✦ ✦</span>
                            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, #C4A870, transparent)' }} />
                        </motion.div>

                        <motion.h1
                            custom={1} variants={heroVariants} initial="hidden" animate="visible"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: 'clamp(40px, 6.5vw, 72px)',
                                fontWeight: '700',
                                lineHeight: '1.06',
                                color: '#1E0F05',
                                letterSpacing: '-1px',
                                marginBottom: '16px',
                            }}
                        >
                            Discover India's<br />
                            <span className="gradient-text">Living Heritage</span>
                        </motion.h1>

                        {/* Italic subtitle in Crimson Pro */}
                        <motion.p
                            custom={2} variants={heroVariants} initial="hidden" animate="visible"
                            style={{
                                color: '#78614A',
                                fontFamily: "'Crimson Pro', serif",
                                fontStyle: 'italic',
                                fontSize: '19px',
                                maxWidth: '500px',
                                margin: '0 auto 36px',
                                lineHeight: '1.75',
                            }}
                        >
                            Every craft holds a universe. Explore folk art forms, meet the artisans behind them, and carry a piece of India's soul.
                        </motion.p>

                        <motion.div custom={3} variants={heroVariants} initial="hidden" animate="visible">
                            <ExploreArtifactBtn onClick={openModal} />
                        </motion.div>

                        <motion.p
                            custom={4} variants={heroVariants} initial="hidden" animate="visible"
                            style={{
                                color: '#B09070',
                                fontFamily: "'Crimson Pro', serif",
                                fontStyle: 'italic',
                                fontSize: '13px',
                                marginTop: '20px',
                                letterSpacing: '0.3px',
                            }}
                        >
                            ◆ Scan QR tags · AI identification · Free ◆
                        </motion.p>
                    </div>

                    {/* Art form grid */}
                    <motion.div
                        variants={cardContainerVariants} initial="hidden" animate="visible"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(295px, 1fr))', gap: '20px', marginBottom: '80px' }}
                    >
                        {ART_FORMS.map(art => <ArtFormCard key={art.slug} art={art} />)}
                    </motion.div>
                </section>

                {/* ═══════════════════════════════════════════
                    CULTURAL MAP
                ═══════════════════════════════════════════ */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 72px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
                        style={{ marginBottom: '24px' }}
                    >
                        {/* Section header with ornament */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                            <div style={{ height: '1px', width: '32px', background: '#C4A870' }} />
                            <span style={{ color: '#B09070', fontSize: '11px', fontFamily: "'Crimson Pro', serif", letterSpacing: '3px', textTransform: 'uppercase' }}>The Craft Atlas</span>
                        </div>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '700', fontSize: '34px', marginBottom: '6px', color: '#1E0F05', letterSpacing: '-0.3px' }}>
                            India's <span className="gradient-text">Craft Map</span>
                        </h2>
                        <p style={{ color: '#78614A', fontSize: '15px', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>Click any state to see what traditional crafts it's home to.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, delay: 0.1 }}
                        style={{
                            background: '#FBF5EA',
                            border: '1px solid #C4A870',
                            borderTop: '3px solid #C45C1A',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 0 rgba(180,130,50,0.3), 0 8px 32px rgba(60,25,5,0.1)',
                        }}
                    >
                        {/* Ikat strip at top */}
                        <div style={{
                            height: '4px',
                            background: 'repeating-linear-gradient(90deg, #C45C1A 0px, #C45C1A 8px, #D4930A 8px, #D4930A 12px, #D4790A 12px, #D4790A 16px, #3730A3 16px, #3730A3 20px)',
                            opacity: 0.7,
                        }} />
                        <CulturalMap />
                    </motion.div>
                </section>

                {/* ═══════════════════════════════════════════
                    ARTSNAP CTA BANNER
                ═══════════════════════════════════════════ */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 100px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65 }}
                        style={{
                            position: 'relative', overflow: 'hidden',
                            background: 'linear-gradient(135deg, #FDF0E0 0%, #FBF0D8 50%, #F5E4C0 100%)',
                            border: '1px solid #C4A870',
                            borderLeft: '4px solid #C45C1A',
                            borderRadius: '4px',
                            padding: '44px 44px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            gap: '28px', flexWrap: 'wrap',
                            boxShadow: '0 2px 0 rgba(180,130,50,0.3), 0 8px 32px rgba(60,25,5,0.1)',
                        }}
                    >
                        {/* Background mandala decoration */}
                        <div style={{ position: 'absolute', top: '-80px', right: '-80px', opacity: 0.06, pointerEvents: 'none' }}>
                            <MandalaBg size={280} opacity={1} />
                        </div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <Zap size={16} color="#C45C1A" />
                                <span style={{ color: '#C45C1A', fontSize: '10px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'Crimson Pro', serif" }}>AI-Powered Recognition</span>
                            </div>
                            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '700', fontSize: '30px', marginBottom: '12px', lineHeight: 1.15, color: '#1E0F05', letterSpacing: '0.2px' }}>
                                See a craft? <span style={{ color: '#C45C1A', fontStyle: 'italic' }}>Snap it.</span>
                            </h3>
                            <p style={{ color: '#78614A', fontFamily: "'Crimson Pro', serif", fontSize: '16px', maxWidth: '400px', lineHeight: 1.75, fontStyle: 'italic' }}>
                                Upload any photo of an Indian handicraft and our AI will identify the art form and suggest the artisans behind it.
                            </p>
                        </div>
                        <button
                            id="home-artsnap-cta"
                            onClick={openModal}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '17px 38px',
                                borderRadius: '3px',
                                border: 'none',
                                background: 'linear-gradient(100deg, #9B3A0A 0%, #C45C1A 30%, #D96B2A 50%, #C45C1A 70%, #9B3A0A 100%)',
                                backgroundSize: '300% auto',
                                animation: 'shimmerBtn 3.5s linear infinite',
                                color: '#FFF8EE',
                                cursor: 'pointer',
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '17px', fontWeight: '700',
                                letterSpacing: '0.5px',
                                boxShadow: '0 3px 0 #9B3A0A, 0 6px 24px rgba(196,92,26,0.4)',
                                position: 'relative', zIndex: 1, flexShrink: 0,
                            }}
                        >
                            <ScanLine size={17} />
                            Explore an Artifact
                        </button>
                    </motion.div>
                </section>
            </div>

            {/* ── Discovery Modal ──────────────────────────────────────── */}
            <AnimatePresence>
                {modalOpen && (
                    <DiscoveryModal onClose={closeModal} navigate={navigate} />
                )}
            </AnimatePresence>
        </div>
    )
}
