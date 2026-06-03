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
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby5G-CFGKjiXDlYjNjxfvD67pkx0SMmEkFWZfkjSfK8SxG0SaNwOQHdfXQAu5ppXZOk/exec";

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
    transport: (data.get('transport') || '').trim(),
    location: (data.get('location') || '').trim(),
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

    showToast('✓ Päring edukalt saadetud');

    form.reset();
    setSubmitState(submitButton, 'Saadetud ✓', true);
    setFormStatus('Aitäh! Võtame teiega ühendust esimesel võimalusel.', 'success');
    locationField.style.display = 'none';
    locationInput.required = false;
    locationInput.value = '';

    ['name', 'phone', 'email', 'model', 'transport', 'location', 'message'].forEach(fieldName => {
    localStorage.removeItem('quote_' + fieldName);
    });

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

const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
const lightboxThumbs = lightbox ? lightbox.querySelector('.lightbox-thumbs') : null;

let lightboxImages = [];
let lightboxIndex = 0;
let lightboxAlt = '';

function updateLightbox(){
  if(!lightboxImg || !lightboxImages.length) return;

  lightboxImg.src = lightboxImages[lightboxIndex];
  lightboxImg.alt = lightboxAlt || '';

  if(lightboxThumbs){
    lightboxThumbs.innerHTML = '';

    lightboxImages.forEach((src, i)=>{
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.alt = lightboxAlt || '';
      thumb.classList.toggle('active', i === lightboxIndex);

      thumb.addEventListener('click', ()=>{
        lightboxIndex = i;
        updateLightbox();
      });

      lightboxThumbs.appendChild(thumb);
    });
  }
}

function openLightbox(images, startIndex, alt){
  if(!lightbox || !lightboxImg) return;

  lightboxImages = images;
  lightboxIndex = startIndex || 0;
  lightboxAlt = alt || '';

  updateLightbox();

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('lightbox-active');
}

function lightboxShow(nextIndex){
  if(!lightboxImages.length) return;
  lightboxIndex = (nextIndex + lightboxImages.length) % lightboxImages.length;
  updateLightbox();
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

    if(lightboxPrev){
  lightboxPrev.addEventListener('click', event=>{
    event.stopPropagation();
    lightboxShow(lightboxIndex - 1);
  });
}

if(lightboxNext){
  lightboxNext.addEventListener('click', event=>{
    event.stopPropagation();
    lightboxShow(lightboxIndex + 1);
  });
}

img.addEventListener('click',()=>{
  openLightbox(images, index, carousel.dataset.alt || img.alt);
});

});



  document.querySelectorAll('.gallery-grid figure img').forEach(galleryImg=>{
    galleryImg.style.cursor='zoom-in';
    galleryImg.addEventListener('click',()=>{
      openLightbox([galleryImg.src], 0, galleryImg.alt || '');
    });
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

const transportSelect = document.getElementById('transport');
const locationField = document.getElementById('locationField');
const locationInput = document.getElementById('location');

transportSelect.addEventListener('change', () => {
  if (transportSelect.value === 'Jah' || transportSelect.value === 'Pole kindel') {
    locationField.style.display = 'block';
    locationInput.required = true;
  } else {
    locationField.style.display = 'none';
    locationInput.required = false;
    locationInput.value = '';
  }
});

const quoteForm = document.querySelector('.quote-form');

if (quoteForm) {
  const fieldsToSave = ['name', 'phone', 'email', 'model', 'transport', 'location', 'message'];

  fieldsToSave.forEach(fieldName => {
    const field = quoteForm.querySelector(`[name="${fieldName}"]`);

    if (!field) return;

    const savedValue = localStorage.getItem('quote_' + fieldName);
    if (savedValue) field.value = savedValue;

    field.addEventListener('input', () => {
      localStorage.setItem('quote_' + fieldName, field.value);
    });

    field.addEventListener('change', () => {
      localStorage.setItem('quote_' + fieldName, field.value);
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

if (transportSelect.value === 'Jah' || transportSelect.value === 'Pole kindel') {
  locationField.style.display = 'block';
  locationInput.required = true;
}
