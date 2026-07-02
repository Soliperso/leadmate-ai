import { motion, useReducedMotion } from 'framer-motion'

/**
 * Living navy+gold aurora backdrop for the marketing surface. Large, heavily
 * blurred blobs drift and breathe on the GPU (transform/opacity only). Fixed
 * behind everything; ignores pointer events. Under reduced-motion the blobs
 * render static so the palette still reads but nothing moves.
 */

interface Blob {
  className: string
  drift: { x: number[]; y: number[]; scale: number[] }
  duration: number
}

const blobs: Blob[] = [
  {
    // Navy — top right
    className:
      'right-[-12%] top-[-14%] h-[42rem] w-[42rem] bg-brand-500/25',
    drift: { x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.08, 1] },
    duration: 22,
  },
  {
    // Gold — mid left
    className:
      'left-[-14%] top-[24%] h-[34rem] w-[34rem] bg-gold-400/20',
    drift: { x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.12, 1] },
    duration: 27,
  },
  {
    // Emerald — lower center
    className:
      'bottom-[-16%] left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 bg-emerald-400/14',
    drift: { x: [0, 30, 0], y: [0, -24, 0], scale: [1, 1.1, 1] },
    duration: 31,
  },
]

export function AuroraBackground() {
  const reduce = useReducedMotion()

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${b.className}`}
          animate={
            reduce
              ? undefined
              : { x: b.drift.x, y: b.drift.y, scale: b.drift.scale }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: b.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        />
      ))}
    </div>
  )
}
