import { useState } from 'react';
import { motion } from 'motion/react';

export function HeroMascot() {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <motion.div
        className="relative w-44 h-44 md:w-64 md:h-64 mx-auto mb-6 rounded-[3rem] bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100 shadow-2xl border-8 border-white flex items-center justify-center overflow-hidden"
        animate={{ y: [0, -10, 0], rotate: [0, 1.5, -1.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute top-4 left-6 text-3xl">⭐</div>
        <div className="absolute bottom-5 right-6 text-3xl">🌙</div>
        <div className="text-center">
          <div className="text-7xl md:text-8xl mb-2">📖</div>
          <div className="text-4xl md:text-5xl">🧒</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.img
      src="/images/ngajiyuk-hero.svg"
      alt="NgajiYuk Mascot"
      onError={() => setImageError(true)}
      className="w-44 h-44 md:w-64 md:h-64 object-contain mx-auto mb-6 drop-shadow-2xl"
      animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
