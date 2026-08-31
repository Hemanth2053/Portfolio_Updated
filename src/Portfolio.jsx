import React from 'react';
import * as data from './data.js';

const RESUME_URL = './Hemanth-Kumar-R-Resume.pdf';
const RESUME_FILE = 'HemanthKumar_R_Senior_Frontend_Engineer_Resume.pdf';

export default class Portfolio extends React.Component {
  constructor(p) {
    super(p);
    const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
    this.state = {
      d: null, narrow: w < 900, mid: w < 1180 && w >= 900, active: 'top',
      counted: [0, 0, 0, 0], open: {}, barsIn: false, copied: false, hoverNav: null
    };
    this.progressRef = React.createRef();
    this.clockRef = React.createRef();
    this.heroRef = React.createRef();
    this.SECTIONS = ['top', 'stack', 'case', 'own', 'lead', 'approach', 'contact'];
  }

  get quiet() { return this.props.quiet === true; }
  get calm() { return this._reduce || this.quiet; }

  componentDidMount() {
    const m = data;
    this._reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const open = {}; open[m.runLog[0].entry] = true;
    this.setState({ d: m, open });

    const tickClock = () => {
      const el = this.clockRef.current;
      if (el) el.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
    };
    tickClock();
    this._clock = setInterval(tickClock, 1000);

    this._onScroll = () => {
      if (this._rafY) return;
      this._rafY = requestAnimationFrame(() => {
        this._rafY = null;
        const y = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const bar = this.progressRef.current;
        if (bar) bar.style.width = (docH > 0 ? Math.min(1, y / docH) * 100 : 0) + '%';
        const hero = this.heroRef.current;
        if (hero && !this.calm) {
          const hs = Math.min(1, y / 620);
          hero.style.transform = 'translateY(' + (hs * -14) + 'px)';
          hero.style.opacity = String(1 - hs * 0.25);
        }
        this.recomputeActive();
      });
    };
    window.addEventListener('scroll', this._onScroll, { passive: true });

    this._onResize = () => {
      const w = window.innerWidth;
      const n = w < 900, mi = w < 1180 && !n;
      if (n !== this.state.narrow || mi !== this.state.mid) this.setState({ narrow: n, mid: mi });
    };
    window.addEventListener('resize', this._onResize);

    requestAnimationFrame(() => {
      this.initReveal(); this.splitHeadings();
      this.recomputeActive(); this.countUp();
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('scroll', this._onScroll);
    clearInterval(this._clock);
    clearTimeout(this._copyT);
    if (this._io) this._io.disconnect();
  }

  initReveal() {
    if (this.calm || !('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll('[data-r]'));
    if (this._io) this._io.disconnect();
    els.forEach(el => {
      if (el.dataset.shown) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity .7s cubic-bezier(.16,.84,.3,1), transform .7s cubic-bezier(.16,.84,.3,1)';
    });
    this._io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach((e, i) => {
        const el = e.target;
        el.dataset.shown = '1';
        el.style.transitionDelay = Math.min(i * 55, 220) + 'ms';
        el.style.opacity = '1';
        el.style.transform = 'none';
        this._io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(el => { if (!el.dataset.shown) this._io.observe(el); });
  }

  splitHeadings() {
    if (this.calm) return;
    document.querySelectorAll('[data-split]').forEach(h => {
      if (h.dataset.done || /[<]/.test(h.innerHTML)) return;
      h.dataset.done = '1';
      h.innerHTML = h.innerHTML.split(' ').map((w, i) =>
        '<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block;transform:translateY(105%);transition:transform .8s cubic-bezier(.16,.84,.3,1) ' + (i * 50) + 'ms">' + w + '&nbsp;</span></span>'
      ).join('');
      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return;
        h.querySelectorAll('span > span').forEach(s => { s.style.transform = 'translateY(0)'; });
        io.disconnect();
      }, { threshold: 0.2 });
      io.observe(h);
    });
  }

  recomputeActive() {
    if (this._spyLock && Date.now() < this._spyLock) return;
    const line = window.innerHeight * 0.34;
    let winner = this.SECTIONS[0];
    this.SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) winner = id;
    });
    if (winner && winner !== this.state.active) this.setState({ active: winner });
    if (!this.state.barsIn) {
      const el = document.getElementById('lead');
      if (el && el.getBoundingClientRect().top < window.innerHeight * 1.1) this.setState({ barsIn: true });
    }
  }

  countUp() {
    const targets = [6, 8, 3, 4];
    if (this.calm) { this.setState({ counted: targets }); return; }
    const t0 = performance.now(), dur = 1100;
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      this.setState({ counted: targets.map(v => Math.round(v * e)) });
      if (k < 1) requestAnimationFrame(step);
    };
    setTimeout(() => requestAnimationFrame(step), 420);
  }

