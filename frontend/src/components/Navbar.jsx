import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Camera, Palette, User, Map } from 'lucide-react'

const BADGE_KEY = 'kalasetu_badges'
function getBadges() {
    try { return JSON.parse(localStorage.getItem(BADGE_KEY) || '[]') } catch { return [] }
}

const STATE_FLAGS = {
    'Maharashtra': '🟠', 'Rajasthan': '🔵', 'West Bengal': '🟡', 'Gujarat': '🟢',
    'Uttar Pradesh': '🟣', 'Bihar': '🟤', 'Odisha': '🔶', 'Tamil Nadu': '🔷',
    'Kerala': '🟩', 'Karnataka': '🟦', 'Madhya Pradesh': '🟨', 'Assam': '🟫',
    'Andhra Pradesh': '🔴', 'Telangana': '🟥', 'Jharkhand': '🔸', 'Chhattisgarh': '🔹',
}
function stateEmoji(s) { return STATE_FLAGS[s] || '📍' }

// Decorative SVG motif for the navbar
const LotusMotif = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{opacity:0.55}}>
        <path d="M10 2 C10 2 7 6 7 10 C7 12.2 8.3 14 10 15 C11.7 14 13 12.2 13 10 C13 6 10 2 10 2Z" fill="#C45C1A"/>
        <path d="M2 10 C2 10 6 7 10 7 C12.2 7 14 8.3 15 10 C14 11.7 12.2 13 10 13 C6 13 2 10 2 10Z" fill="#D4930A" opacity="0.7"/>
        <path d="M18 10 C18 10 14 13 10 13 C7.8 13 6 11.7 5 10 C6 8.3 7.8 7 10 7 C14 7 18 10 18 10Z" fill="#D4930A" opacity="0.7"/>
        <circle cx="10" cy="10" r="2" fill="#B45309"/>
    </svg>
)

