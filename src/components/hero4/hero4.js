"use client";
import React from "react";
import Link from "next/link";
import { Slide } from "react-awesome-reveal";

const Hero4 = (props) => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <section
      className="hero hero--style5"
      style={{ backgroundImage: `url(${"/assets/update/home4-hero-bg1.jpg"})` }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-xl-6 col-lg-8 mb-30">
            <div className="hero__content">
              <Slide direction="up" triggerOnce={"false"} duration={1200}>
                <div>
                  <span
                    className="hero__title hero__title--small wow animate__fadeInUp animate__animated"
                    data-wow-duration="1200ms"
                    data-wow-delay="200ms"
                  >
                    <i className="fa-solid fa-heart btn__icon"></i>We Beleve
                    That
                  </span>
                </div>
              </Slide>
              <Slide direction="up" triggerOnce={"false"} duration={1200}>
                <div>
                  <h1
                    className="hero__title hero__title--big text-white wow animate__fadeInUp animate__animated"
                    data-wow-duration="1200ms"
                    data-wow-delay="300ms"
                  >
                    Your QR Code for immediate security
                  </h1>
                </div>
              </Slide>
              <Slide direction="up" triggerOnce={"false"} duration={1200}>
                <div>
                  <p
                    className="hero__text text-white wow animate__fadeInUp animate__animated"
                    data-wow-duration="1200ms"
                    data-wow-delay="400ms"
                  >
                    <b>In an emergency, every second is precious.</b> The{" "}
                    <b>Scan To Save (SPS)</b> QR Code allows you to instantly
                    share your vital information with rescuers, doctors and your
                    loved ones.
                  </p>
                </div>
              </Slide>
              <Slide direction="up" triggerOnce={"false"} duration={1200}>
                <div>
                  <Link
                    onClick={ClickHandler}
                    className="btn btn--styleOne btn--primary it-btn wow animate__fadeInUp animate__animated"
                    data-wow-duration="1200ms"
                    data-wow-delay="500ms"
                    href="/donation-listing"
                  >
                    <span className="btn__text">Get you SPS Qr Code </span>
                    <i className="fa-solid fa-qrcode btn__icon"></i>
                    <span className="it-btn__inner">
                      <span className="it-btn__blobs">
                        <span className="it-btn__blob"></span>
                        <span className="it-btn__blob"></span>
                        <span className="it-btn__blob"></span>
                        <span className="it-btn__blob"></span>
                      </span>
                    </span>
                    <svg
                      className="it-btn__animation"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                    >
                      <defs>
                        <filter>
                          <feGaussianBlur
                            in="SourceGraphic"
                            result="blur"
                            stdDeviation="10"
                          ></feGaussianBlur>
                          <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7"
                            result="goo"
                          ></feColorMatrix>
                          <feBlend
                            in2="goo"
                            in="SourceGraphic"
                            result="mix"
                          ></feBlend>
                        </filter>
                      </defs>
                    </svg>
                  </Link>
                </div>
              </Slide>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero4;
