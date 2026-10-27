import React from 'react';

const ring1 = ['2-1', '3-1', '4-1', '5-1', '6-1', '7', '8', '9', '10', '11'];
const ring2 = ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const ring3 = ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '1'];
const ring4 = ['13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];

export default function OurClients() {
  return (
    <section
      id="our-clients"
      className="relative z-[1] overflow-hidden bg-[#080c14] py-16 md:py-24"
    >
      <div className="relative z-10 px-4 text-center">
        <h2 className="m-0 font-['Inter',sans-serif] text-[clamp(40px,7vw,84px)] font-black tracking-[-0.04em] text-white">
          Our <span className="text-[#FFBB43]">Clients</span>
        </h2>

        <div className="mx-auto mt-5 h-1 w-20 bg-[#FFBB43]" />
      </div>

      <div className="flex h-[500px] w-full items-center justify-center overflow-hidden [perspective:1000px] sm:h-[750px] md:h-[950px] lg:h-[1250px] xl:h-[1400px]">
        <div className="relative flex h-[1350px] w-[1350px] shrink-0 items-center justify-center scale-[0.35] sm:scale-[0.55] md:scale-[0.7] lg:scale-[0.85] xl:scale-100">
          <div style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} className="relative z-[100] flex h-[220px] w-[220px] flex-col items-center justify-center rounded-full border-[5px] border-[#FFBB43] bg-white shadow-[0_0_0_8px_rgba(255,187,67,0.1),0_0_0_15px_rgba(255,187,67,0.05),0_25px_60px_rgba(0,0,0,0.5)] transition-transform duration-400 hover:scale-105">
            <span className="font-['Inter',sans-serif] text-[22px] font-black uppercase leading-none tracking-[-0.02em] text-[#080c14]">
              Rankriseusa
            </span>

            <div className="my-3 h-[3px] w-10 rounded-sm bg-[#080c14]" />

            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#888]">
              Agency Partner
            </span>
          </div>

          <Ring logos={ring1} radius={240} duration={28} direction="cw" />
          <Ring logos={ring2} radius={380} duration={38} direction="ccw" />
          <Ring logos={ring3} radius={520} duration={48} direction="cw" />
          <Ring logos={ring4} radius={660} duration={62} direction="ccw" />
        </div>
      </div>
    </section>
  );
}

function Ring({
  logos,
  radius,
  duration,
  direction,
}: {
  logos: string[];
  radius: number;
  duration: number;
  direction: 'cw' | 'ccw';
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/10"
        style={{
          width: radius * 2,
          height: radius * 2,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div
        className={`absolute inset-0 ${direction === 'cw' ? 'animate-rotate-cw' : 'animate-rotate-ccw'
          }`}
        style={{
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {logos.map((n, i) => {
          const angleDeg = (i / logos.length) * 360;
          const angleRad = (angleDeg * Math.PI) / 180;

          const x = radius * Math.cos(angleRad);
          const y = radius * Math.sin(angleRad);

          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                <div
                  className={
                    direction === 'cw'
                      ? 'animate-rotate-ccw'
                      : 'animate-rotate-cw'
                  }
                  style={{
                    animationDuration: `${duration}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                  }}
                >
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white p-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:z-[200] hover:scale-125 hover:shadow-[0_0_25px_#FFBB43]">
                    <img
                      className="h-full w-full object-contain"
                      src={`https://admarkdigitalmedia.com/wp-content/uploads/2025/12/${logos.length === 13 && i >= 12 ? '1-1' : `${n}.png`
                        }`}
                      alt={`RankRise USA Valued Client Partner Logo ${n}`}
                      title={`Client Partner Logo ${n}`}
                      width={72}
                      height={72}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (logos === ring4) {
                          e.currentTarget.src = `https://admarkdigitalmedia.com/wp-content/uploads/2026/01/${n}.png`;
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}