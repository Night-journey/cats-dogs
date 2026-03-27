export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <style>{`
        @keyframes blink {
          0% { opacity: 0; }
          49% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes typing-f3-l9 {
          0% { d: path("M8,25L8,25"); }
          82% { d: path("M9,25L9,25"); }
          92% { d: path("M8,25L65,25"); }
          100% { d: path("M8,25L65,25"); }
        }
        @keyframes typing-f3-l8 {
          0% { d: path("M7,13L7,13"); }
          68% { d: path("M8,13L8,13"); }
          82% { d: path("M7,13L148,13"); }
          100% { d: path("M7,13L148,13"); }
        }
        @keyframes typing-f3-l7 {
          0% { d: path("M6,1L6,1"); }
          60% { d: path("M6,1L6,1"); }
          68% { d: path("M6,1L141,1"); }
          100% { d: path("M6,1L141,1"); }
        }
        @keyframes typing-f2-l6 {
          0% { d: path("M5,25L5,25"); }
          54% { d: path("M6,25L6,25"); }
          60% { d: path("M5,25L74,25"); }
          100% { d: path("M5,25L74,25"); }
        }
        @keyframes typing-f2-l5 {
          0% { d: path("M4,13L4,13"); }
          44% { d: path("M5,13L5,13"); }
          54% { d: path("M4,13L120,13"); }
          100% { d: path("M4,13L120,13"); }
        }
        @keyframes typing-f2-l4 {
          0% { d: path("M3,1L3,1"); }
          30% { d: path("M3,1L3,1"); }
          44% { d: path("M3,1L142,1"); }
          100% { d: path("M3,1L142,1"); }
        }
        @keyframes typing-f1-l3 {
          0% { d: path("M5,25L5,25"); }
          24% { d: path("M3,25L3,25"); }
          30% { d: path("M2,25L69,25"); }
          100% { d: path("M2,25L69,25"); }
        }
        @keyframes typing-f1-l2 {
          0% { d: path("M7,13L7,13"); }
          14% { d: path("M2,13L2,13"); }
          24% { d: path("M1,13L133,13"); }
          100% { d: path("M1,13L133,13"); }
        }
        @keyframes typing-f1-l1 {
          0% { d: path("M0,1L0,1"); }
          14% { d: path("M0,1L116,1"); }
          100% { d: path("M0,1L116,1"); }
        }
        #f3-l9 { animation: typing-f3-l9 1200ms linear infinite; }
        #f3-l8 { animation: typing-f3-l8 1200ms linear infinite; }
        #f3-l7 { animation: typing-f3-l7 1200ms linear infinite; }
        #f2-l6 { animation: typing-f2-l6 1200ms linear infinite; }
        #f2-l5 { animation: typing-f2-l5 1200ms linear infinite; }
        #f2-l4 { animation: typing-f2-l4 1200ms linear infinite; }
        #f1-l3 { animation: typing-f1-l3 1200ms linear infinite; }
        #f1-l2 { animation: typing-f1-l2 1200ms linear infinite; }
        #f1-l1 { animation: typing-f1-l1 1200ms linear infinite; }
        #paw-right--up, #paw-right--down, #paw-left--up, #paw-left--down {
          animation: blink 300ms infinite;
        }
        #paw-right--up, #paw-left--down {
          animation-delay: 150ms;
        }
        #laptop__code {
          transform-box: fill-box;
          transform-origin: center center;
          transform: translate(150px, 100px) rotate(5deg);
        }
        .dot-bounce { animation: blink 1.5s ease-in-out infinite; }
        .dot1 { animation-delay: 0ms; }
        .dot2 { animation-delay: 200ms; }
        .dot3 { animation-delay: 400ms; }
      `}</style>

      <svg viewBox="0 0 787.3 433.8" style={{ width: 'min(400px, 80vw)', height: 'auto' }} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <defs>
          <symbol id="eye" data-name="eye" viewBox="0 0 19.2 18.7">
            <circle cx="9.4" cy="9.1" r="8"></circle>
            <path d="M16.3,5.1a1.3,1.3,0,0,1-1.4-.3,7.2,7.2,0,0,0-4.5-2.6A7.2,7.2,0,0,0,5.5,3.5,6.8,6.8,0,0,0,2.8,7.8a6.8,6.8,0,0,0,1,4.8,6.2,6.2,0,0,0,4,2.7,6.1,6.1,0,0,0,4.6-.7,6.7,6.7,0,0,0,2.9-3.7,6.4,6.4,0,0,0-.5-4.5c-.1-.2.8-1,1.5-1.3s2.2,0,2.3.5a9.4,9.4,0,0,1-.2,7.2,9.4,9.4,0,0,1-5.1,5.1,9,9,0,0,1-7,.2A9.6,9.6,0,0,1,1,13.5,9.2,9.2,0,0,1,.4,6.6,8.9,8.9,0,0,1,4.6,1.3,9,9,0,0,1,11.2.2,9.3,9.3,0,0,1,16.7,4C16.9,4.3,17,4.8,16.3,5.1Z"></path>
          </symbol>
          <symbol id="paw-pads" data-name="paw-pads" viewBox="0 0 31.4 33.9">
            <path d="M6.8,16a3.7,3.7,0,0,1,1.1,2.8,3.2,3.2,0,0,1-1.6,2.6L5,21.8H4.4a2.8,2.8,0,0,1-1.8.3A4.2,4.2,0,0,1,.2,19.1,7.7,7.7,0,0,1,0,17.6a2.8,2.8,0,0,1,.6-2,3.2,3.2,0,0,1,2.1-.8H4A5,5,0,0,1,6.8,16Zm7.3-4.8a1.8,1.8,0,0,0,.7-.5l.7-.4a3.5,3.5,0,0,0,1.1-1,3.2,3.2,0,0,0,.3-1.4,1.4,1.4,0,0,0-.2-.6,3.4,3.4,0,0,0-.3-2.4,3.2,3.2,0,0,0-2.1-1.5H13.1a4.7,4.7,0,0,0-1.6.4,2,2,0,0,0-.9.9l-.4.6v.4a6.1,6.1,0,0,0-.5,1.2,4.3,4.3,0,0,0,0,1.6,3.5,3.5,0,0,0,.5,2l.7.6a3.3,3.3,0,0,0,1.7.7A3,3,0,0,0,14.1,11.2ZM22.7,7l.6.2h.3A2.3,2.3,0,0,0,25,6.8l.4-.3.6-.3a7.5,7.5,0,0,0,1.5-.9,4.2,4.2,0,0,0,.8-1.2,1.9,1.9,0,0,0,.1-1.5A2.6,2.6,0,0,0,27.5,1,3.5,3.5,0,0,0,23.6.3a3.8,3.8,0,0,0-2,1.5,4.8,4.8,0,0,0-.7,2,3.6,3.6,0,0,0,.9,2.6ZM31,24.1a13.5,13.5,0,0,0-2.2-4.7,36.6,36.6,0,0,0-3.2-3.9,5.3,5.3,0,0,0-5-1.9,10.5,10.5,0,0,0-4.5,2.2A5.6,5.6,0,0,0,13.5,20a15.1,15.1,0,0,0,1.2,6.3c.8,2,1.7,4,2.6,5.9a1.6,1.6,0,0,0,1.5.8,1.7,1.7,0,0,0,1.9.9,17.1,17.1,0,0,0,8.7-4.8,8.2,8.2,0,0,0,1.7-2C31.6,26.3,31.3,25,31,24.1Z" fill="#ef97b0"></path>
          </symbol>
        </defs>

        <g id="head">
          <g id="head__outline">
            <path d="M303.2,186.3c4-7,14.8-20.2,20-26,17-19,34.6-34.9,43-41l12-8s16.6-32,21-33c9-2,33,22,33,22s20-9,79,7c41,11.1,47,14,57,22,7.5,6,18,16,18,16s33.7-19.5,41-15-2,66-2,66,5.9,12.9,11,22c9.1,16.2,13.6,20.2,19,31,3.6,7.2,8.4,28.5,10.5,43.5l-385-62Z" fill="#fff" stroke="#231f20" strokeWidth="1.2"></path>
          </g>
          <g id="head__face">
            <g id="eyes">
              <use width="19.2" height="18.7" transform="translate(474.8 195.2)" xlinkHref="#eye"></use>
              <use width="19.2" height="18.7" transform="matrix(-0.51, -0.85, 0.82, -0.5, 370.39, 192.59)" xlinkHref="#eye"></use>
            </g>
            <g id="mouth">
              <path d="M399.2,186.3c.9,3.6,2.6,7.8,6,9,6.4,2.3,19-6,19-6s4.1,12.4,10,15,10.7-1.7,16-6" fill="#fff" stroke="#231f20" strokeWidth="1.2"></path>
            </g>
          </g>
        </g>

        <g id="table">
          <path d="M65.7,181.8l714,124c0,74-2,54-2,128l-673-161Z" fill="#fff" stroke="#231f20" strokeWidth="1.2"></path>
        </g>

        <g id="laptop">
          <g id="laptop__base">
            <polygon points="641.9 304.1 454.7 348.2 103.8 271.3 254.6 230.3 641.9 304.1" fill="#f2f2f2" stroke="#231f20" strokeWidth="1.2"></polygon>
          </g>

          <g id="laptop__keyboard">
            <polygon points="371.1 274.8 256.8 253.5 257 252.7 266.2 251.1 382.4 271.5 382.3 272.3 371.1 274.8" fill="#3e3e54"></polygon>
            <polygon points="237.4 265.6 221.3 262.4 221.4 261.7 230.2 260.2 246.8 262.6 246.6 263.4 237.4 265.6" fill="#3e3e54"></polygon>
            <polygon points="474.6 312.9 249.9 268.1 250.1 267.3 259.2 265.8 487.7 309.6 487.5 310.5 474.6 312.9" fill="#3e3e54"></polygon>
            <polygon points="411.8 309.4 204.2 266.7 204.4 266 212.9 264.5 423.9 306.3 423.7 307.2 411.8 309.4" fill="#3e3e54"></polygon>
            <polygon points="450 317.3 428.5 312.9 428.8 312 440.7 310.6 462.7 314.1 462.5 315 450 317.3" fill="#3e3e54"></polygon>
            <polygon points="201.6 273.9 187.5 270.9 187.7 270.2 196 268.7 210.4 271 210.3 271.7 201.6 273.9" fill="#3e3e54"></polygon>
            <polygon points="222.6 278.3 208.1 275.3 208.3 274.5 216.9 273.1 231.8 275.4 231.6 276.2 222.6 278.3" fill="#3e3e54"></polygon>
            <polygon points="362.9 308.1 231.5 280.2 231.7 279.5 240.7 278.1 374.2 305.1 374 305.9 362.9 308.1" fill="#3e3e54"></polygon>
            <polygon points="444.3 288.4 385.2 277.4 385.4 276.5 396.6 274.9 456.9 285.1 456.7 285.9 444.3 288.4" fill="#3e3e54"></polygon>
            <polygon points="526.1 303.6 460.1 291.3 460.3 290.4 472.8 288.9 540.1 300.2 539.9 301.1 526.1 303.6" fill="#3e3e54"></polygon>
            <polygon points="426.2 321.6 376.1 310.9 376.3 310.1 387.4 308.7 438.5 318.5 438.3 319.4 426.2 321.6" fill="#3e3e54"></polygon>
          </g>

          <g id="paw-right">
            <g id="paw-right--down">
              <path d="M293.2,191.3l10-7s-18.4,11.1-24,20-13,20.4-9,31c4.7,12.4,20.5,15.7,22,16,20,3.8,47.8-24.3,47.8-24.3s1.9-3.3,2.2-3.7" fill="#fff" stroke="#231f20" strokeWidth="1.2"></path>
            </g>
            <g id="paw-right--up">
              <path d="M282.2,215.2c-1.6-1.6-12.8-17.9-14-34.3-.1-2.5,1.7-16,12.9-22.4s22.3-1.9,26.2.4c12.2,7.3,21.2,19.1,22.8,22.4" fill="#fff" stroke="#231f20" strokeWidth="1.2"></path>
              <use width="31.4" height="33.93" transform="translate(273.2 166.1) rotate(-5.6)" xlinkHref="#paw-pads"></use>
            </g>
          </g>

          <g id="laptop__terminal">
            <path d="M316.9,238.7,153.5,205.2a5.1,5.1,0,0,1-4-3.5L109.8,75.4c-1-3.3,1.9-6.6,5.6-6.3L277.9,84.5a5.2,5.2,0,0,1,4.6,3.7l40.7,144.4C324.2,236.2,320.8,239.5,316.9,238.7Z"></path>
          </g>

          <g id="laptop__terminal_code_scene">
            <g id="laptop__code" stroke="#3DE0E8" strokeWidth="6">
              <g id="f3" transform="translate(0 76)">
                <path id="f3-l9" d="M8,25L65,25"></path>
                <path id="f3-l8" d="M7,13L148,13"></path>
                <path id="f3-l7" d="M6,1L141,1"></path>
              </g>
              <g id="f2" transform="translate(0 38)">
                <path id="f2-l6" d="M5,25L74,25"></path>
                <path id="f2-l5" d="M4,13L120,13"></path>
                <path id="f2-l4" d="M3,1L142,1"></path>
              </g>
              <g id="f1">
                <path id="f1-l3" d="M2,25L69,25"></path>
                <path id="f1-l2" d="M1,13L133,13"></path>
                <path id="f1-l1" d="M0,1L116,1"></path>
              </g>
            </g>
          </g>

          <g id="laptop__cover" style={{mixBlendMode: 'hard-light'}}>
            <polygon points="440.7 347.2 90.3 275.6 4.7 3.8 353 36.7 440.7 347.2" fill="#f2f2f2"></polygon>
          </g>
        </g>

        <g id="paw-left">
          <g id="paw-left--up">
            <path d="M545.4,261.9c-7.1-13-12.9-31.1-13.3-37.6-.6-9,0-15.6,5.2-22.2s15-9.8,22.7-8.8a26.7,26.7,0,0,1,17.3,9.4c5.3,5.8,9.4,12.9,11.6,16.6" fill="#fff" stroke="#231f20" strokeWidth="1.2"></path>
            <use width="31.4" height="33.93" transform="matrix(0.99, -0.03, 0.04, 1, 539.85, 203.52)" xlinkHref="#paw-pads"></use>
          </g>
          <g id="paw-left--down">
            <path d="M538.2,239.3c-3.2,1.6-33,10.8-37,28-.4,1.8-2.1,18.9,7,26,5.5,4.3,12.7,2.8,25,0,10.3-2.3,19-5.8,40-16,9.1-4.4,16.6-8.2,22-11" fill="#fff" stroke="#231f20" strokeWidth="1.2"></path>
          </g>
        </g>
      </svg>

      <p style={{ marginTop: '0.75rem', color: '#92400e', fontWeight: 500, fontSize: '1.5rem' }}>
        加载中<span className="dot-bounce dot1">.</span><span className="dot-bounce dot2">.</span><span className="dot-bounce dot3">.</span>
      </p>
    </div>
  );
}
