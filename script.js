

  // 타이핑 애니메이션 — 줄 단위로 순서대로, 깜빡이는 커서와 함께
  function typeLine(el, text, speed, onDone){
    el.classList.add('typing');
    let i = 0;
    (function step(){
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else {
        el.classList.remove('typing');
        if (onDone) onDone();
      }
    })();
  }
  function typeSequence(lines, speed){
    let idx = 0;
    (function next(){
      if (idx >= lines.length) return;
      const el = lines[idx];
      typeLine(el, el.dataset.text, speed, () => {
        idx++;
        setTimeout(next, 300);
      });
    })();
  }

  // 스크롤하면 요소들이 서서히 나타나는 페이드인 (+ 타이핑 요소는 함께 타이핑 시작)
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const wraps = entry.target.matches('.typewriter-wrap')
          ? [entry.target]
          : entry.target.querySelectorAll('.typewriter-wrap');
        wraps.forEach((wrap, wIdx) => {
          const lines = wrap.querySelectorAll('.tw-line');
          setTimeout(() => typeSequence(lines, 95), wIdx * 900);
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  // 서비스 소개 배너 슬라이드쇼 — 배너 추가하려면 이 배열에 항목만 더 넣으면 됩니다.
  const GLASS_SLIDES = [
    {
      img: 'assets/glass-bg.png',
      title: '웹 퍼블리싱 · 프론트엔드 개발',
      desc: '아임웹, 카페24, 워드프레스(엘리멘터) 기반 퍼블리싱과 React·TypeScript·Next.js·Vite 기반 개발을 함께 진행합니다. 완성 후 담당자가 직접 콘텐츠를 수정할 수 있도록 인수인계까지 포함합니다.'
    }
  ];
  const glassSlideshow = document.getElementById('glassSlideshow');
  GLASS_SLIDES.forEach((slide, i) => {
    const el = document.createElement('div');
    el.className = 'glass-slide' + (i === 0 ? ' active' : '');
    el.style.backgroundImage = `url('${slide.img}')`;
    el.innerHTML = `
      <div class="glass-overlay">
        <div class="glass-title">${slide.title}</div>
        <div class="glass-desc">${slide.desc}</div>
      </div>
    `;
    glassSlideshow.appendChild(el);
  });
  if (GLASS_SLIDES.length > 1) {
    let glassIdx = 0;
    const glassEls = glassSlideshow.querySelectorAll('.glass-slide');
    setInterval(() => {
      glassEls[glassIdx].classList.remove('active');
      glassIdx = (glassIdx + 1) % glassEls.length;
      glassEls[glassIdx].classList.add('active');
    }, 5000);
  }

  // 포트폴리오 데이터 — img: 카드 썸네일, popupImg: 클릭하면 뜨는 팝업 이미지(없으면 img 사용)
  const PORTFOLIO_ITEMS = [
    { name: '벨리안',       category: '쇼핑몰 개발',            img: 'assets/portfolio-belian.png', popupImg: 'assets/portfolio-belian-full.png' },
    { name: '주문집사',     category: '앱 UI/UX',              img: 'assets/thumb-orderbutler.png', popupImg: 'assets/portfolio-orderbutler.png' },
    { name: '도원',         category: '중장비 홈페이지 · WordPress', img: 'assets/thumb-dowon.png', popupImg: 'assets/portfolio-dowon.png' },
    { name: '이에프티',     category: '기업 홈페이지 · WordPress', img: 'assets/thumb-eft.png', popupImg: 'assets/portfolio-eft.png' },
    { name: '포웨이브',     category: '솔루션 홈페이지 · WordPress', img: 'assets/thumb-fowave.png', popupImg: 'assets/portfolio-fowave.png' },
    { name: '이사대학',     category: '서비스 홈페이지 · WordPress', img: 'assets/thumb-movinguniv.png', popupImg: 'assets/portfolio-movinguniv.png' },
    { name: 'B&M 컴퍼니',  category: '기업 홈페이지 · WordPress', img: 'assets/thumb-bnm.png', popupImg: 'assets/portfolio-bnm.png' },
  ];

  const track = document.getElementById('portfolioTrack');

  const startBookend = document.createElement('div');
  startBookend.className = 'gallery-bookend';
  startBookend.innerHTML = '<span>works</span><span>2026—</span>';
  track.appendChild(startBookend);

  const rotations = PORTFOLIO_ITEMS.map(() => (Math.random() * 2 - 1) * 16);
  const translations = PORTFOLIO_ITEMS.map(() => (Math.random() * 2 - 1) * 14);

  PORTFOLIO_ITEMS.forEach((item, i) => {
    const tile = document.createElement('div');
    tile.className = 'portfolio-tile';
    const tags = item.category.split(' · ');
    tile.innerHTML = `
      <div class="tile-header">
        <div class="tile-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="tile-title">${item.name}</div>
      </div>
      <div class="tile-image">
        <div class="tile-image-inner">
          <div class="tile-visual">
            ${item.img
              ? `<img src="${item.img}" alt="${item.name}">`
              : `<div class="tile-placeholder"></div>`}
          </div>
        </div>
        <div class="tile-link">explore</div>
      </div>
      <div class="tile-tags">${tags.map(t => `<span>#${t}</span>`).join('')}</div>
    `;
    tile.addEventListener('click', () => openLightbox(item));
    track.appendChild(tile);
  });

  const endBookend = document.createElement('div');
  endBookend.className = 'gallery-bookend';
  endBookend.innerHTML = '<span>plates</span><span>—2026</span>';
  track.appendChild(endBookend);

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  function openLightbox(item){
    const src = item.popupImg || item.img;
    if(src){
      lightboxImg.src = src;
      lightboxImg.style.display = 'block';
    } else {
      lightboxImg.style.display = 'none';
    }
    lightboxCaption.textContent = `${item.name} — ${item.category}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeLightbox(); });

  // 세로 휠 → 가로 스크롤 변환 + 드래그 스크롤 (끝까지 스크롤되면 놓아줌)
  const outer = document.getElementById('portfolioOuter');
  outer.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const atStart = outer.scrollLeft <= 0;
      const atEnd = outer.scrollLeft + outer.clientWidth >= outer.scrollWidth - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) {
        return; // 더 이상 갈 곳 없으면 기본 세로 스크롤을 그대로 통과시킴
      }
      e.preventDefault();
      outer.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  let isDown = false, startX = 0, scrollStart = 0;
  outer.addEventListener('mousedown', (e) => {
    isDown = true;
    outer.classList.add('dragging');
    startX = e.pageX;
    scrollStart = outer.scrollLeft;
  });
  window.addEventListener('mouseup', () => { isDown = false; outer.classList.remove('dragging'); });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    outer.scrollLeft = scrollStart - (e.pageX - startX);
  });

  // 원본 데모와 동일한 방식: 카드가 화면 왼쪽으로 빠져나갈 때(진행률 0.6 이후) 회전하며 확 튀어나가는 효과
  const rotations2 = PORTFOLIO_ITEMS.map(() => (Math.random() * 2 - 1) * 30);
  const translations2 = PORTFOLIO_ITEMS.map(() => (Math.random() * 2 - 1) * 90);

  function updateParallax(){
    const outerRect = outer.getBoundingClientRect();
    const tiles = document.querySelectorAll('.portfolio-tile');
    tiles.forEach((tile, i) => {
      const r = tile.getBoundingClientRect();
      const tileCenter = r.left + r.width / 2;
      const outerCenter = outerRect.left + outerRect.width / 2;
      const delta = (tileCenter - outerCenter) / window.innerWidth;
      const visual = tile.querySelector('.tile-visual');
      if (visual) visual.style.transform = `translateX(${-delta * 46}px)`;

      // 진행률(0=오른쪽에서 등장, 1=왼쪽으로 완전히 퇴장)
      const progress = Math.min(1, Math.max(0,
        (outerRect.right - r.left) / (outerRect.width + r.width)
      ));
      const scatter = progress > 0.6 ? (progress - 0.6) / 0.4 : 0;
      const rot = scatter * rotations2[i];
      const ty = scatter * translations2[i];
      tile.style.transform = `translateY(${ty}%) rotate(${rot}deg)`;
    });

    // 시작/끝 워드마크도 같은 원리로 위아래로 갈라지게
    const bookends = document.querySelectorAll('.gallery-bookend');
    bookends.forEach((b) => {
      const br = b.getBoundingClientRect();
      const bProgress = Math.min(1, Math.max(0,
        (outerRect.right - br.left) / (outerRect.width + br.width)
      ));
      const bScatter = bProgress > 0.35 ? (bProgress - 0.35) / 0.65 : 0;
      const spans = b.querySelectorAll('span');
      if (spans[0]) spans[0].style.transform = `translate(${-bScatter * 380}px, ${-bScatter * 300}px)`;
      if (spans[1]) spans[1].style.transform = `translate(${bScatter * 380}px, ${bScatter * 300}px)`;
    });
  }
  outer.addEventListener('scroll', () => requestAnimationFrame(updateParallax));
  window.addEventListener('resize', updateParallax);
  (function loop(){ updateParallax(); requestAnimationFrame(loop); })();
