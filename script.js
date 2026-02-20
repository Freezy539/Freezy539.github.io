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

// Üllatus Adrianale
function adrianaSurprise() {
    alert("Tere, Adriana! 🎉 Sul on üllatus Freezy Mini Games lehel! 🕹️");
}

// Veendu, et nuppu leiab ja lisame event listeneri
document.addEventListener('DOMContentLoaded', function() {
    const adrianBtn = document.getElementById('adrianButton');
    if(adrianBtn){
        adrianBtn.addEventListener('click', adrianaSurprise);
    }
});
