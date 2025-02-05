"use client";
import React from "react";
import DonationListSection2 from "@/components/DonationListSection2/DonationListSection2";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { Slide } from "react-awesome-reveal";
import map from "/public/assets/shapes/map.png";
import icon1 from "/public/assets/icons/icon1.svg";
import icon2 from "/public/assets/icons/icon2.svg";
import icon3 from "/public/assets/icons/icon3.svg";
import Image from "next/image";

const Features = [
  {
    title: "healthy Food",
    des: "We help local nonprofits access the funding, tools, training,",
    icon: icon1,
    width: "80%",
    duration: 1000,
  },
  {
    title: "Dedicated",
    des: "We help local nonprofits access the funding, tools, training,",
    icon: icon2,
    width: "94%",
    duration: 1200,
  },
  {
    title: "Strong Team",
    des: "We help local nonprofits access the funding, tools, training,",
    icon: icon3,
    width: "70%",
    duration: 1400,
  },
];

const FeaturesSection3 = (props) => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <div className="featureArea pt-70">
      <div className="featureArea__map">
        <Image src={map} alt="Gainioz Map" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="keyFeatureBox mb-30">
              <div className="row">
                {Features.map((features, fitem) => (
                  <div className="col-lg-4 wow animate__fadeInLeft" key={fitem}>
                    <Slide
                      direction="left"
                      triggerOnce={"false"}
                      duration={features.duration}
                    >
                      <div>
                        <div className="keyFeatureBlock mb-30">
                          <div className="keyFeatureBlock__left">
                            <span className="keyFeatureBlock__icon">
                              <Image
                                src={features.icon}
                                alt="Gainioz Feature_Icon"
                              />
                            </span>
                          </div>
                          <div className="keyFeatureBlock__content">
                            <h3 className="keyFeatureBlock__heading">
                              <Link
                                onClick={ClickHandler}
                                className="keyFeatureBlock__heading__link"
                                href="/services"
                              >
                                {features.title}
                              </Link>
                            </h3>
                            <p className="keyFeatureBlock__text">
                              {features.des}
                            </p>
                          </div>
                          <div
                            className="keyFeatureBlock__skill skill-bar"
                            style={{ width: features.width }}
                          >
                            <span className="keyFeatureBlock__skill__bar"></span>
                          </div>
                        </div>
                      </div>
                    </Slide>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="donnerArea pt-70 pb-95">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="donnerAreaContent text-center mb-30">
                <Slide direction="up" triggerOnce={"false"} duration={1200}>
                  <div>
                    <h2
                      className="donnerAreaContent__bigTitle wow animate__fadeInUp"
                      data-wow-duration="1200ms"
                      data-wow-delay="200ms"
                    >
                      <span className="donnerAreaContent__bigTitle__number">
                        250
                      </span>
                      <span className="donnerAreaContent__bigTitle__text">
                        mln
                      </span>
                    </h2>
                  </div>
                </Slide>
                <Slide direction="up" triggerOnce={"false"} duration={1400}>
                  <div>
                    <h3
                      className="donnerAreaContent__heading text-uppercase wow animate__fadeInUp"
                      data-wow-duration="1200ms"
                      data-wow-delay="300ms"
                    >
                      People Live with a disability
                    </h3>
                  </div>
                </Slide>
                <Slide direction="up" triggerOnce={"false"} duration={1600}>
                  <div>
                    <Link
                      onClick={ClickHandler}
                      className="btn btn--styleOne btn--black it-btn wow animate__fadeInUp"
                      data-wow-duration="1200ms"
                      data-wow-delay="400ms"
                      href="/donation-listing"
                    >
                      <span className="btn__text">BECOME A VOLEENTEER</span>
                      <i className="fa-solid fa-heart btn__icon"></i>
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
      </div>
      <DonationListSection2 />
    </div>
  );
};

export default FeaturesSection3;
