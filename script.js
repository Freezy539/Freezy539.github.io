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
// Avab/sulgeb mobiilis menüü
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
// Google Sheetsi + Gmaili ühendus.
// 1) Loo Google Apps Script projekt ja kleebi sinna failist google-apps-script.js kood.
// 2) Deploy > New deployment > Web app.
// 3) Pane saadud Web App URL siia jutumärkide vahele.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzXcYdaGQCDae7W57zsKr3HXslnAhw23spQjh_e_r8roQI7pBmum5ea_lxfkj-AnL4P/exec";

// Varuvariant, kui Google Scripti URL on veel lisamata.
const FALLBACK_EMAIL = "kethontaevere1@gmail.com";

function setFormStatus(message, type){
  const status = document.getElementById('formStatus');
  if(!status) return;
  status.textContent = message || '';
  status.className = 'form-status' + (type ? ' ' + type : '');
}

function setSubmitState(button, text, disabled){
  if(!button) return;
  button.disabled = !!disabled;
  if(text) button.textContent = text;
}

function formDataToObject(form){
  const data = new FormData(form);
  return {
    createdAt: new Date().toISOString(),
    name: (data.get('name') || '').trim(),
    phone: (data.get('phone') || '').trim(),
    email: (data.get('email') || '').trim(),
    model: (data.get('model') || '').trim(),
    message: (data.get('message') || '').trim(),
    source: window.location.href
  };
}

function buildMailto(payload){
  const body = [
    'Nimi: ' + payload.name,
    'Telefon: ' + payload.phone,
    'E-mail: ' + payload.email,
    'Soovitud saun: ' + payload.model,
    '',
    'Kirjeldus:',
    payload.message
  ].join('\n');

  return 'mailto:' + FALLBACK_EMAIL + '?subject=' + encodeURIComponent('Sauna pakkumise taotlus') + '&body=' + encodeURIComponent(body);
}

// Taotluse vorm.
// Kui GOOGLE_SCRIPT_URL on lisatud, saadab andmed Google Sheetsi ja Gmailile.
// Kui URL on tühi, avab varuvariandina e-kirja.
async function handleForm(e){
  e.preventDefault();
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : 'Saada taotlus';
  const payload = formDataToObject(form);

  if(!GOOGLE_SCRIPT_URL){
    setFormStatus('E-kiri avaneb. Päringu saatmiseks vajuta seal Send/Saada.', 'info');
    window.location.href = buildMailto(payload);
    return;
  }

  try{
    setSubmitState(submitButton, 'Palun oota...', true);
    setFormStatus('', '');

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      body: JSON.stringify(payload)
    });

    form.reset();
    setSubmitState(submitButton, 'Saadetud ✓', true);
    setFormStatus('Aitäh! Võtame teiega ühendust esimesel võimalusel.', 'success');

    setTimeout(function(){
      setSubmitState(submitButton, originalButtonText, false);
      setFormStatus('', '');
    }, 6000);
  }catch(error){
    console.error(error);
    setSubmitState(submitButton, originalButtonText, false);
    setFormStatus('Vormi automaatne saatmine ei õnnestunud. Ava e-kiri ja vajuta Send/Saada.', 'error');
    window.location.href = buildMailto(payload);
  }
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