function PassportButton() {
    const [badges, setBadges] = useState([])
    const [open, setOpen] = useState(false)
    const dropRef = useRef(null)

    useEffect(() => {
        const refresh = () => setBadges(getBadges())
        refresh()
        window.addEventListener('focus', refresh)
        const interval = setInterval(refresh, 2000)
        return () => { window.removeEventListener('focus', refresh); clearInterval(interval) }
    }, [])

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const hasBadges = badges.length > 0

    return (
        <div ref={dropRef} style={{ position: 'relative' }}>
            <button
                id="passport-btn"
                onClick={() => setOpen(o => !o)}
                title={hasBadges ? `Cultural Passport — ${badges.length} badge${badges.length > 1 ? 's' : ''}` : 'Cultural Passport'}
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '2px',
                    border: hasBadges ? '1px solid rgba(196,92,26,0.5)' : '1px solid #C4A870',
                    background: hasBadges ? 'rgba(196,92,26,0.08)' : 'rgba(180,130,50,0.06)',
                    color: hasBadges ? '#C45C1A' : '#78614A',
                    cursor: 'pointer', fontSize: '14px',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: '600',
                    transition: 'all 0.2s', position: 'relative',
                    letterSpacing: '0.2px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = hasBadges ? 'rgba(196,92,26,0.14)' : 'rgba(180,130,50,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.background = hasBadges ? 'rgba(196,92,26,0.08)' : 'rgba(180,130,50,0.06)' }}
            >
                <Map size={14} />
                Passport
                {hasBadges && (
                    <span style={{
                        position: 'absolute', top: '-4px', right: '-4px',
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: '#C45C1A',
                        border: '2px solid #FBF7F0',
                    }} />
                )}
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    minWidth: '230px', zIndex: 200,
                    background: '#FBF5EA',
                    border: '1px solid #C4A870',
                    borderTop: '3px solid #C45C1A',
                    borderRadius: '3px',
                    boxShadow: '0 2px 0 rgba(180,130,50,0.3), 0 16px 48px rgba(60,25,5,0.18)',
                    overflow: 'hidden',
                }}>
                    {/* Ikat strip */}
                    <div style={{
                        height: '4px',
                        background: 'repeating-linear-gradient(90deg, #C45C1A 0px, #C45C1A 6px, #D4930A 6px, #D4930A 10px, #D4790A 10px, #D4790A 13px, #3730A3 13px, #3730A3 16px)',
                        opacity: 0.8,
                    }} />
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #E8D9BB' }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '700', fontSize: '15px', color: '#C45C1A', letterSpacing: '0.2px' }}>
                            🗺️ Cultural Passport
                        </p>
                        <p style={{ color: '#78614A', fontSize: '12px', marginTop: '2px', fontStyle: 'italic', fontFamily: "'Crimson Pro', serif" }}>
                            {hasBadges ? `${badges.length} state${badges.length > 1 ? 's' : ''} explored` : 'No badges yet — begin your journey'}
                        </p>
                    </div>

                    {hasBadges ? (
                        <div style={{ padding: '8px 0', maxHeight: '200px', overflowY: 'auto' }}>
                            {badges.map((state, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '9px 16px',
                                    borderBottom: i < badges.length - 1 ? '1px solid #EDE7D4' : 'none',
                                }}>
                                    <span style={{ fontSize: '18px' }}>{stateEmoji(state)}</span>
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#1E0F05', fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>{state}</p>
                                        <p style={{ fontSize: '11px', color: '#78614A', fontStyle: 'italic', fontFamily: "'Crimson Pro', serif" }}>{state} Explorer 🏅</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                            <p style={{ fontSize: '28px', marginBottom: '8px' }}>🔍</p>
                            <p style={{ fontSize: '13px', color: '#78614A', lineHeight: 1.6, fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>
                                Scan a KalaSetu tag to earn your first badge
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default function Navbar() {
    const location = useLocation()
    const isScan = location.pathname.startsWith('/scan/')

    if (isScan) {
        return (
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: 'rgba(251,247,240,0.96)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid #C4A870',
                padding: '0 20px', height: '58px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 1px 0 rgba(180,130,50,0.2), 0 2px 12px rgba(60,25,5,0.06)',
            }}>
                {/* Ikat bottom strip */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                    background: 'repeating-linear-gradient(90deg, #C45C1A 0px, #C45C1A 8px, #D4930A 8px, #D4930A 12px, #D4790A 12px, #D4790A 16px, #3730A3 16px, #3730A3 20px)',
                    opacity: 0.7,
                }} />
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <LotusMotif />
                    <span className="gradient-text" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '700', fontSize: '20px', letterSpacing: '0.5px' }}>KalaSetu</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="tag-chip">✅ Verified Product</span>
                    <PassportButton />
                </div>
            </nav>
        )
    }

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            background: 'rgba(251,247,240,0.97)',
            backdropFilter: 'blur(18px)',
            borderBottom: '1px solid #C4A870',
            padding: '0 32px', height: '64px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 1px 0 rgba(180,130,50,0.25), 0 4px 16px rgba(60,25,5,0.07)',
        }}>
            {/* Decorative ikat strip at bottom of navbar */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                background: 'repeating-linear-gradient(90deg, #C45C1A 0px, #C45C1A 8px, #D4930A 8px, #D4930A 12px, #D4790A 12px, #D4790A 16px, #3730A3 16px, #3730A3 20px, #C45C1A 20px, #C45C1A 24px)',
                opacity: 0.65,
            }} />

            {/* Logo */}
            <Link to="/" id="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LotusMotif />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                    <span className="gradient-text" style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: '700', fontSize: '22px', letterSpacing: '1px',
                    }}>KalaSetu</span>
                    <span style={{
                        fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase',
                        color: '#B09070', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic',
                        marginTop: '-1px',
                    }}>India's Living Heritage</span>
                </div>
            </Link>

            {/* Center nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <NavLink to="/" icon={<Palette size={14} />} label="Discover" active={location.pathname === '/'} />
                <NavLink to="/artsnap" icon={<Camera size={14} />} label="ArtSnap" active={location.pathname === '/artsnap'} />
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PassportButton />
                <Link to="/artisan" id="navbar-artisan-portal-btn" style={{ textDecoration: 'none' }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 20px',
                        borderRadius: '2px',
                        border: '1.5px solid #C45C1A',
                        background: '#C45C1A',
                        color: '#FFF8EE',
                        cursor: 'pointer',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '15px', fontWeight: '600',
                        letterSpacing: '0.3px',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 0 #9B3A0A, 0 3px 10px rgba(196,92,26,0.25)',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#D96B2A'; e.currentTarget.style.boxShadow = '0 3px 0 #9B3A0A, 0 6px 16px rgba(196,92,26,0.35)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#C45C1A'; e.currentTarget.style.boxShadow = '0 2px 0 #9B3A0A, 0 3px 10px rgba(196,92,26,0.25)' }}
                    >
                        <User size={13} />
                        Artisan Portal
                    </button>
                </Link>
            </div>
        </nav>
    )
}

function NavLink({ to, icon, label, active }) {
    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <button style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 16px', borderRadius: '2px', border: 'none',
                background: active ? 'rgba(196,92,26,0.09)' : 'transparent',
                borderBottom: active ? '2px solid #C45C1A' : '2px solid transparent',
                color: active ? '#C45C1A' : '#78614A',
                cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '15px',
                fontWeight: active ? '700' : '500',
                letterSpacing: '0.3px',
                transition: 'all 0.2s',
            }}>
                {icon}
                {label}
            </button>
        </Link>
    )
}
