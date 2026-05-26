/*
  OutDoorSauna veebileht

  FAIL: script.js
  SIIN MUUDAD: keelevahetust, vaadete avamist ja vormi käitumist.

  Kõige tähtsam:
  - translations objekti sees on kõik eesti ja inglise tekstid.
  - Kui HTML-is on data-i18n="hero_title", siis siin peab olema hero_title tekst nii et kui keelt vahetad, muutub see tekst.
  - showPage('products') avab kindla vaate.
  - handleForm() paneb vormi info e-kirja sisse.
*/

// Avab ühe vaate ja peidab teised. Näiteks showPage('products') avab Valiku vaate.
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active', b.dataset.page===id));
  document.getElementById('mainNav').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}
// Avab/sulgeb mobiilis menüü.
function toggleMenu(){document.getElementById('mainNav').classList.toggle('open')}
// Vahetab kogu lehe keele data-i18n väärtuste järgi.
function setLanguage(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n');
    if(translations[lang][key]) el.textContent=translations[lang][key];
  });
  document.getElementById('langEt').classList.toggle('active', lang==='et');
  document.getElementById('langEn').classList.toggle('active', lang==='en');
  document.documentElement.lang=lang;
}
// Taotluse vorm. Praegu teeb valmis e-kirja. Siia saad hiljem panna päris backend/serveri ühenduse.
function handleForm(e){
  e.preventDefault();
  const data=new FormData(e.target);
  const body=[
    'Nimi: '+(data.get('name')||''),
    'Telefon: '+(data.get('phone')||''),
    'E-mail: '+(data.get('email')||''),
    'Soovitud saun: '+(data.get('model')||''),
    'Asukoht: '+(data.get('location')||''),
    '',
    'Kirjeldus:',
    data.get('message')||''
  ].join('\n');
  window.location.href='mailto:info@outdoorsauna.ee?subject=Sauna pakkumise taotlus&body='+encodeURIComponent(body);
}

function initProductCarousels(){
  const lightbox=document.getElementById('imageLightbox');
  const lightboxImg=lightbox ? lightbox.querySelector('img') : null;
  const closeBtn=lightbox ? lightbox.querySelector('.lightbox-close') : null;

  function openLightbox(src,alt){
    if(!lightbox || !lightboxImg) return;
    lightboxImg.src=src;
    lightboxImg.alt=alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('lightbox-active');
  }

  function closeLightbox(){
    if(!lightbox || !lightboxImg) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('lightbox-active');
    lightboxImg.src='';
  }

  document.querySelectorAll('.product-carousel').forEach(carousel=>{
    const images=(carousel.dataset.images || '').split('|').filter(Boolean);
    const img=carousel.querySelector('img');
    const prev=carousel.querySelector('.prev');
    const next=carousel.querySelector('.next');
    let index=0;

    function showImage(nextIndex){
      if(!images.length || !img) return;
      index=(nextIndex + images.length) % images.length;
      img.src=images[index];
    }

    prev.addEventListener('click',event=>{
      event.stopPropagation();
      showImage(index - 1);
    });

    next.addEventListener('click',event=>{
      event.stopPropagation();
      showImage(index + 1);
    });

    img.addEventListener('click',()=>openLightbox(img.src, carousel.dataset.alt || img.alt));
  });

  if(lightbox){
    lightbox.addEventListener('click',event=>{
      if(event.target===lightbox) closeLightbox();
    });
  }

  if(closeBtn) closeBtn.addEventListener('click',closeLightbox);

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape') closeLightbox();
  });
}

document.addEventListener('DOMContentLoaded',initProductCarousels);
