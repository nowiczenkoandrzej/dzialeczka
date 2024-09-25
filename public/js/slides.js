let slideIndex = 1;
let slideIndexSauna = 1;
showSlides(slideIndex);
showSlidesSauna(slideIndexSauna);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function plusSlidesSauna(n) {
    showSlidesSauna(slideIndexSauna += n);
}

// Thumbnail image controls
function currentSlideSauna(n) {
    showSlidesSauna(slideIndexSauna = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}

function showSlidesSauna(n) {
    let i;
    let slides = document.getElementsByClassName("mySlidesSauna");
    let dots = document.getElementsByClassName("dotSauna");
    if (n > slides.length) {slideIndexSauna = 1}
    if (n < 1) {slideIndexSauna = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndexSauna-1].style.display = "block";
    dots[slideIndexSauna-1].className += " active";
}