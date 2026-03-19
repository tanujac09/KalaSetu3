import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, ChevronLeft, Palette } from 'lucide-react'
import API from '../api/client'

const ART_FORM_DATA = {
    warli: {
        name: 'Warli Painting',
        origin: 'Maharashtra (Nasik, Palghar districts)',
        emoji: '🌿',
        accentColor: '#C45C1A',
        bannerBg: 'linear-gradient(135deg, #7c2d12, #C45C1A)',
        description: `Warli is among the oldest art traditions in the world — dating back to at least 2,500 BCE. 
    Practiced by the Warli tribe of Maharashtra's northern districts, these paintings use a stark white pigment 
    (made from rice paste) on mud-coloured backgrounds. The imagery is geometric and narrative: circles represent 
    the sun and moon, triangles the mountains and peaked roofs, and squares the sacred enclosures.
    Warli is never decorative for its own sake — every painting documents a community event, a harvest, 
    a wedding, or a prayer.`,
        techniques: ['Rice paste on dried cow dung walls', 'Bamboo stick as brush', 'Circle, triangle, square motifs'],
        gi_tag: 'Yes — Warli Painting, Maharashtra',
    },
    madhubani: {
        name: 'Madhubani (Mithila) Painting',
        origin: 'Bihar (Mithila region: Darbhanga, Madhubani, Sitamarhi)',
        emoji: '🌸',
        accentColor: '#3730A3',
        bannerBg: 'linear-gradient(135deg, #1e3a5f, #3730A3)',
        description: `Madhubani paintings were originally created by women on the walls and floors of homes in the 
    Mithila region of Bihar. They centre around Hindu deities — Durga, Rama, Krishna — as well as nature, the 
    sun, moon, fish, turtles, and bamboo groves. The characteristic double-line border and the refusal to leave 
    any space empty (every gap is filled with flowers or dots) are its visual signature.
    After the 1934 earthquake devastated Mithila, artists began painting on paper and cloth to sell, 
    gradually bringing this private home practice into the global art world.`,
        techniques: ['Natural dyes from plants and minerals', 'Fingers, matchsticks, and brushes', 'No blank space — every gap filled'],
        gi_tag: 'Yes — Madhubani Painting, Bihar',
    },
    gond: {
        name: 'Gond Art',
        origin: 'Madhya Pradesh (Mandla, Dindori, Balaghat)',
        emoji: '🌳',
        accentColor: '#166534',
        bannerBg: 'linear-gradient(135deg, #14532d, #166534)',
        description: `The Gond people, one of India's largest tribal communities, believe that a good image brings 
    good luck. Their paintings are filled with trees, animals, birds, and the whole natural world — rendered in 
    dense dot-and-dash texture that gives their art its mesmerizing rhythmic quality. Every element — the scales 
    of a fish, the leaves of a tree — is filled with a different pattern.
    Gond art exploded into global consciousness through the work of Jangarh Singh Shyam in the 1980s, who with 
    simple paper and pen created a new visual language from tribal memory.`,
        techniques: ['Dot and dash fill patterns', 'Acrylic and natural pigments', 'Tree-of-life as central motif'],
        gi_tag: 'Under process',
    },
    pattachitra: {
        name: 'Pattachitra',
        origin: 'Odisha (Puri, Raghurajpur village)',
        emoji: '📜',
        accentColor: '#7C3AED',
        bannerBg: 'linear-gradient(135deg, #581c87, #7C3AED)',
        description: `Pattachitra — literally "cloth picture" in Sanskrit — are sacred narrative paintings from 
    Odisha, traditionally created by the Chitrakar community of Raghurajpur village. They depict the stories 
    of Lord Jagannath, Vaishnava mythology, and the Panchatantra fables.
    The paintings are layered: first a canvas made from old cloth coated with chalk and gum, then 
    painted in vivid natural pigments (conch shell white, lamp black, yellow orpiment), and finished with 
    a lacquer made from kerosene lamp soot and tree resin. The border — called "Nali" — is mandatory.`,
        techniques: ['Tamarind seed paste canvas preparation', 'Natural stone and plant pigments', 'Lamp-black lacquer finish'],
        gi_tag: 'Yes — Pattachitra, Odisha',
    },
    dhokra: {
        name: 'Dhokra Metal Casting',
        origin: 'Chhattisgarh, West Bengal, Odisha, Jharkhand',
        emoji: '🔱',
        accentColor: '#92400E',
        bannerBg: 'linear-gradient(135deg, #78350f, #92400E)',
        description: `Dhokra is among the world's oldest metal-casting traditions — the same lost-wax (cire perdue) 
    technique used to create the famous Dancing Girl of Mohenjo-daro over 4,000 years ago is still practised today 
    in tribal villages of Central India. Artisans build a wax sculpture, coat it in clay, melt the wax out, 
    and pour molten bronze in its place. The result is a unique, slightly rough-surfaced figure full of life.
    Dhokra figures — horses, elephants, deities, musicians — carry a raw energy unlike any refined metal craft.`,
        techniques: ['Lost-wax (cire perdue) casting', 'Brass and bronze alloy', 'Clay-and-dung mould'],
        gi_tag: 'Under process (state-level)',
    },
    kalamkari: {
        name: 'Kalamkari',
        origin: 'Andhra Pradesh (Srikalahasti, Machilipatnam)',
        emoji: '✒️',
        accentColor: '#0F766E',
        bannerBg: 'linear-gradient(135deg, #0f766e, #0d9488)',
        description: `Kalamkari means "pen work" — kalam (pen) + kari (craft). On cloth treated with myrobalan 
    and buffalo milk, artisans draw mythological stories using a bamboo pen dipped in fermented jaggery and iron 
    solution. The lines resist dye and create vivid narrative compositions.
    There are two styles: Srikalahasti (freehand, temple hanging) and Machilipatnam (block printed). 
    The natural dyes — indigo, turmeric, pomegranate rind, madder root — give Kalamkari its immortal earthy palette.`,
        techniques: ['Hand-drawn with bamboo pen', 'Natural dyes: indigo, turmeric, madder', 'Mordant resist printing'],
        gi_tag: 'Yes — Kalamkari, Andhra Pradesh',
    },
}

