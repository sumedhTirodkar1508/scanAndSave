"use client";
import React from "react";
import Link from "next/link";
import CountUp from "react-countup";
import shape1 from "/public/assets/shapes/love-shape3.svg";
import shape2 from "/public/assets/shapes/love-shape4.svg";
import shape3 from "/public/assets/shapes/love-shape5.svg";

import icon1 from "/public/assets/icons/mission-icon1.svg";
import icon2 from "/public/assets/icons/mission-icon2.svg";
import icon3 from "/public/assets/icons/mission-icon3.svg";
import icon4 from "/public/assets/icons/mission-icon4.svg";

import FeaturesSection3 from "@/components/FeaturesSection3/FeaturesSection3";
import Image from "next/image";

const About4 = () => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <section className="about">
      <Image
        className="about__shape about__shape--one"
        src={shape1}
        alt="Gainioz Shape"
      />
      <Image
        className="about__shape about__shape--two"
        src={shape2}
        alt="Gainioz Shape"
      />
      <Image
        className="about__shape about__shape--three"
        src={shape3}
        alt="Gainioz Shape"
      />
      <div className="aboutArea aboutArea--padding position-relative">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-30">
              <div className="aboutContent">
                <div className="sectionTitle mb-20">
                  <span className="sectionTitle__small">
                    <i className="fa-solid fa-heart btn__icon"></i>
                    about foundation
                  </span>
                  <h2 className="sectionTitle__big">
                    what have we done with your help
                  </h2>
                </div>
                <p className="aboutContent__text">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which look even
                  slightly believable. If you are going to use a passage Lorem
                  of Lorem Ipsum, you need to be sure there anything
                  embarrassing hidden in the middle There are many variations of
                  passages
                </p>
                <span className="aboutContent__quote">
                  join our Action and everyone can help
                </span>
                <Link
                  onClick={ClickHandler}
                  className="btn btn--styleOne btn--secondary it-btn"
                  href="/donation-listing"
                >
                  <span className="btn__text">donate now</span>
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
            </div>

            <div className="col-lg-6">
              <div className="row g-4">
                <div className="col-lg-6 col-md-6">
                  <div className="missionBlock bgSecondary">
                    <div className="missionBlock__icon">
                      <Image src={icon1} alt="Gainioz Mission" />
                    </div>
                    <div className="missionBlock__content">
                      <span className="missionBlock__counter">
                        <CountUp end={1600} enableScrollSpy />
                      </span>
                      <p className="missionBlock__title">SOLAR PANEL</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="missionBlock bgPrimary">
                    <div className="missionBlock__icon">
                      <Image src={icon2} alt="Gainioz Mission" />
                    </div>
                    <div className="missionBlock__content">
                      <span className="missionBlock__counter">
                        <CountUp end={289} enableScrollSpy />
                      </span>
                      <p className="missionBlock__title">Build HOme</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="missionBlock bgPrimary">
                    <div className="missionBlock__icon">
                      <Image src={icon3} alt="Gainioz Mission" />
                    </div>
                    <div className="missionBlock__content">
                      <span className="missionBlock__counter">
                        <CountUp end={16} enableScrollSpy />
                        <span>k</span>
                      </span>
                      <p className="missionBlock__title">Give Job</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="missionBlock bgSecondary">
                    <div className="missionBlock__icon">
                      <Image src={icon4} alt="Gainioz Mission" />
                    </div>
                    <div className="missionBlock__content">
                      <span className="missionBlock__counter">
                        <CountUp end={24} enableScrollSpy />
                        <span>mln</span>
                      </span>
                      <p className="missionBlock__title">Pure water</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FeaturesSection3 />
    </section>
  );
};

export default About4;
