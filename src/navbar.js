window.addEventListener("scroll", (event) => {
    let scroll = this.scrollY;
    document.getElementsByClassName("navbar-underlay")[0].style.opacity = Math.min((scroll/500)*100, 40) + "%";
});