export default function ArtformDetails() {
    const { slug } = useParams()
    const art = ART_FORM_DATA[slug]
    const [artisans, setArtisans] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArtisans = async () => {
            try {
                const res = await API.get(`/artisans/?art_form=${art?.name || slug}`)
                setArtisans(res.data || [])
            } catch {
                setArtisans([])
            }
            setLoading(false)
        }
        if (art) fetchArtisans()
        else setLoading(false)
    }, [slug])

    if (!art) {
        return (
            <div style={{ minHeight: '100vh', background: '#FBF7F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: '#FBF5EA', border: '1px solid #C4A870', borderTop: '3px solid #C45C1A', borderRadius: '3px', padding: '48px', textAlign: 'center', boxShadow: '0 2px 0 rgba(180,130,50,0.3), 0 8px 32px rgba(60,25,5,0.1)' }}>
                    <p style={{ fontSize: '48px', marginBottom: '12px' }}>🎨</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '700', fontSize: '20px', color: '#1E0F05', marginBottom: '10px' }}>Art form not found</p>
                    <Link to="/" style={{ color: '#C45C1A', textDecoration: 'none', fontSize: '15px', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>← Back to Discover</Link>
                </div>
            </div>
        )
    }

    const isGITagged = art.gi_tag !== 'Under process' && art.gi_tag !== 'Under process (state-level)'

    return (
        <div style={{ minHeight: '100vh', background: '#FBF7F0' }}>

            {/* ── Hero banner ── */}
            <div style={{
                background: art.bannerBg,
                padding: '52px 24px 48px',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '3px solid rgba(212,147,10,0.4)',
            }}>
                {/* Ikat strip at bottom of banner */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
                    background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 12px, rgba(255,200,100,0.25) 12px, rgba(255,200,100,0.25) 16px)',
                }} />
                {/* Mandala watermark */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', opacity: 0.06, fontSize: '0', pointerEvents: 'none' }}>
                    <svg width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="white">
                            {[90,75,55,35,15].map(r => <circle key={r} cx="100" cy="100" r={r} strokeWidth="0.6" />)}
                            {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
                                <line key={a} x1={100+15*Math.cos(a*Math.PI/180)} y1={100+15*Math.sin(a*Math.PI/180)} x2={100+90*Math.cos(a*Math.PI/180)} y2={100+90*Math.sin(a*Math.PI/180)} strokeWidth="0.5" />
                            ))}
                        </g>
                    </svg>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <Link
                        to="/"
                        id="artform-back-btn"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                            fontFamily: "'Crimson Pro', serif",
                            fontSize: '14px', fontStyle: 'italic', marginBottom: '22px',
                        }}
                    >
                        <ChevronLeft size={14} /> Discover All Crafts
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ height: '1px', width: '28px', background: 'rgba(255,255,255,0.4)' }} />
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: "'Crimson Pro', serif" }}>Indian Folk Art</span>
                    </div>

                    <div style={{ fontSize: '48px', marginBottom: '12px', lineHeight: 1 }}>{art.emoji}</div>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: '700', fontSize: 'clamp(30px, 5vw, 50px)',
                        color: 'white', marginBottom: '10px', lineHeight: '1.05',
                        letterSpacing: '0.3px',
                    }}>
                        {art.name}
                    </h1>
                    <p style={{ color: 'rgba(255,240,210,0.8)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>
                        <MapPin size={13} /> {art.origin}
                    </p>
                    {isGITagged && (
                        <div style={{ marginTop: '14px' }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.35)',
                                color: 'rgba(255,245,220,0.95)',
                                padding: '4px 14px', borderRadius: '2px',
                                fontFamily: "'Crimson Pro', serif", fontStyle: 'italic',
                                fontSize: '13px', fontWeight: '600',
                            }}>
                                🏷️ GI Tagged — Geographical Indication of India
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Body ── */}
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 88px' }}>

                {/* Description card */}
                <div style={{
                    background: '#FBF5EA',
                    border: '1px solid #C4A870',
                    borderLeft: `4px solid ${art.accentColor}`,
                    borderRadius: '3px',
                    padding: '28px 32px',
                    marginBottom: '18px',
                    boxShadow: '0 2px 0 rgba(180,130,50,0.2), 0 4px 16px rgba(60,25,5,0.07)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <span style={{ color: art.accentColor, fontSize: '14px' }}>✦</span>
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: '700', fontSize: '18px', color: art.accentColor,
                            letterSpacing: '0.3px',
                        }}>
                            The Story of {art.name}
                        </h2>
                    </div>
                    <div style={{ height: '1px', background: `linear-gradient(90deg, ${art.accentColor}40, transparent)`, marginBottom: '16px' }} />
                    <p style={{
                        color: '#3D2214', fontSize: '16.5px', lineHeight: '1.95', whiteSpace: 'pre-line',
                        fontFamily: "'Crimson Pro', serif",
                    }}>
                        {art.description}
                    </p>
                </div>

                {/* Techniques card */}
                <div style={{
                    background: '#FBF5EA',
                    border: '1px solid #C4A870',
                    borderRadius: '3px',
                    padding: '28px 32px',
                    marginBottom: '36px',
                    boxShadow: '0 2px 0 rgba(180,130,50,0.2), 0 4px 16px rgba(60,25,5,0.07)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <Palette size={16} color={art.accentColor} />
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: '700', fontSize: '18px', color: art.accentColor,
                            letterSpacing: '0.3px',
                        }}>
                            Distinctive Techniques
                        </h2>
                    </div>
                    <div style={{ height: '1px', background: `linear-gradient(90deg, ${art.accentColor}40, transparent)`, marginBottom: '16px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {art.techniques.map((t, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'flex-start', gap: '12px',
                                padding: '13px 18px',
                                background: art.accentColor + '0C',
                                border: `1px solid ${art.accentColor}22`,
                                borderLeft: `3px solid ${art.accentColor}55`,
                                borderRadius: '2px',
                            }}>
                                <span style={{ color: art.accentColor, marginTop: '2px', flexShrink: 0, fontSize: '10px' }}>◆</span>
                                <span style={{ fontSize: '15.5px', color: '#3D2214', fontFamily: "'Crimson Pro', serif", lineHeight: 1.5 }}>{t}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Registered Artisans */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ height: '1px', width: '24px', background: '#C4A870' }} />
                    <span style={{ color: '#B09070', fontSize: '10px', fontFamily: "'Crimson Pro', serif", letterSpacing: '3px', textTransform: 'uppercase' }}>The Makers</span>
                </div>
                <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: '700', fontSize: '26px', marginBottom: '18px', color: '#1E0F05',
                    letterSpacing: '0.2px',
                }}>
                    Registered Artisans
                </h2>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                        <div className="spinner" />
                    </div>
                ) : artisans.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {artisans.map((a) => (
                            <div key={a.id} style={{
                                background: '#FBF5EA',
                                border: '1px solid #C4A870',
                                borderRadius: '3px',
                                padding: '18px 22px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                boxShadow: '0 1px 0 rgba(180,130,50,0.2)',
                            }}>
                                <div>
                                    <p style={{ fontWeight: '700', fontSize: '17px', color: '#1E0F05', marginBottom: '4px', fontFamily: "'Cormorant Garamond', serif" }}>{a.name}</p>
                                    {a.state && (
                                        <p style={{ color: '#78614A', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>
                                            <MapPin size={11} /> {a.state}
                                        </p>
                                    )}
                                </div>
                                {a.upi_id && (
                                    <span style={{
                                        background: 'rgba(26,71,49,0.08)', border: '1px solid rgba(26,71,49,0.3)',
                                        color: '#1A4731', borderRadius: '2px',
                                        padding: '3px 12px', fontSize: '12px', fontWeight: '600',
                                        fontFamily: "'Crimson Pro', serif", letterSpacing: '0.5px',
                                    }}>UPI ✅</span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        background: '#FBF5EA',
                        border: '1px solid #C4A870',
                        borderRadius: '3px',
                        padding: '44px',
                        textAlign: 'center',
                        boxShadow: '0 2px 0 rgba(180,130,50,0.2)',
                    }}>
                        <p style={{ fontSize: '36px', marginBottom: '12px' }}>🌱</p>
                        <p style={{ color: '#78614A', fontSize: '16px', lineHeight: 1.8, fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}>
                            No artisans registered for {art.name} yet.<br />
                            Know a {art.name} artist? Share KalaSetu with them.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
