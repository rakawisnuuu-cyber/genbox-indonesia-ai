const orbs = [
  { top: "10%", left: "5%", size: 300, color: "hsl(73 100% 50% / 0.03)", duration: 20, delay: 0 },
  { top: "30%", right: "10%", size: 400, color: "hsl(73 100% 50% / 0.025)", duration: 25, delay: 5 },
  { top: "55%", left: "15%", size: 250, color: "hsl(73 100% 50% / 0.02)", duration: 18, delay: 3 },
  { top: "75%", right: "5%", size: 350, color: "hsl(73 100% 50% / 0.03)", duration: 22, delay: 8 },
  { top: "90%", left: "40%", size: 280, color: "hsl(73 100% 50% / 0.02)", duration: 30, delay: 12 },
];

const AnimatedBackground = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    {orbs.map((orb, i) => (
      <div
        key={i}
        className="absolute rounded-full blur-3xl"
        style={{
          top: orb.top,
          left: (orb as any).left,
          right: (orb as any).right,
          width: orb.size,
          height: orb.size,
          background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
          animation: `bg-orb-float ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
        }}
      />
    ))}
  </div>
);

export default AnimatedBackground;
