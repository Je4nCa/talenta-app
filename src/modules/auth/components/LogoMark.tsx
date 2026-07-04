import { motion, type Variants } from 'framer-motion'

const easeSalida: [number, number, number, number] = [0.22, 1, 0.36, 1]

const circleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.15 * i, duration: 0.5, ease: easeSalida },
  }),
}

const wordmarkVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.55, duration: 0.5, ease: easeSalida },
  },
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 240 190" className="mx-auto h-auto w-full" role="img" aria-label="TALENTA">
        <motion.circle
          cx="120"
          cy="42"
          r="34"
          fill="currentColor"
          custom={0}
          variants={circleVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.circle
          cx="78"
          cy="104"
          r="34"
          fill="currentColor"
          custom={1}
          variants={circleVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.circle
          cx="162"
          cy="104"
          r="34"
          fill="currentColor"
          custom={2}
          variants={circleVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.text
          x="120"
          y="172"
          textAnchor="middle"
          fill="currentColor"
          fontSize="30"
          fontWeight="500"
          letterSpacing="6"
          fontFamily="Poppins, sans-serif"
          variants={wordmarkVariants}
          initial="hidden"
          animate="visible"
        >
          TALENTA
        </motion.text>
      </svg>
    </div>
  )
}
