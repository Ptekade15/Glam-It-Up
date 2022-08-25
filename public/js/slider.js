
var swiper = new Swiper(".home-slider", {
    direction: "horizontal",
    spaceBetween: 20,
    effect: "fade",
    loop:true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    centeredSlides: true,
    autoplay: {
      delay: 1800,
      disableOnInteraction: true,
    },
  });