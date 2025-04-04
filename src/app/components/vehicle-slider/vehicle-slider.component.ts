// vehicle-slider.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-vehicle-slider',
  imports: [CommonModule],
  template: `
    <div #swiperContainer class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" *ngFor="let image of images">
          <div class="image-container">
            <img class="img-style" [src]="image" loading="lazy" alt="image" />
          </div>
        </div>
      </div>
    </div>
  `,
styles: [`
  .swiper-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .swiper-wrapper {
    height: 100%;
  }
  .swiper-slide {
    
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .image-container {
    aspect-ratio: 1;
    position: relative;
    width: 100%;
    height: 100%;
  }
  .img-style {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .image-container::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/assets/images/sliderW.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.5;
    pointer-events: none;
    z-index: 1;
  }

  /* Estilos para móvil */
  @media (max-width: 768px) {
    .swiper-slide {
      aspect-ratio: 1; /* Esto hace que el slide sea cuadrado */
      width: 100%;
    }
    .image-container {
      width: 100%;
      height: 100%;
      aspect-ratio: 1; /* Esto hace que el contenedor sea cuadrado */
    }
    .img-style {
      width: 100%;
      height: 100%;
      object-fit: cover; /* Esto asegura que la imagen cubra el espacio */
    }
  }
`]
})
export class VehicleSliderComponent implements OnInit, AfterViewInit {
  @Input() images: string[] = [];
  @ViewChild('swiperContainer', { static: false, read: ElementRef }) swiperContainer!: ElementRef;
  swiper: Swiper | null = null;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeSwiper();
    }, 500);
  }

  initializeSwiper() {
    if (!this.swiperContainer || !this.swiperContainer.nativeElement) {
      console.warn('Swiper container not found');
      return;
    }

    const container = this.swiperContainer.nativeElement;
    this.swiper = new Swiper(container, {
      slidesPerView: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: container.querySelector('.swiper-button-next'),
        prevEl: container.querySelector('.swiper-button-prev'),
      },
      loop: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      pagination: {
        el: container.querySelector('.swiper-pagination'),
        clickable: true,
        dynamicBullets: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
      },
      grabCursor: true,
      centeredSlides: true,
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      allowTouchMove: true,
      threshold: 5,
      touchMoveStopPropagation: true,
      touchReleaseOnEdges: true,
      touchStartPreventDefault: true,
      touchStartForcePreventDefault: false,
      touchEventsTarget: 'wrapper',
      preventClicks: true,
      preventClicksPropagation: true,
      slideToClickedSlide: false,
      watchOverflow: true,
      roundLengths: false,
      virtualTranslate: false,
      effect: 'slide',
      slideActiveClass: 'swiper-slide-active',
      slideVisibleClass: 'swiper-slide-visible',
      slideNextClass: 'swiper-slide-next',
      slidePrevClass: 'swiper-slide-prev',
      wrapperClass: 'swiper-wrapper',
      slideClass: 'swiper-slide',
      containerModifierClass: 'swiper-',
    });
  }
}