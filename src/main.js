import './styles.css';
import { ParticleGlobe } from './particle-globe.js';
import { ParticleRocket } from './particle-rocket.js';
import { ParticleLogo } from './particle-logo.js';
import { ParticleAws } from './particle-aws.js';
import { ParticleSecurityVisual } from './particle-security.js';

const shield = `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 44s16-8 16-20V10L24 4 8 10v14c0 12 16 20 16 20Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m18 24 4 4 8-8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const chevron = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const splitSections = [
  ['OUR MISSION', 'About Our Mission', 'At Swaptrade, our focus is on user choice. We want to make crypto accessible and easy-to-use for everyone. The mix of a non-custodial swap platform and a custodial trading platform allows you to choose whether to retain custody of your funds, or allow us to secure it - you will never be forced to do either.', 'left'],
  ['OUR STORY', 'About Us', 'Swaptrade was founded in 2020 after much thought by its founder, Andrew Elkhoury. Built on the success of its predecessor Cryptiswap – a simple swap platform – Swaptrade provides much of what made Cryptiswap a success: the non-custodial, user-friendly swap platform where users can exchange their crypto instantly. In response to customer feedback, our team decided to develop an advanced trading platform. It is the first of its kind to provide both a custodial trading platform and a non-custodial swap platform on the one exchange.', 'right'],
  ['WE ARE BACKED', 'We are backed', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'left compact']
];

const links = {
  Products: ['Swap', 'Markets', 'Trade', 'Swaptrade Coin QTX'],
  Company: ['About', 'Blog', 'Security', 'Fees', 'Partners'],
  Support: ['Help', 'Contact', 'FAQ'],
  Legal: ['Privacy', 'Terms', 'Risk Disclosure']
};

document.querySelector('#app').innerHTML = `
<div class="swaptrade-landing">
  <header class="swaptrade-nav">
    <button class="swaptrade-nav__menu-toggle" aria-label="Open menu"><span></span><span></span><span></span></button>
    <nav class="swaptrade-nav__links" aria-label="Primary">
      <a href="/about">About</a><a href="/security">Services</a>
    </nav>
    <div class="swaptrade-nav__actions">
      <div class="visual-mode" role="group" aria-label="Rocket visual style"><button class="visual-mode__option is-active" data-mode="particles" aria-pressed="true">Particles</button><button class="visual-mode__option" data-mode="illustrations" aria-pressed="false">3D Illustrations</button></div>
    </div>
  </header>
  <div class="mobile-drawer" aria-hidden="true"><nav><a href="/about">About</a><a href="/security">Services</a></nav></div>

  <main class="swaptrade-about">
    <section class="swaptrade-about-hero">
      <div class="swaptrade-about-hero__inner">
        <div class="swaptrade-about-hero__copy">
          <div class="swaptrade-about-hero__heading">
            <p class="eyebrow">ABOUT US</p>
            <h1>We are on a mission to revolutionize the crypto exchange.</h1>
            <p class="hero-body">We believe in user choice. If a user doesn’t feel safe leaving their funds on our custodial exchange, we will never force them as they can place an order on our non-custodial swap platform.</p>
          </div>
          <div class="swaptrade-about-hero__actions"><a class="about-btn ghost" href="#">Open Trading</a><a class="about-btn primary" href="#">Start Swapping</a></div>
        </div>
        <div class="swaptrade-about-hero__media" aria-label="Interactive particle globe with Bitcoin">
          <div class="globe-glow"></div>
          <div class="crypto-coin crypto-coin--btc" aria-hidden="true">
            <span class="coin-orbit coin-orbit--outer"><i></i><b></b></span><span class="coin-orbit coin-orbit--inner"></span><div class="coin-face"><span>₿</span></div>
          </div>
          <div class="crypto-coin crypto-coin--eth" aria-hidden="true">
            <span class="coin-orbit coin-orbit--outer"><i></i><b></b></span><span class="coin-orbit coin-orbit--inner"></span><div class="coin-face"><svg viewBox="0 0 32 48"><path d="M16 1 2 25l14 8 14-8L16 1Z"/><path d="m2 28 14 19 14-19-14 8-14-8Z"/></svg></div>
          </div>
          <div class="crypto-coin crypto-coin--usdt" aria-hidden="true">
            <span class="coin-orbit coin-orbit--outer"><i></i><b></b></span><span class="coin-orbit coin-orbit--inner"></span><div class="coin-face"><span>₮</span></div>
          </div>
          <div class="globe-wrap"><canvas id="particle-globe" aria-label="Rotating particle globe"></canvas><div class="globe-fallback" hidden></div></div>
          <p class="globe-hint">Move to explore</p>
        </div>
      </div>
    </section>
    ${splitSections.map(([eye,title,body,side], index) => `<section class="swaptrade-about-split media-${side.split(' ')[0]} ${side.includes('compact')?'compact':''}"><div class="swaptrade-about-split__inner"><div class="swaptrade-about-split__media visual-${index+1} ${index===0?'particle-rocket-media':index===1?'particle-logo-media':'particle-aws-media'}" aria-hidden="true">${index===0?'<div class="rocket-glow"></div><canvas id="particle-rocket"></canvas><img class="rocket-3d-image" src="/assets/cohete-3d.png" alt="" hidden><div class="rocket-fallback" hidden>↗</div><p class="rocket-hint">Move to explore</p>':index===1?'<div class="logo-particle-glow"></div><canvas id="particle-logo"></canvas><img class="logo-3d-image" src="/assets/swaptrade-logo-3d.png" alt="" hidden><div class="logo-particle-fallback" hidden>S</div><p class="particle-visual-hint">Move to explore</p>':'<div class="aws-particle-glow"></div><canvas id="particle-aws"></canvas><img class="aws-3d-image" src="/assets/aws-logo-3d.png" alt="" hidden><div class="aws-particle-fallback" hidden>aws⌣</div><p class="particle-visual-hint">Move to explore</p>'}</div><div class="swaptrade-about-split__copy"><div class="split-heading"><p class="eyebrow">${eye}</p><h2>${title}</h2></div><p>${body}</p></div></div></section>`).join('')}
    <section class="swaptrade-about-why"><div class="swaptrade-about-why__inner"><div class="why-heading"><p class="eyebrow">WHY SWAPTRADE?</p><h2>Putting control, transparency, and accessibility back into crypto trading.</h2></div><div class="why-grid">${Array.from({length:4},()=>`<article class="why-card"><span class="why-icon">${shield}</span><div><h3>Control your funds</h3><p>We never hold your assets. All swaps are processed directly between wallets.</p></div></article>`).join('')}</div></div></section>
  </main>
  <footer class="swaptrade-footer"><div class="footer-inner"><div class="footer-top"><div class="footer-brand"><div class="brand brand--large"><span class="brand__mark">S</span><span>SWAPTRADE</span></div><div class="social"><a href="#">𝕏</a><a href="#">↗</a><a href="#">▶</a><a href="#">●</a></div></div><div class="footer-links">${Object.entries(links).map(([heading,items])=>`<div><p>${heading}</p>${items.map(item=>`<a href="#">${item}</a>`).join('')}</div>`).join('')}</div></div><p class="copyright">© 2026 Swaptrade. All rights reserved</p></div></footer>
