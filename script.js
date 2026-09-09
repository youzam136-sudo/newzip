
  // 포트폴리오 데이터 — img를 실제 이미지 URL로 채우면 자동으로 사진이 표시됩니다.
  const PORTFOLIO_ITEMS = [
    { name: '선두금속',     category: '기업 홈페이지 · WordPress', img: '' },
    { name: '주문집사',     category: '앱 UI/UX',              img: '' },
    { name: '벨리안',       category: '쇼핑몰 개발',            img: '' },
    { name: 'MZBK EMS',   category: '대시보드 · React',        img: '' },
    { name: 'ONETWO',     category: '이커머스 · React',        img: '' },
    { name: '공사록',       category: '앱 UI/UX · Figma',       img: '' },
    { name: '천안거미크레인', category: '산업 홈페이지 · WordPress', img: '' },
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
        <div class="tile-visual">
          ${item.img
            ? `<img src="${item.img}" alt="${item.name}">`
            : `<div class="tile-placeholder"></div>`}
        </div>
        <div class="tile-link">자세히</div>
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
    if(item.img){
      lightboxImg.src = item.img;
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

  // 세로 휠 → 가로 스크롤 변환 + 드래그 스크롤 (끝까지 스크롤되면 휠을 놓아줘서 다음 섹션으로 넘어감)
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

  // 스크롤할 때마다 카드 하나하나가 부드럽게 위아래로 움직이고, 넘버·제목 글씨가 위아래로 갈라지는 효과
  function updateParallax(){
    const outerRect = outer.getBoundingClientRect();
    const tiles = document.querySelectorAll('.portfolio-tile');
    tiles.forEach((tile, i) => {
      const r = tile.getBoundingClientRect();
      const tileCenter = r.left + r.width / 2;
      const outerCenter = outerRect.left + outerRect.width / 2;
      const delta = (tileCenter - outerCenter) / window.innerWidth;

      // 카드마다 위상을 다르게 줘서 개별적으로 물결치듯 움직이게
      const wave = Math.sin(outer.scrollLeft * 0.004 + i * 1.1) * 16;
      tile.style.transform = `translateY(${wave}px)`;

      const num = tile.querySelector('.tile-num');
      const title = tile.querySelector('.tile-title');
      if (num) num.style.transform = `translateY(${wave * 0.6}px)`;
      if (title) title.style.transform = `translateY(${-wave * 0.6}px)`;

      const visual = tile.querySelector('.tile-visual');
      if (visual) visual.style.transform = `translateX(${-delta * 46}px) translateY(${-wave * 0.3}px)`;
    });
  }
  outer.addEventListener('scroll', () => requestAnimationFrame(updateParallax));
  window.addEventListener('resize', updateParallax);
  updateParallax();
