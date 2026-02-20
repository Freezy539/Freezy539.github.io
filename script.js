// Vahelehtede näitamine
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// Settings: taustavärvi muutmine
function changeBgColor(color) {
    document.body.style.backgroundColor = color;
}
