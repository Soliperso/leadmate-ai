import {
  motion,
  useReducedMotion,
  useMotionValue,
  useMotionTemplate,
} from 'framer-motion'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { MapPin, TrendingUp } from 'lucide-react'

/**
 * Signature "own your area" visual: a stylized local map showing competitor
 * pins, your expanding coverage radius, and a radar sweep — the core LeadMate
 * story (you vs. rivals in your territory) as one ownable graphic.
 */

const CX = 260
const CY = 208

const LABEL_W = 108
const LABEL_GAP = 15

const rivals = [
  { x: 120, y: 116, name: 'Mile High', rating: '4.8', side: 'right' as const },
  { x: 384, y: 150, name: 'FrontRange', rating: '4.6', side: 'left' as const },
  { x: 170, y: 314, name: 'Rocky Mtn', rating: '4.4', side: 'right' as const },
]

export function LocalMap() {
  const reduce = useReducedMotion()
  const gx = useMotionValue(50)
  const gy = useMotionValue(38)
  const glow = useMotionTemplate`radial-gradient(220px circle at ${gx}% ${gy}%, rgba(52,211,153,0.20), transparent 68%)`

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    gx.set(((e.clientX - rect.left) / rect.width) * 100)
    gy.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <div
      onPointerMove={onMove}
      className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 40%, #12233d 0%, #0b1626 55%, #080f1c 100%)',
      }}
    >
      {/* Cursor-following glow (static-centred under reduced-motion).
          Sits above the SVG but below the label chips (all z-auto, DOM order). */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: glow }}
      />
      <svg viewBox="0 0 520 416" className="block h-full w-full">
        <defs>
          <radialGradient id="you-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#34d399" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="radar-wedge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.35" />
          </linearGradient>
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Street grid */}
        <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1">
          {[52, 112, 172, 232, 292, 352, 412, 472].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="416" />
          ))}
          {[44, 104, 164, 224, 284, 344, 404].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="520" y2={y} />
          ))}
        </g>
        {/* A couple of "main roads" for character */}
        <g stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2">
          <line x1="0" y1="284" x2="520" y2="224" />
          <line x1="112" y1="0" x2="172" y2="416" />
        </g>

        {/* Coverage glow behind you */}
        <circle cx={CX} cy={CY} r="150" fill="url(#you-glow)" />

        {/* Coverage radius rings */}
        {reduce ? (
          [60, 104, 148].map((r) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="#34d399"
              strokeOpacity="0.28"
              strokeWidth="1.5"
            />
          ))
        ) : (
          <>
            {[0, 1.3, 2.6].map((delay, i) => (
              <circle
                key={i}
                cx={CX}
                cy={CY}
                r="40"
                fill="none"
                stroke="#34d399"
                strokeWidth="1.5"
              >
                <animate
                  attributeName="r"
                  values="30;150"
                  dur="3.9s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.5;0"
                  dur="3.9s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
            {/* Radar sweep */}
            <g>
              <path
                d={`M ${CX} ${CY} L ${CX + 150} ${CY} A 150 150 0 0 0 ${CX + 106} ${CY - 106} Z`}
                fill="url(#radar-wedge)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${CX} ${CY}`}
                  to={`360 ${CX} ${CY}`}
                  dur="6s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </>
        )}

        {/* Competitor pins */}
        {rivals.map((r, i) => {
          const labelX =
            r.side === 'right' ? r.x + LABEL_GAP : r.x - LABEL_GAP - LABEL_W
          const textX = labelX + 10
          return (
            <motion.g
              key={r.name}
              initial={reduce ? false : { opacity: 0, y: -16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.18, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <rect
                x={labelX}
                y={r.y - 12}
                width={LABEL_W}
                height="24"
                rx="6"
                fill="#0b1626"
                stroke="#ffffff"
                strokeOpacity="0.12"
              />
              <text
                x={textX}
                y={r.y + 4}
                fill="#cbd5e1"
                fontSize="10.5"
                fontFamily="ui-monospace, monospace"
              >
                {r.name} ★{r.rating}
              </text>
              <circle cx={r.x} cy={r.y} r="7" fill="#f43f5e" filter="url(#pin-shadow)" />
              <circle cx={r.x} cy={r.y} r="7" fill="none" stroke="#fecdd3" strokeOpacity="0.5" />
            </motion.g>
          )
        })}

        {/* Your pin */}
        <g filter="url(#pin-shadow)">
          <circle cx={CX} cy={CY} r="11" fill="#10b981" />
          <circle cx={CX} cy={CY} r="4.5" fill="#ffffff" />
          {!reduce && (
            <circle cx={CX} cy={CY} r="11" fill="none" stroke="#34d399" strokeWidth="2">
              <animate attributeName="r" values="11;20" dur="2s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      </svg>

      {/* Overlay chips (crisp HTML text) */}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
        <MapPin className="h-3.5 w-3.5 text-emerald-300" />
        Denver, CO · 12 competitors nearby
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md">
        <div>
          <p className="text-xs text-emerald-200/80">Your local rank</p>
          <p className="font-mono text-lg font-semibold text-white">#3 → #1</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
          <TrendingUp className="h-3.5 w-3.5" /> Gaining ground
        </span>
      </div>
    </div>
  )
}
