import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

/* ─── Exact Admark website screenshot images (landscape format) ── */
const images = [
  'https://admarkdigitalmedia.com/wp-content/uploads/2026/03/18-1.png',
  'https://admarkdigitalmedia.com/wp-content/uploads/2026/03/1-2.png',
  'https://admarkdigitalmedia.com/wp-content/uploads/2026/03/6-1.png',
  'https://admarkdigitalmedia.com/wp-content/uploads/2026/03/5-1.png',
  'https://admarkdigitalmedia.com/wp-content/uploads/2026/03/4-1.png',
  'https://admarkdigitalmedia.com/wp-content/uploads/2026/03/3-2.png',
  'https://admarkdigitalmedia.com/wp-content/uploads/2026/03/2-1.png',
  // additional fallback from 2025/11
  'https://admarkdigitalmedia.com/wp-content/uploads/2025/11/5-2-740x740-1.webp',
  'https://admarkdigitalmedia.com/wp-content/uploads/2025/11/4-3-740x740-1.webp',
  'https://admarkdigitalmedia.com/wp-content/uploads/2025/11/1-2-740x740-2.webp',
];

export default function WorkShowcase3D() {
  return (
    <section
      id="our-work"
      style={{
        background: '#f0f5f8',
        paddingTop: '70px',
        paddingBottom: '80px',
        overflow: 'hidden',
      }}
    >
      {/* ── "Our Work" Heading — exact Admark style ── */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            color: '#0f1623',
            letterSpacing: '-0.03em',
            margin: 0,
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
            lineHeight: 1.1,
          }}
        >
          Our Work
        </h2>
      </div>

      {/* ── Swiper CoverFlow — exact Admark mdw-curved-slider ── */}
      <Swiper
        modules={[EffectCoverflow, Autoplay]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={true}
        autoplay={{ delay: 2800, disableOnInteraction: false }}
        coverflowEffect={{
          rotate: 35,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
      >
        {images.map((src, i) => (
          <SwiperSlide
            key={i}
            style={{
              width: '480px',
              height: '320px',
              borderRadius: '4px',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={src}
              alt={`RankRise USA 3D Showcase Portfolio Project ${i + 1}`}
              title={`3D Showcase Project ${i + 1}`}
              width={480}
              height={320}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
                display: 'block',
              }}
              loading="lazy"
              decoding="async"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
