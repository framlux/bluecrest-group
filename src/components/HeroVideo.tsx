"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const VIDEO_SRC = "/bluecrest-group-fractional-cfo-services-orange-county-ca.mp4";
const POSTER_SRC = "/images/hero-poster.jpg";

/**
 * The poster image is the LCP element on every device. The video mounts only on
 * desktop-width screens without reduced-motion, and never autoplays on mobile (T20).
 */
export default function HeroVideo() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShowVideo(wide && !calm);
  }, []);

  return (
    <>
      <Image
        src={POSTER_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-60 z-0"
      />
      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={POSTER_SRC}
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}
    </>
  );
}