</div>`;

const securityMarkup = `
  <main class="swaptrade-security">
    <section class="security-hero">
      <div class="security-hero__inner">
        <div class="security-hero__copy">
          <p class="eyebrow">SECURITY</p>
          <h1>Keeping your Funds Secure is our Top Priority</h1>
          <p>With the help of AWS, Swaptrade has built a state of the art, modern security system.</p>
        </div>
        <div class="security-visual security-visual--hero">
          <div class="security-glow"></div>
          <canvas id="security-hero-particles" aria-label="Interactive particle shield with checkmark"></canvas>
          <div class="crypto-coin crypto-coin--btc" aria-hidden="true">
            <span class="coin-orbit coin-orbit--outer"><i></i><b></b></span><span class="coin-orbit coin-orbit--inner"></span><div class="coin-face"><span>₿</span></div>
          </div>
          <div class="crypto-coin crypto-coin--eth" aria-hidden="true">
            <span class="coin-orbit coin-orbit--outer"><i></i><b></b></span><span class="coin-orbit coin-orbit--inner"></span><div class="coin-face"><svg viewBox="0 0 32 48"><path d="M16 1 2 25l14 8 14-8L16 1Z"/><path d="m2 28 14 19 14-19-14 8-14-8Z"/></svg></div>
          </div>
          <div class="crypto-coin crypto-coin--usdt" aria-hidden="true">
            <span class="coin-orbit coin-orbit--outer"><i></i><b></b></span><span class="coin-orbit coin-orbit--inner"></span><div class="coin-face"><span>₮</span></div>
          </div>
          <div class="security-fallback" hidden>♢</div><p class="particle-visual-hint">Move to explore</p>
        </div>
      </div>
    </section>
    <section class="security-split media-left">
      <div class="security-split__inner">
        <div class="security-visual security-visual--world"><div class="security-glow"></div><canvas id="security-world-particles"></canvas><img class="security-lock-3d-image" src="/assets/security-lock-3d.png" alt="" hidden><div class="security-fallback" hidden>◎</div><p class="particle-visual-hint">Move to explore</p></div>
        <div class="security-split__copy"><div class="split-heading"><p class="eyebrow">SECURITY</p><h2>World Class Security</h2></div><div class="security-copy-body"><p>Swaptrade considers industry best practices the minimum standard. Swaptrade will not aspire to simply follow what others say is the best practice, instead Swaptrade will seek security innovation through uncommon thinking.</p><p>Providing world class security isn’t enough however if Swaptrade, its leadership and its staff, do not adhere to the principles of transparency. The operations, actions and communications must be delivered with honesty and integrity, consistently. Only then can we build the required trust within the crypto community.</p></div></div>
      </div>
    </section>
    <section class="security-measures"><div class="security-measures__inner"><div class="why-heading"><p class="eyebrow">SECURITY</p><h2>Our Security Measures</h2></div><div class="why-grid">${Array.from({length:4},()=>`<article class="why-card"><span class="why-icon">${shield}</span><div><h3>Control your funds</h3><p>We never hold your assets. All swaps are processed directly between wallets.</p></div></article>`).join('')}</div></div></section>
    <section class="security-split media-left">
      <div class="security-split__inner">
        <div class="security-visual security-visual--standards"><div class="security-glow"></div><canvas id="security-standards-particles"></canvas><img class="ccss-3d-image" src="/assets/ccss-isotype-3d.png" alt="" hidden><div class="security-fallback" hidden>⬡</div><p class="particle-visual-hint">Move to explore</p></div>
        <div class="security-split__copy"><div class="split-heading"><p class="eyebrow">COMPLIANCE</p><h2>Cryptocurrency Security Standard (CCSS)</h2></div><div class="security-copy-body"><p>Swaptrade will follow the Cryptocurrency Security Standard (CCSS) as a blueprint for building and operating the exchange. CCSS is currently the go-to security standard for any organization that handles and manages crypto wallets as part of its business logic. Unlike other cyber security standards, the CCSS was purpose built to secure cryptocurrency exchanges.</p><p><strong>ISO/IEC 27001:2013</strong></p><p>Swaptrade will also work to achieve the ISO 27001:2013 standard in the near future. ISO 27001 is and has been considered the international gold standard for cyber security.</p></div></div>
      </div>
    </section>
  </main>`;

if (window.location.pathname.startsWith('/security')) {
  document.querySelector('.swaptrade-about').outerHTML = securityMarkup;
}

const menuButton = document.querySelector('.swaptrade-nav__menu-toggle');
const drawer = document.querySelector('.mobile-drawer');
menuButton.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  drawer.setAttribute('aria-hidden', String(!open));
  menuButton.classList.toggle('open', open);
});

const canvas = document.querySelector('#particle-globe');
const fallback = document.querySelector('.globe-fallback');
try { if (canvas) new ParticleGlobe(canvas); } catch (error) {
  console.warn('WebGL globe fallback enabled', error);
  if (canvas) canvas.hidden = true;
  if (fallback) fallback.hidden = false;
}

const rocketCanvas = document.querySelector('#particle-rocket');
const rocketFallback = document.querySelector('.rocket-fallback');
try { if (rocketCanvas) new ParticleRocket(rocketCanvas); } catch (error) {
  console.warn('WebGL rocket fallback enabled', error);
  if (rocketCanvas) rocketCanvas.hidden = true;
  if (rocketFallback) rocketFallback.hidden = false;
}

const logoCanvas = document.querySelector('#particle-logo');
const logoFallback = document.querySelector('.logo-particle-fallback');
try { if (logoCanvas) new ParticleLogo(logoCanvas); } catch (error) {
  console.warn('WebGL logo fallback enabled', error);
  if (logoCanvas) logoCanvas.hidden = true;
  if (logoFallback) logoFallback.hidden = false;
}

const awsCanvas = document.querySelector('#particle-aws');
const awsFallback = document.querySelector('.aws-particle-fallback');
try { if (awsCanvas) new ParticleAws(awsCanvas); } catch (error) {
  console.warn('WebGL AWS fallback enabled', error);
  if (awsCanvas) awsCanvas.hidden = true;
  if (awsFallback) awsFallback.hidden = false;
}

for (const [id, mode] of [['security-hero-particles','hero'],['security-world-particles','world'],['security-standards-particles','standards']]) {
  const securityCanvas=document.getElementById(id);
  if (!securityCanvas) continue;
  try { new ParticleSecurityVisual(securityCanvas,mode); } catch (error) {
    console.warn(`WebGL ${mode} security fallback enabled`,error);
    securityCanvas.hidden=true;
    const securityFallback=securityCanvas.parentElement.querySelector('.security-fallback');
    if(securityFallback) securityFallback.hidden=false;
  }
}

function setVisualMode(mode) {
  const showIllustration = mode === 'illustrations';
  if (rocketCanvas) rocketCanvas.hidden = showIllustration;
  const rocketImage = document.querySelector('.rocket-3d-image');
  if (rocketImage) rocketImage.hidden = !showIllustration;
  if (logoCanvas) logoCanvas.hidden = showIllustration;
  const logoImage = document.querySelector('.logo-3d-image');
  if (logoImage) logoImage.hidden = !showIllustration;
  if (awsCanvas) awsCanvas.hidden = showIllustration;
  const awsImage = document.querySelector('.aws-3d-image');
  if (awsImage) awsImage.hidden = !showIllustration;
  const rocketHint = document.querySelector('.rocket-hint');
  if (rocketHint) rocketHint.hidden = showIllustration;
  const logoHint = document.querySelector('.particle-logo-media .particle-visual-hint');
  if (logoHint) logoHint.hidden = showIllustration;
  const awsHint = document.querySelector('.particle-aws-media .particle-visual-hint');
  if (awsHint) awsHint.hidden = showIllustration;
  for (const [canvasSelector, imageSelector] of [['#security-world-particles', '.security-lock-3d-image'], ['#security-standards-particles', '.ccss-3d-image']]) {
    const securityParticleCanvas = document.querySelector(canvasSelector);
    const securityImage = document.querySelector(imageSelector);
    if (securityParticleCanvas) securityParticleCanvas.hidden = showIllustration;
    if (securityImage) securityImage.hidden = !showIllustration;
  }
  document.querySelectorAll('.security-visual--world .particle-visual-hint, .security-visual--standards .particle-visual-hint').forEach(hint => { hint.hidden = showIllustration; });
  document.querySelectorAll('.visual-mode__option').forEach(button => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  try { localStorage.setItem('swaptrade-visual-mode', mode); } catch {}
}

document.querySelectorAll('.visual-mode__option').forEach(button => button.addEventListener('click', () => setVisualMode(button.dataset.mode)));
let initialVisualMode = 'particles';
try { initialVisualMode = localStorage.getItem('swaptrade-visual-mode') || 'particles'; } catch {}
setVisualMode(initialVisualMode);
