"use client";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import carousel1 from "/public/assets/carousel/carousel1.jpg";
import carousel2 from "/public/assets/carousel/carousel2.jpg";
import carousel3 from "/public/assets/carousel/carousel3.jpg";

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slides, setSlides] = useState(0);

  // Callback to update selected index
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Initialize dots count
  useEffect(() => {
    if (emblaApi) {
      setSlides(emblaApi.scrollSnapList().length);
      emblaApi.on("select", onSelect);
    }
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Embla Carousel Container */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {[carousel1, carousel2, carousel3].map((image, index) => (
            <div key={index} className="embla__slide flex-shrink-0 w-full">
              <Image
                src={image}
                className="w-full h-[700px] object-cover"
                alt={`Slide ${index + 1}`}
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={() => emblaApi && emblaApi.scrollPrev()}
      >
        &#10094;
      </button>

      {/* Right Arrow */}
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={() => emblaApi && emblaApi.scrollNext()}
      >
        &#10095;
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: slides }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              selectedIndex === index ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}
