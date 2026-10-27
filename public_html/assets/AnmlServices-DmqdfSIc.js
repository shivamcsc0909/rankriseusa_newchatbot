import{r as s,j as e,L as c}from"./react-vendor-DjYUu8Sg.js";import{m as i}from"./motion-B2rA5f4K.js";import{aP as d,aS as m,aT as x,S as p,aa as h,l as g}from"./icons-CTh_Sfy_.js";import"./vendor-DQNR0O-p.js";const u=[{id:"01",title:"Design",icon:m,accentIcon:d,items:["Web design","App design","Product interface","Touch screen displays","IoT experiences","Visual Identity","User Research","Prototyping"],link:"/services#design"},{id:"02",title:"Branding",icon:p,accentIcon:x,items:["Strategy","Naming","Positioning","Logo and identity","Copywriting","Voice & Tone","Brand Guidelines","Market Strategy"],link:"/services#branding"},{id:"03",title:"Development",icon:g,accentIcon:h,items:["Creative development","Front-end development","Back-end development","Cloud engineering","Headless shopify","Mobile Development","API Integration","System Architecture"],link:"/services#development"}];function j(){const t=s.useRef(null);return e.jsxs("section",{className:"bg-[#05070a] py-32 overflow-visible font-['Inter',_sans-serif] relative",children:[e.jsx("div",{className:"absolute inset-0 pointer-events-none opacity-[0.03] z-[100] grain-texture"}),e.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.03),transparent_70%)] pointer-events-none"}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .grain-texture {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          filter: contrast(150%) brightness(100%);
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .spotlight-container {
          --x: 50%;
          --y: 50%;
        }
        .spotlight-container:hover .spotlight {
          background: radial-gradient(600px circle at var(--x) var(--y), rgba(250,204,21,0.04), transparent 80%);
        }
      `}}),e.jsxs("div",{className:"w-full px-6 lg:px-16 relative z-10",children:[e.jsx("div",{ref:t,className:"mb-40 relative",children:e.jsxs(i.div,{initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.8,ease:[.16,1,.3,1]},children:[e.jsxs(i.h4,{initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},viewport:{once:!0},className:"text-[11px] font-black uppercase tracking-[0.6em] text-primary mb-10 flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-[1px] bg-primary/30"}),"Our Ecosystem"]}),e.jsxs("h2",{className:"text-4xl lg:text-[7rem] font-medium text-white max-w-6xl leading-[1] tracking-[-0.05em]",children:[e.jsx(r,{text:"We're equally fluent in strategy,"}),e.jsx(i.span,{initial:{opacity:0},whileInView:{opacity:1},transition:{duration:1,delay:.5},className:"text-white/10",children:e.jsx(r,{text:"technology, design, brand,"})}),e.jsx(r,{text:"and business growth.",delay:.8})]})]})}),e.jsx("div",{className:"space-y-0",children:u.map((n,a)=>e.jsx(y,{service:n,index:a},n.id))})]})]})}function r({text:t,delay:n=0}){return e.jsx("span",{className:"block overflow-hidden pb-2",children:e.jsx(i.span,{initial:{y:"100%"},whileInView:{y:0},viewport:{once:!0},transition:{duration:1.2,delay:n,ease:[.16,1,.3,1]},className:"block text-[1.2rem] md:text-[4rem] font-medium tracking-[0.02em] text-white/30 hover:text-white transition-colors duration-300",children:t})})}function y({service:t,index:n}){const a=s.useRef(null);return e.jsx("div",{ref:a,className:"sticky top-[30vh] min-h-[20vh] bg-black border-t border-b border-white/80",style:{zIndex:n+1},children:e.jsxs(i.div,{initial:{opacity:0,y:60},whileInView:{opacity:1,y:0},viewport:{once:!1,amount:.4},transition:{duration:.8,ease:[.16,1,.3,1]},className:"min-h-[70vh] grid grid-cols-1 lg:grid-cols-[58%_42%] px-0 py-20 lg:py-16",children:[e.jsxs("div",{className:"flex flex-col justify-start",children:[e.jsxs("h4",{className:"text-2xl lg:text-[1.8rem] font-black text-white mb-3 tracking-tight",children:[t.id,"/"]}),e.jsx("h2",{className:"text-[3rem] md:text-[4rem] lg:text-[4rem] font-black text-white tracking-[-0.08em] leading-[0.9] pl-8 lg:pl-16 px-20",children:e.jsx(i.span,{initial:{opacity:0,y:"100%",rotate:2},whileInView:{opacity:1,y:"0%",rotate:0},viewport:{once:!1},transition:{duration:.8,ease:[.16,1,.3,1]},className:"block overflow-hidden",children:t.title})})]}),e.jsxs(i.div,{initial:{opacity:0,y:35},whileInView:{opacity:1,y:0},viewport:{once:!1},transition:{duration:.8,delay:.15},className:"flex flex-col justify-start pt-8 lg:pt-14 ml-auto",children:[e.jsx("ul",{className:"space-y-3 mb-12 group",children:t.items.slice(0,5).map((l,o)=>e.jsx("li",{className:`\r
        text-sm lg:text-[1rem]\r
        font-medium\r
        leading-relaxed\r
        tracking-[0.01em]\r
        text-white/60\r
        hover:text-white\r
        transition-all\r
        duration-300\r
        cursor-default\r
      `,children:l},o))}),e.jsx(c,{to:t.link,className:"w-fit text-2xl font-bold text-white border-b border-white leading-none pb-1 hover:text-primary hover:border-primary transition-colors",children:"View all"})]})]})})}export{j as default};
