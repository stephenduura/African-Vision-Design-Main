import { motion } from "framer-motion";
import africaImg from "@assets/africa_nobg.png";

const SPARKLE_COUNT = 24;

export default function Africa3D() {
  const sparkles = Array.from({ length: SPARKLE_COUNT }, (_, i) => {
    const angle = (i / SPARKLE_COUNT) * 360;
    const r = 115 + (i % 4) * 25;
    const x = Math.cos((angle * Math.PI) / 180) * r;
    const y = Math.sin((angle * Math.PI) / 180) * r * 0.27;
    const size = 3 + (i % 5);
    return { x, y, size, delay: (i / SPARKLE_COUNT) * 2.4, duration: 1.6 + (i % 4) * 0.5 };
  });

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: 560, height: 640 }}>

      {/* Outer ambient glow rings */}
      {[280, 380, 490].map((diameter, i) => (
        <motion.div
          key={i}
          className="absolute bottom-16 left-1/2"
          style={{
            width: diameter,
            height: diameter * 0.26,
            marginLeft: -diameter / 2,
            borderRadius: "50%",
            border: "1px solid rgba(201,153,26,0.35)",
          }}
          animate={{ opacity: [0.6, 0.08, 0.6], scale: [1, 1.07, 1] }}
          transition={{ repeat: Infinity, duration: 2.8 + i * 0.6, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}

      {/* Core gold glow base */}
      <div
        className="absolute bottom-14 left-1/2"
        style={{
          width: 290,
          height: 56,
          marginLeft: -145,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, #FFF6B0 0%, #F5C93E 25%, #C9991A 55%, rgba(201,153,26,0.15) 80%, transparent 100%)",
          filter: "blur(10px)",
          boxShadow:
            "0 0 35px 15px rgba(201,153,26,0.55), 0 0 80px 40px rgba(201,153,26,0.22), 0 0 130px 70px rgba(201,153,26,0.08)",
        }}
      />

      {/* Sparkle particles */}
      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            bottom: `calc(3.5rem + ${s.y + 28}px)`,
            left: `calc(50% + ${s.x - s.size / 2}px)`,
            background: i % 3 === 0 ? "#FFF6B0" : i % 3 === 1 ? "#F5C93E" : "#C9991A",
            boxShadow: `0 0 ${s.size + 2}px rgba(245,201,62,0.8)`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.2, 1.4, 0.2] }}
          transition={{ repeat: Infinity, duration: s.duration, delay: s.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Africa image — large, 3D, floating */}
      <motion.div
        className="relative z-10"
        style={{ perspective: 900, transformStyle: "preserve-3d" }}
        animate={{ rotateY: [-7, 7, -7], rotateX: [3.5, -3.5, 3.5], y: [0, -26, 0] }}
        transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
      >
        <img
          src={africaImg}
          alt="Africa"
          style={{
            width: 500,
            objectFit: "contain",
            filter:
              "drop-shadow(0 35px 70px rgba(27,67,50,0.22)) drop-shadow(0 0 40px rgba(201,153,26,0.28)) drop-shadow(0 60px 40px rgba(201,153,26,0.12))",
          }}
        />
      </motion.div>
    </div>
  );
}