  jump(id) {
    return e => {
      if (e && e.preventDefault) e.preventDefault();
      const el = document.getElementById(id);
      if (!el) return;
      this._spyLock = Date.now() + 800;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: this.calm ? 'auto' : 'smooth' });
      this.setState({ active: id });
    };
  }

  emailClick() {
    return () => {
      // the mailto still fires; copying guarantees the address is usable
      // even when no mail client is registered
      const addr = 'hemanthr2053@gmail.com';
      const done = () => {
        clearTimeout(this._copyT);
        this.setState({ copied: true });
        this._copyT = setTimeout(() => this.setState({ copied: false }), 3200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(done, done);
      } else done();
    };
  }

  openResume() {
    return e => {
      if (e && e.preventDefault) e.preventDefault();
      const save = href => {
        const a = document.createElement('a');
        a.href = href; a.download = RESUME_FILE; a.style.display = 'none';
        document.body.appendChild(a); a.click();
        setTimeout(() => a.remove(), 0);
      };
      // open the tab synchronously so it is never treated as a popup
      const tab = window.open('', '_blank');
      fetch(RESUME_URL).then(r => (r.ok ? r.blob() : Promise.reject(r.status))).then(b => {
        const blobUrl = URL.createObjectURL(b);
        if (tab) tab.location.replace(blobUrl); else window.open(blobUrl, '_blank');
        save(blobUrl);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      }).catch(() => {
        if (tab) tab.location.replace(RESUME_URL); else window.open(RESUME_URL, '_blank');
        save(RESUME_URL);
      });
    };
  }

  renderVals() {
    const d = this.state.d;
    const narrow = this.state.narrow, mid = this.state.mid;
    const accent = this.props.accent || '#7FA9F0';
    const calm = this.calm;
    const hair = 'rgba(168,185,212,.16)';
    const panel = '#0C1A34';
    const rise = i => ({ display: 'inline-block', animation: calm ? 'none' : 'v5rise .9s cubic-bezier(.16,.84,.3,1) ' + (0.05 + i * 0.1) + 's both' });

    const activeIdx = Math.max(0, this.SECTIONS.indexOf(this.state.active));
    const itemW = narrow ? 34 : 46;
    const headerStyle = {
      position: 'fixed', bottom: narrow ? 'max(16px, env(safe-area-inset-bottom))' : '26px',
      left: '50%', transform: 'translateX(-50%)', zIndex: 120,
      display: 'flex', alignItems: 'center', maxWidth: 'calc(100vw - 20px)',
      overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none',
      padding: narrow ? '11px 14px' : '13px 20px', borderRadius: '999px',
      background: 'rgba(6,14,31,.62)', backdropFilter: 'blur(26px) saturate(160%)',
      border: '1px solid rgba(168,185,212,.09)', boxShadow: '0 20px 56px rgba(2,6,16,.32)'
    };
    const spineTrackStyle = {
      position: 'absolute', top: '50%', left: (itemW / 2) + 'px', right: (itemW / 2) + 'px', height: '1px',
      transform: 'translateY(-50%)', background: 'rgba(168,185,212,.18)', pointerEvents: 'none'
    };
    const spineFillStyle = {
      position: 'absolute', left: 0, top: '-0.5px', height: '2px',
      width: (activeIdx / (this.SECTIONS.length - 1) * 100) + '%',
      background: accent, boxShadow: '0 0 8px ' + accent + '80',
      transition: 'width .55s cubic-bezier(.16,.84,.3,1)'
    };
    const hoverNav = this.state.hoverNav;
    const navItems = [['top', 'Intro'], ['stack', 'Stack'], ['case', 'Work'], ['own', 'Projects'], ['lead', 'Experience'], ['approach', 'Approach'], ['contact', 'Contact']].map(n => {
      const on = this.state.active === n[0];
      const shown = on || hoverNav === n[0];
      return {
        id: n[0], label: n[1], href: '#' + n[0], onClick: this.jump(n[0]), current: on ? 'true' : undefined,
        onEnter: () => this.setState({ hoverNav: n[0] }), onLeave: () => this.setState({ hoverNav: null }),
        rowStyle: {
          position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textDecoration: 'none', width: itemW + 'px', height: '18px', flex: 'none',
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
        },
        dotStyle: {
          width: on ? '9px' : '7px', height: on ? '9px' : '7px', borderRadius: '50%', flex: 'none',
          background: on || shown ? accent : 'transparent',
          border: '1px solid ' + (on || shown ? accent : 'rgba(168,185,212,.42)'),
          boxShadow: on ? '0 0 0 5px rgba(127,169,240,.13)' : 'none',
          transition: 'width .3s ease, height .3s ease, background .3s ease, border-color .3s ease, box-shadow .3s ease'
        },
        labelStyle: {
          position: 'absolute', bottom: '26px', left: '50%', display: 'flex', alignItems: 'center',
          font: "400 10.5px/1 'Space Grotesk', sans-serif", letterSpacing: '.1em',
          color: on ? '#EDF2FB' : '#C4D2E8', whiteSpace: 'nowrap', pointerEvents: 'none',
          padding: '7px 10px', borderRadius: '6px',
          background: 'rgba(8,17,38,.9)', border: '1px solid rgba(168,185,212,.12)',
          opacity: shown ? 1 : 0,
          transform: shown ? 'translate(-50%, 0)' : 'translate(-50%, 6px)',
          transition: 'opacity .28s ease, transform .28s cubic-bezier(.16,.84,.3,1), color .3s ease'
        }
      };
    });
    const mainStyle = { paddingTop: '20px', paddingBottom: narrow ? '84px' : '96px', position: 'relative' };
    const progressStyle = {
      position: 'fixed', top: 0, left: 0, height: '2px', zIndex: 140, pointerEvents: 'none', width: '0%',
      background: 'linear-gradient(90deg, rgba(127,169,240,0), ' + accent + ')'
    };

    const sectionStyle = {
      position: 'relative', zIndex: 2, scrollMarginTop: '24px',
      padding: 'clamp(48px,6.4vh,84px) clamp(20px,5vw,72px)',
      maxWidth: '1440px', margin: '0 auto'
    };
    const contactSectionStyle = Object.assign({}, sectionStyle, { paddingBottom: 'clamp(44px,6vh,72px)' });
    const headBlockStyle = { display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: 'clamp(28px,3.4vw,44px)' };
    const eyebrowStyle = { font: "500 clamp(13px,1.15vw,15px)/1.3 'JetBrains Mono', monospace", letterSpacing: '.06em', color: accent };
    const sectionLeadStyle = {
      margin: 0, maxWidth: '66ch',
      font: "300 clamp(16px,1.35vw,18px)/1.7 'Space Grotesk', sans-serif", color: '#C4D2E8', textWrap: 'pretty'
    };

    const heroStyle = {
      position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column',
      gap: 'clamp(30px,3.6vw,48px)', justifyContent: 'center',
      minHeight: narrow ? 'auto' : 'calc(100vh - 20px)',
      padding: 'clamp(46px,7vh,88px) clamp(20px,5vw,72px) ' + (narrow ? 'clamp(52px,7vh,84px)' : '152px'),
      alignItems: 'center', textAlign: 'center', overflow: 'hidden',
      maxWidth: '1440px', margin: '0 auto'
    };
    const heroTitleStyle = {
      margin: 0, fontFamily: "'Sora', sans-serif", fontWeight: 300,
      fontSize: 'clamp(32px,5.6vw,82px)', lineHeight: 1.05, textTransform: 'uppercase',
      letterSpacing: '.04em', color: '#EDF2FB', willChange: calm ? 'auto' : 'transform', maxWidth: '18ch'
    };
    const h2Style = {
      margin: 0, font: "500 clamp(28px,3.1vw,44px)/1.1 'Sora', sans-serif",
      letterSpacing: '-.024em', color: '#EDF2FB'
    };
    const bodyLead = { margin: '0 auto', maxWidth: '60ch', font: "300 clamp(17px,1.5vw,22px)/1.6 'Space Grotesk', sans-serif", color: '#C4D2E8', textWrap: 'pretty' };

    const heroInnerStyle = {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 'clamp(20px,2.6vh,28px)', minWidth: 0, maxWidth: '960px',
      position: 'relative', zIndex: 2
    };
    const heroArtStyle = {
      position: 'absolute', left: '50%', top: narrow ? '58%' : '62%', zIndex: 0, pointerEvents: 'none',
      width: narrow ? 'min(680px, 132vw)' : 'min(1180px, 104%)',
      height: narrow ? 'min(680px, 132vw)' : 'min(1180px, 104%)',
      transform: 'translate(-50%,-50%)', opacity: calm ? 0.24 : 0.28,
      WebkitMaskImage: 'radial-gradient(closest-side, #000 62%, rgba(0,0,0,.35) 84%, transparent 100%)',
      maskImage: 'radial-gradient(closest-side, #000 62%, rgba(0,0,0,.35) 84%, transparent 100%)'
    };
    const heroArtFloatStyle = {
      width: '100%', height: '100%',
      WebkitMaskImage: 'linear-gradient(180deg, transparent 34%, rgba(0,0,0,.55) 46%, #000 58%)',
      maskImage: 'linear-gradient(180deg, transparent 34%, rgba(0,0,0,.55) 46%, #000 58%)',
      animation: calm ? 'none' : 'v5float 14s ease-in-out infinite'
    };
    const heroGlowStyle = {
      position: 'absolute', left: '50%', top: narrow ? '74%' : '78%', zIndex: 0, pointerEvents: 'none',
      width: 'min(980px, 220vw)', height: 'min(620px, 140vw)', transform: 'translate(-50%,-50%)',
      background: 'radial-gradient(closest-side, rgba(127,169,240,.1), rgba(90,169,255,.045) 55%, transparent 78%)'
    };
    const ctaPrimary = {
      display: 'inline-flex', alignItems: 'center', padding: '16px 26px', background: '#EDF2FB', color: '#081434',
      font: "500 14px/1 'Space Grotesk', sans-serif", letterSpacing: '.01em', textDecoration: 'none',
      whiteSpace: 'nowrap', transform: 'translate3d(0,0,0)',
      transition: 'transform .35s cubic-bezier(.16,.84,.3,1)', willChange: 'transform'
    };
    const ctaGhost = {
      display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 26px', color: '#EDF2FB',
      font: "400 14px/1 'Space Grotesk', sans-serif", letterSpacing: '.01em', whiteSpace: 'nowrap',
      border: '1px solid rgba(168,185,212,.28)', textDecoration: 'none', transition: 'border-color .3s ease, background .3s ease'
    };

    const stackGroupsRaw = d ? d.stack.slice(1) : [];
    const also = d ? d.alsoWorkedWith : [];
    const stackBandStyle = { display: 'flex', flexDirection: 'column', gap: 'clamp(24px,2.8vw,34px)' };
    const coreItems = (d ? d.stack[0].items : []).map(t => ({ t }));
    const coreItemStyle = {
      font: "500 clamp(19px,2.2vw,29px)/1.14 'Sora', sans-serif",
      letterSpacing: '-.028em', color: '#EDF2FB'
    };
    const stackColsStyle = {
      display: 'grid', gap: 'clamp(20px,2.4vw,34px)',
      gridTemplateColumns: narrow ? '1fr' : (mid ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))')
    };
    const stackColumns = stackGroupsRaw.map(g => ({ label: g.group.toUpperCase(), items: g.items, muted: false }))
      .concat(also.length ? [{ label: 'ALSO WORKED WITH', items: also, muted: true }] : [])
      .map(g => ({
        label: g.label, line: g.items.join(', '),
        style: { display: 'flex', flexDirection: 'column', gap: '11px', paddingTop: '14px', borderTop: '1px solid ' + (g.muted ? 'rgba(168,185,212,.12)' : 'rgba(127,169,240,.34)') },
        labelStyle: { font: "400 10px/1.4 'JetBrains Mono', monospace", letterSpacing: '.2em', color: g.muted ? '#8DA0BF' : '#7FA9F0' },
        lineStyle: { font: "300 14px/1.75 'Space Grotesk', sans-serif", color: g.muted ? '#8DA0BF' : '#A8B9D4', textWrap: 'pretty' }
      }));
    const coreCount = d ? d.stack[0].items.length : 0;
    const restCount = stackGroupsRaw.reduce((n, g) => n + g.items.length, 0) + also.length;
    const stackCount = coreCount + ' core · ' + restCount + ' more';

    const cdefs = [['', 'Years in frontend'], ['', 'Developers led'], ['', 'Product lines, concurrently'], ['', 'Independent products shipped']];
    const statOuterStyle = { maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px,5vw,72px)' };
    const statGridStyle = {
      display: 'grid', gap: '1px', background: 'rgba(168,185,212,.14)',
      gridTemplateColumns: narrow ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))',
      borderTop: '1px solid ' + hair, borderBottom: '1px solid ' + hair
    };
    const counters = cdefs.map((c, i) => ({
      shown: this.state.counted[i], suffix: c[0], label: c[1],
      style: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: '#0A1729',
        padding: 'clamp(24px,2.8vw,34px) clamp(18px,2.2vw,28px)'
      }
    }));
    const counterNumStyle = { font: "600 clamp(34px,3.6vw,50px)/1 'Sora', sans-serif", letterSpacing: '-.03em', color: '#EDF2FB' };

    const leadGridStyle = {
      display: 'grid', gap: '1px', background: hair, border: '1px solid ' + hair,
      gridTemplateColumns: 'repeat(' + (narrow ? 1 : 2) + ', minmax(0,1fr))'
    };
    const buildGridStyle = {
      marginTop: '1px', display: 'grid', gap: '1px', background: hair,
      border: '1px solid ' + hair, borderTop: 'none',
      gridTemplateColumns: 'repeat(' + (narrow ? 1 : 3) + ', minmax(0,1fr))'
    };
    const contactGridStyle = {
      display: 'grid', gap: '1px', background: hair, border: '1px solid ' + hair,
      gridTemplateColumns: narrow ? '1fr' : 'repeat(2, minmax(0,1fr))'
    };
    const cardBase = {
      background: panel, padding: 'clamp(24px,2.6vw,32px)',
      display: 'flex', flexDirection: 'column', gap: '12px',
      transition: 'background .35s ease, transform .4s cubic-bezier(.16,.84,.3,1)'
    };
    const leadDefs = [
      ['8 developers', 'Allocation, not delegation', 'Sprint planning and task allocation across three product lines — with the hardest module on my own plate each sprint, so estimates stayed honest.'],
      ['Every PR', 'Review as the quality gate', 'GitHub pull-request review on coding standards, type safety and component architecture. Nothing merged on trust alone, including my own work.'],
      ['Unit + E2E', 'Tests before ship, not after', 'Coverage required per feature before release, defects tracked in JIRA so regressions had an owner rather than a mention.'],
      ['3 functions', 'Contracts agreed up front', 'API shapes settled with product, QA and backend before build started — the cheapest place to kill an integration bug.']
    ];
    const leadCards = leadDefs.map(l => ({
      metric: l[0], title: l[1], body: l[2],
      style: Object.assign({}, cardBase, { minHeight: '236px' }),
      barStyle: { marginTop: 'auto', height: '2px', width: '28px', background: accent }
    }));

    const T0 = 2020 * 12 + 6, SPAN = 72;
    const mo = s => { const p = String(s || '2020-07').split('-'); return (+p[0]) * 12 + (+p[1]) - 1 - T0; };
    const labelCol = narrow ? '116px' : 'minmax(160px,204px)';
    const trackGrid = { display: 'grid', gridTemplateColumns: labelCol + ' minmax(0,1fr)', gap: '0 clamp(14px,2vw,24px)' };
    const timelineYears = [0, 1, 2, 3, 4, 5, 6].map(i => ({
      label: String(2020 + i),
      labelStyle: {
        position: 'absolute', top: '6px', left: ((i * 12) / SPAN * 100) + '%',
        transform: i === 6 ? 'translateX(-100%)' : 'none',
        font: "400 10px/1 'JetBrains Mono', monospace", letterSpacing: '.14em', color: 'rgba(141,160,191,.95)'
      }
    }));
    const log = d ? d.runLog : [];
    const barsIn = this.state.barsIn || calm;
    const timelineRows = log.map((r, i) => {
      const a = mo(r.from), b = mo(r.to) + 1;
      const promoted = r.status === 'PROMOTED';
      const on = !!this.state.open[r.entry];
      const w = Math.max(b - a, 3) / SPAN * 100;
      const endPct = (a / SPAN * 100) + w;
      return {
        key: r.entry, role: r.role, period: r.period, pressed: on,
        aria: r.role + ', ' + r.period + '. Toggle detail.',
        tag: r.duration,
        onClick: () => this.setState(s => ({ open: Object.assign({}, s.open, { [r.entry]: !s.open[r.entry] }) })),
        rowStyle: Object.assign({}, trackGrid, {
          alignItems: 'center', padding: '12px 0',
          borderTop: i === 0 ? '1px solid ' + hair : '1px solid rgba(168,185,212,.1)'
        }),
        trackStyle: {
          position: 'relative', display: 'block', height: '34px',
          backgroundImage: 'repeating-linear-gradient(to right, rgba(168,185,212,.1) 0 1px, transparent 1px calc(100% / 6))'
        },
        barStyle: {
          position: 'absolute', top: '5px', height: '24px',
          left: (a / SPAN * 100) + '%', width: (barsIn ? w : 0) + '%',
          cursor: 'pointer', padding: 0,
          background: promoted ? 'rgba(69,196,176,.12)' : 'rgba(211,224,247,.05)',
          border: '1px solid ' + (on ? accent : (promoted ? 'rgba(69,196,176,.42)' : hair)),
          transition: 'width .9s cubic-bezier(.16,.84,.3,1) ' + (i * 0.08) + 's, border-color .3s ease'
        },
        tagStyle: Object.assign({
          position: 'absolute', top: 0, height: '34px', display: 'flex', alignItems: 'center',
          font: "400 10px/1.4 'JetBrains Mono', monospace", letterSpacing: '.1em', whiteSpace: 'nowrap',
          pointerEvents: 'none', opacity: barsIn ? 1 : 0, transition: 'opacity .5s ease ' + (0.35 + i * 0.08) + 's',
          color: promoted ? '#45C4B0' : '#8DA0BF'
        }, endPct > 80
          ? { right: (100 - endPct) + '%', paddingRight: '11px' }
          : { left: endPct + '%', paddingLeft: '11px' })
      };
    });
    const axisRowStyle = Object.assign({}, trackGrid, { borderTop: '1px solid ' + hair, marginTop: '2px' });

    const logRows = log.map(r => {
      const open = !!this.state.open[r.entry];
      const promoted = r.status === 'PROMOTED';
      return {
        key: r.entry, role: r.role, period: r.period, duration: r.duration, bullets: r.bullets, tech: r.tech,
        status: promoted ? 'Promoted' : 'Closed', orgLine: r.org + ' · ' + r.place, open,
        onToggle: () => this.setState(s => ({ open: Object.assign({}, s.open, { [r.entry]: !s.open[r.entry] }) })),
        rowStyle: {
          width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
          color: 'inherit', font: 'inherit', display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          gap: '14px 20px', padding: '24px 0'
        },
        detailStyle: {
          display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', overflow: 'hidden', minHeight: 0,
          paddingBottom: open ? '30px' : '0px', opacity: open ? 1 : 0,
          transition: 'grid-template-rows .55s cubic-bezier(.16,.84,.3,1), padding-bottom .55s cubic-bezier(.16,.84,.3,1), opacity .4s ease'
        },
        badgeStyle: {
          font: "400 10.5px/1 'JetBrains Mono', monospace", letterSpacing: '.14em', padding: '7px 11px',
          color: promoted ? '#45C4B0' : '#8DA0BF',
          border: '1px solid ' + (promoted ? 'rgba(69,196,176,.4)' : hair)
        },
        chev: open ? '−' : '+',
        chevStyle: { font: "400 15px/1 'JetBrains Mono', monospace", color: accent, width: '14px', textAlign: 'center' }
      };
    });

    const caseCols = narrow || mid ? '1fr' : 'minmax(0,1.05fr) minmax(0,1fr)';
    const caseDivider = narrow || mid ? 'none' : '1px solid ' + hair;
    const caseFacts = [
      { k: 'My role', v: 'Frontend owner · UI team lead' },
      { k: 'Span', v: 'Apr 2024 — Jul 2026' },
      { k: 'Team', v: '8 developers' },
      { k: 'Stack', v: 'React · TypeScript · Redux' }
    ];
    const caseSteps = [
      { n: '01', title: 'Took the worst module myself', body: 'The densest monitoring surfaces were mine to implement rather than delegated — the fastest way to find out where the architecture actually hurt.' },
      { n: '02', title: 'Made state legible, then reusable', body: 'Redux standardised across every page so run status came from one place, and the resulting components were adopted across other product modules.' },
      { n: '03', title: 'Cut what the browser had to do', body: 'Route-level code splitting, lazy loading and raster assets replaced with SVG — each change validated in Lighthouse rather than assumed.' },
      { n: '04', title: 'Held the line at review', body: 'Type safety, component architecture and required unit + E2E coverage enforced in pull requests, across three products and eight developers.' }
    ];
    const briefCases = [
      { name: 'Bot Patrol', stack: 'React + TS', line: 'Automation platform on the same team and cadence — representing long-running work: what ran, its state, and what a human needs to do next.', meta: 'Frontend owner · 2024 — 2026' },
      { name: 'MHADA housing portal', stack: 'React', line: 'Public-facing government portal delivered alongside both enterprise lines, held to the same review, responsiveness and cross-browser bar.', meta: 'Frontend delivery · public sector' }
    ].map(b => Object.assign({}, b, { style: Object.assign({}, cardBase, { minHeight: '176px' }) }));

    const builds = d ? d.builds : [];
    const featureRaw = builds.find(b => b.featured) || { name: '', kind: '', body: '', tech: [], url: '', repo: '' };
    const feature = Object.assign({}, featureRaw, { hasRepo: !!(featureRaw.repo && featureRaw.url) });
    const featCols = narrow || mid ? '1fr' : 'minmax(0,1fr) minmax(0,.92fr)';
    const featSideStyle = {
      padding: 'clamp(26px,3.2vw,44px)', display: 'flex', flexDirection: 'column', gap: '18px',
      background: 'rgba(18,39,74,.4)', alignSelf: 'stretch',
      borderLeft: narrow || mid ? 'none' : '1px solid ' + hair,
      borderTop: narrow || mid ? '1px solid ' + hair : 'none'
    };
    const featLayers = [
      { n: '01', title: 'Camera and stream management', body: "Register IP cameras, hold their config and watch each feed's health from one surface." },
      { n: '02', title: 'Live video in the browser', body: 'Multiple streams decoded and rendered at once without dropping frames or blocking the UI.' },
      { n: '03', title: 'Real-time detection overlay', body: 'AI detections and ANPR plate reads drawn over the live frame the moment they arrive.' },
      { n: '04', title: 'Dashboards and reports', body: 'Event history per camera and period, aggregated into dashboards and exportable reports.' }
    ];
    const otherBuilds = builds.filter(b => !b.featured).map(b => ({
      name: b.name, kind: b.kind, body: b.body, tech: b.tech, url: b.url, repo: b.repo,
      hasRepo: !!(b.repo && b.url), noRepo: !(b.repo && b.url),
      style: Object.assign({}, cardBase, { gap: '13px' })
    }));

    const approachDefs = [
      ['01', 'Measure, then change', 'Route-level code splitting, lazy loading and SVG in place of raster assets — every change validated in Lighthouse per release rather than assumed to help.'],
      ['02', 'One state pattern per app', 'Redux standardised across every page, so status comes from a single place and a new module inherits the pattern instead of inventing one.'],
      ['03', 'Components earn reuse', 'A component becomes shared once a second product module needs it — libraries grown out of real duplication, not written speculatively.'],
      ['04', 'Types and tests at the boundary', 'Type safety and required unit + E2E coverage checked at pull request, so a regression has an owner before it reaches release.']
    ];
    const approachGridStyle = {
      display: 'grid', gap: 'clamp(26px,3vw,40px)',
      gridTemplateColumns: narrow ? '1fr' : (mid ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))')
    };
    const approach = approachDefs.map(a => ({
      n: a[0], title: a[1], body: a[2],
      style: {
        display: 'flex', flexDirection: 'column', gap: '12px',
        paddingTop: '18px', borderTop: '1px solid rgba(127,169,240,.34)'
      }
    }));

    const contacts = [
      { label: 'Résumé', value: 'PDF · 2 pages', href: RESUME_URL, target: '_blank', onClick: this.openResume(), arrow: '↗' },
      { label: 'Phone', value: '+91 8072733799', href: 'tel:+918072733799', target: '_self', arrow: '↗' },
      { label: 'GitHub', value: 'github.com/Hemanth2053', href: 'https://github.com/Hemanth2053', target: '_blank', arrow: '↗' },
      { label: 'LinkedIn', value: 'in/hemanth-kumar-444b81210', href: 'https://linkedin.com/in/hemanth-kumar-444b81210', target: '_blank', arrow: '↗' }
    ].map(c => Object.assign({}, c, {
      style: {
        background: panel, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '16px',
        textDecoration: 'none', transition: 'background .3s ease', minWidth: 0
      },
      valueStyle: {
        flex: 1, minWidth: 0, textAlign: 'right',
        font: "400 14px/1.4 'Space Grotesk', sans-serif", color: '#EDF2FB',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }
    }));
    const locationStyle = {
      background: panel, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '16px',
      minWidth: 0, gridColumn: '1 / -1'
    };
    const locationValueStyle = {
      flex: 1, minWidth: 0, textAlign: 'right',
      font: "400 14px/1.4 'Space Grotesk', sans-serif", color: '#C4D2E8',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
    };
    const contactPrimaryStyle = {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px',
      padding: 'clamp(22px,2.6vw,30px)', background: '#EDF2FB', color: '#081434', textDecoration: 'none'
    };

    return {
      headerStyle, navItems, spineTrackStyle, spineFillStyle,
      contactJump: this.jump('contact'), resumeClick: this.openResume(), emailClick: this.emailClick(),
      copyNote: this.state.copied ? 'Address copied — hemanthr2053@gmail.com' : 'Opens your mail app',
      copyNoteStyle: {
        font: "400 11.5px/1.7 'JetBrains Mono', monospace", letterSpacing: '.08em',
        color: this.state.copied ? '#45C4B0' : '#8DA0BF', transition: 'color .3s ease'
      },
      mainStyle, progressStyle,
      sectionStyle, contactSectionStyle, headBlockStyle, eyebrowStyle, sectionLeadStyle,
      heroStyle, heroInnerStyle, heroArtStyle, heroArtFloatStyle, heroGlowStyle, heroTitleStyle, h2Style,
      riseA: rise(0),
      riseMeta: Object.assign({}, rise(1), { display: 'block' }),
      riseC: Object.assign({}, rise(2), bodyLead, { display: 'block' }),
      riseD: Object.assign({}, rise(3), { display: 'flex', flexWrap: 'wrap', rowGap: '14px', columnGap: '12px', alignItems: 'center', justifyContent: 'center' }),
      ctaPrimary, ctaGhost,
      stackBandStyle, coreItems, coreItemStyle, stackColsStyle, stackColumns, stackCount,
      counters, counterNumStyle, statOuterStyle, statGridStyle, leadCards, leadGridStyle, buildGridStyle, contactGridStyle,
      timelineRows, timelineYears, axisRowStyle, logRows,
      caseCols, caseDivider, caseFacts, caseSteps, briefCases,
      feature, featCols, featSideStyle, featLayers, otherBuilds,
      approach, approachGridStyle,
      contacts, contactPrimaryStyle, locationStyle, locationValueStyle
    };
  }

  render() {
    const v = this.renderVals();
    const hairLine = { flex: 1, height: '1px', background: 'rgba(168,185,212,.16)' };
    return (
      <React.Fragment>
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(130vw 53vw at 50% -6.25vw, rgba(127,169,240,.1), transparent 78%),radial-gradient(110vw 50vw at 88% 6.25vw, rgba(90,169,255,.08), transparent 75%),linear-gradient(180deg,#081434 0%,#060E1F 46%,#050B18 100%)' }}></div>
        <div aria-hidden="true" ref={this.progressRef} style={v.progressStyle}></div>

        <nav aria-label="Sections" style={v.headerStyle}>
          <div aria-hidden="true" style={v.spineTrackStyle}><div style={v.spineFillStyle}></div></div>
          {v.navItems.map(n => (
            <a key={n.id} href={n.href} onClick={n.onClick} onMouseEnter={n.onEnter} onMouseLeave={n.onLeave}
               onFocus={n.onEnter} onBlur={n.onLeave} aria-current={n.current} aria-label={n.label} style={n.rowStyle}>
              <span aria-hidden="true" style={n.dotStyle}></span>
              <span aria-hidden="true" style={n.labelStyle}>{n.label}</span>
            </a>
          ))}
        </nav>

        <main style={v.mainStyle}>
          <section id="top" style={v.heroStyle}>
            <div aria-hidden="true" style={v.heroGlowStyle}></div>
            <div aria-hidden="true" style={v.heroArtStyle}>
              <div style={v.heroArtFloatStyle}>
                <img src="./hero-3d-mesh-v2.png" alt="" width="820" height="820" decoding="async"
                     style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              </div>
            </div>
            <div style={v.heroInnerStyle}>
              <h1 ref={this.heroRef} style={v.heroTitleStyle}>
                <span style={{ display: 'block', overflow: 'hidden' }}><span style={v.riseA}>Hemanth Kumar R</span></span>
              </h1>
              <div style={{ overflow: 'hidden' }}><div style={v.riseMeta}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '11px 18px', font: "400 clamp(15px,1.45vw,18px)/1.5 'Space Grotesk', sans-serif" }}>
                  <span style={{ flex: 'none', whiteSpace: 'nowrap', fontWeight: 500, color: '#EDF2FB' }}>Senior Frontend Engineer · Frontend Team Lead</span>
                  <span aria-hidden="true" style={{ flex: 'none', width: '1px', height: '16px', background: 'rgba(168,185,212,.28)' }}></span>
                  <span style={{ flex: 'none', whiteSpace: 'nowrap', color: '#A8B9D4' }}>Chennai · open to relocation or remote</span>
                  <span style={{ flex: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#45C4B0' }}>
                    <span aria-hidden="true" style={{ flex: 'none', width: '6px', height: '6px', borderRadius: '50%', background: '#45C4B0', animation: 'v5breathe 3.4s ease-in-out infinite' }}></span>Available now
                  </span>
                </div>
              </div></div>
              <div style={{ overflow: 'hidden' }}>
                <p style={v.riseC}>Six years on enterprise monitoring and automation software — dense, data-heavy interfaces people keep open all day. I led eight developers across three concurrent product lines and kept the hardest module on my own plate each sprint.</p>
              </div>
              <div style={v.riseD}>
                <a href="#contact" onClick={v.contactJump} style={v.ctaPrimary}>Start a conversation</a>
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" onClick={v.resumeClick} style={v.ctaGhost}>Résumé <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </section>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={v.statOuterStyle}><div style={v.statGridStyle}>
              {v.counters.map((c, i) => (
                <div key={i} style={c.style}>
                  <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '3px' }}>
                    <span style={v.counterNumStyle}>{c.shown}</span>
                    <span style={{ font: "500 16px/1 'Space Grotesk', sans-serif", color: '#7FA9F0' }}>{c.suffix}</span>
                  </span>
                  <span style={{ font: "400 14px/1.45 'Space Grotesk', sans-serif", letterSpacing: '.01em', color: '#C4D2E8', textAlign: 'center' }}>{c.label}</span>
                </div>
              ))}
            </div></div>
          </div>

          <section id="stack" style={v.sectionStyle}>
            <div data-r style={v.headBlockStyle}>
              <span style={v.eyebrowStyle}>Engineering Expertise</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
                <h2 data-split style={v.h2Style}>What I work in</h2>
                <span aria-hidden="true" style={hairLine}></span>
              </div>
              <p style={v.sectionLeadStyle}>Daily drivers first — then everything else that has shown up in production work — {v.stackCount}.</p>
            </div>
            <div data-r style={v.stackBandStyle}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', rowGap: '14px', columnGap: 'clamp(20px,2.8vw,42px)' }}>
                {v.coreItems.map(c => <span key={c.t} style={v.coreItemStyle}>{c.t}</span>)}
              </div>
              <div style={v.stackColsStyle}>
                {v.stackColumns.map(g => (
                  <div key={g.label} style={g.style}>
                    <span style={g.labelStyle}>{g.label}</span>
                    <span style={g.lineStyle}>{g.line}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="case" style={v.sectionStyle}>
            <div data-r style={v.headBlockStyle}>
              <span style={v.eyebrowStyle}>Selected Work</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
                <h2 data-split style={v.h2Style}>The hard one</h2>
                <span aria-hidden="true" style={hairLine}></span>
              </div>
              <p style={v.sectionLeadStyle}>Continuity Patrol is my employer's product; I led and delivered its frontend. Problem shape and engineering decisions only.</p>
            </div>

            <article data-r style={{ border: '1px solid rgba(168,185,212,.16)', background: '#0C1A34' }}>
              <div style={{ display: 'grid', gridTemplateColumns: v.caseCols, gap: 0 }}>
                <div style={{ padding: 'clamp(26px,3.2vw,42px)', display: 'flex', flexDirection: 'column', gap: '16px', borderRight: v.caseDivider }}>
                  <span style={{ font: "400 10.5px/1 'JetBrains Mono', monospace", letterSpacing: '.2em', color: '#7FA9F0' }}>Continuity Patrol · React + TypeScript</span>
                  <h3 style={{ margin: 0, font: "600 clamp(23px,2.4vw,32px)/1.16 'Sora', sans-serif", letterSpacing: '-.025em', color: '#EDF2FB' }}>Screens that stay open for an eight-hour shift</h3>
                  <p style={{ margin: 0, font: "300 16px/1.72 'Space Grotesk', sans-serif", color: '#A8B9D4', textWrap: 'pretty' }}>Business-continuity monitoring: replication checks, failover drills and thousands of runs, all needing to stay legible while state changes underneath the operator. Two failure modes matter here and neither is visual — the page degrading as data grows, and the operator losing track of what changed.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '16px', paddingTop: '14px', marginTop: 'auto', borderTop: '1px solid rgba(168,185,212,.12)' }}>
                    {v.caseFacts.map(f => (
                      <div key={f.k} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ font: "400 10px/1 'JetBrains Mono', monospace", letterSpacing: '.16em', color: '#8DA0BF' }}>{f.k}</span>
                        <span style={{ font: "400 13.5px/1.4 'Space Grotesk', sans-serif", color: '#C4D2E8' }}>{f.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: 'clamp(26px,3.2vw,42px)', display: 'flex', flexDirection: 'column', gap: '22px', background: 'rgba(18,39,74,.4)' }}>
                  {v.caseSteps.map(s => (
                    <div key={s.n} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '14px' }}>
                      <span style={{ font: "500 10.5px/1.7 'JetBrains Mono', monospace", letterSpacing: '.1em', color: '#7FA9F0' }}>{s.n}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                        <span style={{ font: "500 15px/1.4 'Space Grotesk', sans-serif", letterSpacing: '-.005em', color: '#EDF2FB' }}>{s.title}</span>
                        <span style={{ font: "300 14.5px/1.68 'Space Grotesk', sans-serif", color: '#A8B9D4', textWrap: 'pretty' }}>{s.body}</span>
                      </div>
                    </div>
                  ))}
                  <span style={{ font: "400 12.5px/1.6 'Space Grotesk', sans-serif", letterSpacing: '.01em', color: '#8DA0BF', borderTop: '1px solid rgba(168,185,212,.12)', paddingTop: '16px', textWrap: 'pretty' }}>Before/after figures were measured in Lighthouse per release but belong to my employer — happy to walk through the methodology and what moved.</span>
                </div>
              </div>
            </article>

            <div data-r style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1px', background: 'rgba(168,185,212,.16)', border: '1px solid rgba(168,185,212,.16)' }}>
              {v.briefCases.map(b => (
                <article key={b.name} style={b.style}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '14px' }}>
                    <h3 style={{ margin: 0, font: "500 20px/1.24 'Sora', sans-serif", letterSpacing: '-.018em', color: '#EDF2FB' }}>{b.name}</h3>
                    <span style={{ font: "400 10.5px/1 'JetBrains Mono', monospace", letterSpacing: '.12em', color: '#7FA9F0', whiteSpace: 'nowrap' }}>{b.stack}</span>
                  </div>
                  <p style={{ margin: 0, font: "300 15px/1.68 'Space Grotesk', sans-serif", color: '#A8B9D4', textWrap: 'pretty' }}>{b.line}</p>
                  <span style={{ font: "400 10.5px/1.6 'JetBrains Mono', monospace", letterSpacing: '.12em', color: '#8DA0BF', marginTop: 'auto' }}>{b.meta}</span>
                </article>
              ))}
            </div>
          </section>

          <section id="own" style={v.sectionStyle}>
            <div data-r style={v.headBlockStyle}>
              <span style={v.eyebrowStyle}>Projects</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
                <h2 data-split style={v.h2Style}>My own projects</h2>
                <span aria-hidden="true" style={hairLine}></span>
              </div>
              <p style={v.sectionLeadStyle}>Mine end to end, so these can be shown and read. Source is public where noted.</p>
            </div>

            <article data-r style={{ border: '1px solid rgba(168,185,212,.16)', background: '#0C1A34', display: 'grid', alignItems: 'stretch', gridTemplateColumns: v.featCols }}>
              <div style={{ padding: 'clamp(26px,3.2vw,44px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ font: "400 10.5px/1 'JetBrains Mono', monospace", letterSpacing: '.18em', color: '#7FA9F0', border: '1px solid rgba(127,169,240,.34)', padding: '7px 10px', alignSelf: 'flex-start' }}>Featured</span>
                <h3 style={{ margin: 0, font: "600 clamp(26px,2.9vw,38px)/1.12 'Sora', sans-serif", letterSpacing: '-.03em', color: '#EDF2FB' }}>{v.feature.name}</h3>
                <span style={{ font: "400 13.5px/1.5 'Space Grotesk', sans-serif", letterSpacing: '.02em', color: '#7FA9F0' }}>{v.feature.kind}</span>
                <p style={{ margin: 0, font: "300 16px/1.72 'Space Grotesk', sans-serif", color: '#A8B9D4', textWrap: 'pretty' }}>{v.feature.body}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px', marginTop: 'auto' }}>
                  {(v.feature.tech || []).map(t => (
                    <span key={t} style={{ padding: '6px 11px', border: '1px solid rgba(168,185,212,.16)', font: "400 11px/1.4 'JetBrains Mono', monospace", letterSpacing: '.06em', color: '#A8B9D4' }}>{t}</span>
                  ))}
                </div>
                {v.feature.hasRepo && (
                  <a href={v.feature.url} target="_blank" rel="noopener noreferrer" style={{ font: "400 12px/1 'JetBrains Mono', monospace", letterSpacing: '.04em' }}>{v.feature.repo} ↗</a>
                )}
              </div>
              <div style={v.featSideStyle}>
                <span style={{ font: "400 10px/1 'JetBrains Mono', monospace", letterSpacing: '.2em', color: '#8DA0BF' }}>ARCHITECTURE</span>
                {v.featLayers.map(l => (
                  <div key={l.n} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: '12px', alignItems: 'baseline' }}>
                    <span style={{ font: "400 10px/1.6 'JetBrains Mono', monospace", color: '#7FA9F0' }}>{l.n}</span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ font: "500 14.5px/1.4 'Space Grotesk', sans-serif", color: '#EDF2FB' }}>{l.title}</span>
                      <span style={{ font: "300 14px/1.65 'Space Grotesk', sans-serif", color: '#A8B9D4', textWrap: 'pretty' }}>{l.body}</span>
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <div style={v.buildGridStyle}>
              {v.otherBuilds.map(b => (
                <article key={b.name} data-r style={b.style}>
                  <h3 style={{ margin: 0, font: "500 clamp(20px,2vw,24px)/1.24 'Sora', sans-serif", letterSpacing: '-.02em', color: '#EDF2FB' }}>{b.name}</h3>
                  <span style={{ font: "400 13px/1.5 'Space Grotesk', sans-serif", letterSpacing: '.02em', color: '#7FA9F0' }}>{b.kind}</span>
                  <p style={{ margin: 0, font: "300 15px/1.68 'Space Grotesk', sans-serif", color: '#A8B9D4', textWrap: 'pretty' }}>{b.body}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px', marginTop: 'auto' }}>
                    {(b.tech || []).map(t => (
                      <span key={t} style={{ padding: '5px 10px', border: '1px solid rgba(168,185,212,.16)', font: "400 10.5px/1.4 'JetBrains Mono', monospace", letterSpacing: '.06em', color: '#A8B9D4' }}>{t}</span>
                    ))}
                  </div>
                  {b.hasRepo && <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ font: "400 11px/1 'JetBrains Mono', monospace", letterSpacing: '.04em' }}>{b.repo} ↗</a>}
                  {b.noRepo && <span style={{ font: "400 11px/1.4 'JetBrains Mono', monospace", letterSpacing: '.1em', color: '#8DA0BF' }}>Private build · walkthrough on request</span>}
                </article>
              ))}
            </div>
          </section>

          <section id="lead" style={v.sectionStyle}>
            <div data-r style={v.headBlockStyle}>
              <span style={v.eyebrowStyle}>Experience &amp; Leadership</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
                <h2 data-split style={v.h2Style}>Experience and leadership</h2>
                <span aria-hidden="true" style={hairLine}></span>
              </div>
              <p style={v.sectionLeadStyle}>Six years across two companies — two years and three months of it leading, across three product lines, without stepping out of the codebase.</p>
            </div>
            <div data-r style={v.leadGridStyle}>
              {v.leadCards.map(l => (
                <article key={l.title} style={l.style}>
                  <span style={{ font: "500 11.5px/1.4 'JetBrains Mono', monospace", letterSpacing: '.16em', color: '#7FA9F0' }}>{l.metric}</span>
                  <h3 style={{ margin: 0, font: "500 clamp(19px,1.9vw,23px)/1.24 'Sora', sans-serif", letterSpacing: '-.018em', color: '#EDF2FB' }}>{l.title}</h3>
                  <p style={{ margin: 0, font: "300 15px/1.68 'Space Grotesk', sans-serif", color: '#A8B9D4', textWrap: 'pretty' }}>{l.body}</p>
                  <span style={l.barStyle}></span>
                </article>
              ))}
            </div>

            <div data-r style={{ marginTop: 'clamp(44px,5vw,64px)', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px 16px', marginBottom: '22px' }}>
              <h3 style={{ margin: 0, font: "500 20px/1.2 'Sora', sans-serif", letterSpacing: '-.018em', color: '#EDF2FB' }}>Track</h3>
              <span aria-hidden="true" style={{ flex: 1, minWidth: '40px', height: '1px', background: 'rgba(168,185,212,.16)' }}></span>
            </div>
            <div data-r style={{ display: 'flex', flexDirection: 'column', marginBottom: '36px' }}>
              {v.timelineRows.map(t => (
                <div key={t.key} style={t.rowStyle}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                    <span style={{ font: "500 14.5px/1.35 'Space Grotesk', sans-serif", letterSpacing: '-.005em', color: '#EDF2FB', textWrap: 'pretty' }}>{t.role}</span>
                    <span style={{ font: "400 11px/1.4 'JetBrains Mono', monospace", letterSpacing: '.1em', color: '#8DA0BF' }}>{t.period}</span>
                  </span>
                  <span style={t.trackStyle}>
                    <button type="button" onClick={t.onClick} aria-pressed={t.pressed} aria-label={t.aria} style={t.barStyle}></button>
                    <span style={t.tagStyle}>{t.tag}</span>
                  </span>
                </div>
              ))}
              <div style={v.axisRowStyle}>
                <span></span>
                <span aria-hidden="true" style={{ position: 'relative', height: '20px', display: 'block' }}>
                  {v.timelineYears.map(y => <span key={y.label} style={y.labelStyle}>{y.label}</span>)}
                </span>
              </div>
            </div>
            {v.logRows.map(r => (
              <div key={r.key} data-r style={{ borderTop: '1px solid rgba(168,185,212,.16)' }}>
                <button type="button" onClick={r.onToggle} aria-expanded={r.open} style={r.rowStyle}>
                  <span style={{ flex: 1, minWidth: '210px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    <span style={{ font: "500 clamp(19px,1.9vw,24px)/1.24 'Sora', sans-serif", letterSpacing: '-.018em', color: '#EDF2FB' }}>{r.role}</span>
                    <span style={{ font: "400 13px/1.5 'Space Grotesk', sans-serif", letterSpacing: '.02em', color: '#A8B9D4' }}>{r.orgLine}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ font: "400 12.5px/1.4 'JetBrains Mono', monospace", color: '#C4D2E8' }}>{r.period}</span>
                    <span style={r.badgeStyle}>{r.status}</span>
                    <span aria-hidden="true" style={r.chevStyle}>{r.chev}</span>
                  </span>
                </button>
                <div style={r.detailStyle}>
                  <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '80ch' }}>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
                      {r.bullets.map((b, i) => (
                        <li key={i} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: '10px', font: "300 15px/1.68 'Space Grotesk', sans-serif", color: '#A8B9D4', textWrap: 'pretty' }}>
                          <span aria-hidden="true" style={{ color: 'rgba(127,169,240,.6)', font: "400 11px/1.9 'JetBrains Mono', monospace" }}>—</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px' }}>
                      {r.tech.map(t => (
                        <span key={t} style={{ padding: '6px 11px', border: '1px solid rgba(168,185,212,.16)', font: "400 11px/1.4 'JetBrains Mono', monospace", letterSpacing: '.06em', color: '#A8B9D4' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section id="approach" style={v.sectionStyle}>
            <div data-r style={v.headBlockStyle}>
              <span style={v.eyebrowStyle}>Engineering Approach</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
                <h2 data-split style={v.h2Style}>How I work</h2>
                <span aria-hidden="true" style={hairLine}></span>
              </div>
              <p style={v.sectionLeadStyle}>Four habits that survived three concurrent product lines and eight developers.</p>
            </div>
            <div data-r style={v.approachGridStyle}>
              {v.approach.map(a => (
                <div key={a.n} style={a.style}>
                  <span style={{ font: "400 10.5px/1 'JetBrains Mono', monospace", letterSpacing: '.2em', color: '#7FA9F0' }}>{a.n}</span>
                  <h3 style={{ margin: 0, font: "500 clamp(19px,1.9vw,22px)/1.26 'Sora', sans-serif", letterSpacing: '-.018em', color: '#EDF2FB' }}>{a.title}</h3>
                  <p style={{ margin: 0, font: "300 15px/1.68 'Space Grotesk', sans-serif", color: '#A8B9D4', textWrap: 'pretty' }}>{a.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="contact" style={v.contactSectionStyle}>
            <div data-r style={v.headBlockStyle}>
              <span style={v.eyebrowStyle}>Contact</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
                <h2 data-split style={v.h2Style}>Get in touch</h2>
                <span aria-hidden="true" style={hairLine}></span>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 'clamp(20px,2.4vw,28px)' }}>
              <div data-r style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <a href="mailto:hemanthr2053@gmail.com?subject=Senior%20frontend%20role" onClick={v.emailClick} style={v.contactPrimaryStyle}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ font: "400 11px/1 'JetBrains Mono', monospace", letterSpacing: '.16em', color: 'rgba(6,14,31,.62)' }}>Best way to reach me</span>
                    <span style={{ font: "600 clamp(17px,1.9vw,23px)/1.25 'Sora', sans-serif", letterSpacing: '-.02em', overflowWrap: 'anywhere' }}>hemanthr2053@gmail.com</span>
                  </span>
                  <span aria-hidden="true" style={{ font: "400 21px/1 'Space Grotesk', sans-serif" }}>→</span>
                </a>
                <div style={v.contactGridStyle}>
                  {v.contacts.map(c => (
                    <a key={c.label} href={c.href} target={c.target} rel="noopener noreferrer" onClick={c.onClick} style={c.style}>
                      <span style={{ font: "400 10.5px/1 'JetBrains Mono', monospace", letterSpacing: '.16em', color: '#8DA0BF', flex: 'none' }}>{c.label}</span>
                      <span style={c.valueStyle}>{c.value}</span>
                      <span aria-hidden="true" style={{ font: "400 13px/1 'Space Grotesk', sans-serif", color: '#8DA0BF', flex: 'none' }}>{c.arrow}</span>
                    </a>
                  ))}
                  <div style={v.locationStyle}>
                    <span style={{ font: "400 10.5px/1 'JetBrains Mono', monospace", letterSpacing: '.16em', color: '#8DA0BF', flex: 'none', whiteSpace: 'nowrap' }}>Based in</span>
                    <span style={v.locationValueStyle}>Chennai, Tamil Nadu, India</span>
                    <span aria-hidden="true" style={{ font: "400 13px/1 'Space Grotesk', sans-serif", color: 'transparent', flex: 'none' }}>↗</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px 30px', marginTop: 'clamp(40px,5vw,60px)', paddingTop: '22px', borderTop: '1px solid rgba(168,185,212,.12)', font: "400 11px/1.7 'JetBrains Mono', monospace", letterSpacing: '.12em', color: 'rgba(141,160,191,.92)' }}>
              <span>Hemanth Kumar R · Chennai, India</span>
              <span ref={this.clockRef}>--:--:-- IST</span>
            </div>
          </section>
        </main>
      </React.Fragment>
    );
  }
}
