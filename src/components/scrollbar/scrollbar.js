"use client";
import React from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

const Scrollbar = () => {
  return (
    <ul className="smothscroll">
      <li>
        <Link href="#__next">
          <ArrowUp />
        </Link>
      </li>
    </ul>
  );
};

export default Scrollbar;
