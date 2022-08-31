//#region CAROUSEL && TOGGLE
// In questa sezione viene gestita l'animazione e la gestione del carousel e del toggle

let main = document.querySelector("main");
let toggle = document.querySelector(".toggle");
let header = document.querySelector("header");

let menu = document.querySelector(".menu");

let carousel = document.querySelector(".carousel");
let slider = document.querySelector(".carousel__slider");
let prevButton = document.querySelector(".carousel__button--prev");
let nextButton = document.querySelector(".carousel__button--next");
let indexs = document.querySelectorAll(".carousel__index");

let isOpen = false;

let index = 0;
let target = 0;
let current = 0;
let ease = 0.04;
let timing = 0;

// interpolazione lineare: utilizzata per calcolare i vari punti a partire da (a,b)
const lerp = function (start, end, timing) {
    return start * (1 - timing) + end * timing;
};

// funzione che si occupa dell'animazione (smooth) del carousel
const animate = function (dir, width, index) {
    current = lerp(current, target, ease);
    current = parseFloat(parseFloat(current).toFixed(2));

    target = width * index;

    slider.style.transform = `translateX(-${Math.round(current)}px)`;
    timing = requestAnimationFrame(() => animate(dir, width, index));
};

// funzione che si occupa della gestione delle classi nei bottoni del carousel
const manageButtons = function () {
    if (index === 0) {
        prevButton.classList.add("carousel__button--disabled");
        nextButton.classList.remove("carousel__button--disabled");
    } else if (index === slider.children.length - 1) {
        nextButton.classList.add("carousel__button--disabled");
        prevButton.classList.remove("carousel__button--disabled");
    } else {
        nextButton.classList.remove("carousel__button--disabled");
        prevButton.classList.remove("carousel__button--disabled");
    }
};

// funzione che si occupa della gestione del click sui bottoni
const handleClick = function (event, dir) {
    if (isOpen) {
        const width = slider.children[0].getBoundingClientRect().width;
        indexs.forEach((node) => node.classList.remove("carousel__index--active"));
        cancelAnimationFrame(timing);

        if (dir === -1) {
            index === 0 ? (index = 0) : index--;
            manageButtons();
            indexs[index].classList.add("carousel__index--active");
            return (() => animate(dir, width, index))();
        } else {
            index === slider.children.length - 1 ? (index = slider.children.length - 1) : index++;
            manageButtons();
            indexs[index].classList.add("carousel__index--active");
            return (() => animate(dir, width, index))();
        }
    }
};

manageButtons();
prevButton.addEventListener("click", (event) => handleClick(event, (dir = -1)));
nextButton.addEventListener("click", (event) => handleClick(event, (dir = 1)));

// gestione dei piccoli dots accanto ai bottoni (gli ho chiamati indici perchè di base sono quelli 😁)
indexs.forEach((node) =>
    node.addEventListener("click", (event) => {
        cancelAnimationFrame(timing);
        indexs.forEach((node) => node.classList.remove("carousel__index--active"));
        const idx = [...indexs].indexOf(node);
        const dir = idx < index ? -1 : 1;
        const width = slider.children[0].getBoundingClientRect().width;
        index = idx;

        manageButtons();
        animate(dir, width, index);
        indexs[index].classList.add("carousel__index--active");
    })
);

// funzione che si occupa della navbar (quando apparire o scomparire)
main.addEventListener("wheel", (event) => {
    if (event.deltaY < 0 && !isOpen) header.classList.remove("header--hide");
    else if (!isOpen) header.classList.add("header--hide");
});

// gestione e animazione del bottone che apre il menu
toggle.addEventListener("click", (event) => {
    isOpen = !isOpen;

    if (isOpen) {
        toggle.classList.add("toggle--open");
        menu.classList.add("menu--visible");
        header.firstElementChild.classList.add("header__background--transparent");
    } else {
        toggle.classList.remove("toggle--open");
        menu.classList.add("menu--invisible");
        setTimeout(() => {
            menu.classList.remove("menu--visible");
            menu.classList.remove("menu--invisible");
            header.firstElementChild.classList.remove("header__background--transparent");
        }, 500);
    }
});

//#endregion

//#region MAIN
// In questa sezione viene gestita l'animazione e la gestione dell'intera pagina

let mainCurrent = 0;
let mainTarget = 0;
let mainEase = 0.05;

let windowWidth = 0;
let containerHeight = 0;

let container = document.querySelector(".container");
container.style.transform = `translateY(${0}px)`; /* default position */

const init = function () {
    windowWidth = window.innerWidth;
    containerHeight = container.getBoundingClientRect().height;

    document.body.style.height = `${containerHeight}px`;
    handleScroll(), 100;
};

const handleScroll = function () {
    mainCurrent = lerp(mainCurrent, mainTarget, mainEase);
    mainCurrent = parseFloat(mainCurrent.toFixed(2));
    mainTarget = window.scrollY;

    container.style.transform = `translateY(${-mainCurrent}px)`;
    requestAnimationFrame(handleScroll);
};

init();

//#endregion

/**
 * TODO:
 * - [x] - Gestire il toggle
 * - [x] - Animare il toggle
 * - [x] - Gestire il Carousel
 * - [x] - Animare il Carousel
 * - [ ] - Resettare e Reanimare il Carousel al resize della finestra (!important)
 * - [x] - Gestire i bottoni e gli indici
 * - [x] - Animare i bottoni e gli indici
 * - [ ] - Dividere il codice in più file (remoduling)
 * - [ ] - ...Altro
 */
