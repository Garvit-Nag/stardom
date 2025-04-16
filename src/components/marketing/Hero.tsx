"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatedTextProps, MediaItem } from "@/types/MediaTypes";
import {
  HERO_MEDIA_ITEMS,
  HERO_SLIDE_DURATION,
  HERO_TRANSITION_DURATION,
} from "@/lib/constants/MediaConstants";
import { fadeInUpVariants } from "@/lib/constants/AnimationConstants";
import { BasicCompanyInfo } from "@/lib/constants/CompanyInfo";
import { Link } from "next-view-transitions";

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  delay = 2,
  className = "",
}) => (
  <motion.div
    variants={fadeInUpVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 1, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const BackgroundMedia: React.FC<{
  item: MediaItem;
  isActive: boolean;
  isNext: boolean;
}> = ({ item, isActive, isNext }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);

  // Only load the media when it's active or about to be active
  useEffect(() => {
    if (isActive || isNext) {
      setIsLoaded(true);
    }
  }, [isActive, isNext]);

  const className = `absolute inset-0 w-full h-full transition-all duration-1000 ${
    isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
  }`;

  if (item.type === "video" && isLoaded) {
    return (
      <div className={className} ref={mediaRef}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full"
          preload="metadata"
          poster={item.poster || ""}
          onLoadedData={() => {
            if (isActive) {
              // If this is the active slide, play the video
              const videoElement = mediaRef.current?.querySelector("video");
              if (videoElement) {
                videoElement
                  .play()
                  .catch((e) => console.error("Video play failed:", e));
              }
            }
          }}
        >
          {item.webmSrc && <source src={item.webmSrc} type="video/webm" />}
          <source src={item.src} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (item.type === "image" && isLoaded) {
    return (
      <div className={className} ref={mediaRef}>
        <img
          src={item.src}
          alt={item.alt || ""}
          className="object-cover w-full h-full"
          loading={isActive ? "eager" : "lazy"}
        />
      </div>
    );
  }

  return <div className={className} ref={mediaRef} />;
};

const BackgroundSlideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setIsTransitioning] = useState(false);

  const getNextIndex = (index: number) => (index + 1) % HERO_MEDIA_ITEMS.length;

  useEffect(() => {
    const slideTimer = setTimeout(() => {
      setIsTransitioning(true);

      const transitionTimer = setTimeout(() => {
        setCurrentIndex(getNextIndex);
        setIsTransitioning(false);
      }, HERO_TRANSITION_DURATION);

      return () => clearTimeout(transitionTimer);
    }, HERO_SLIDE_DURATION);

    return () => clearTimeout(slideTimer);
  }, [currentIndex]);

  return (
    <div className="absolute inset-0 w-full h-full">
      {HERO_MEDIA_ITEMS.map((item, index) => (
        <BackgroundMedia
          key={item.src}
          item={item}
          isActive={index === currentIndex}
          isNext={index === getNextIndex(currentIndex)}
        />
      ))}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"
        aria-hidden="true"
      />
    </div>
  );
};

const HeroSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const buttonBaseClass = useMemo(
    () => "min-w-[240px] h-14 text-lg tracking-wide",
    [],
  );

  useEffect(() => {
    // Set loading to false once critical content is loaded
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden font-sans">
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
          <span className="text-white">Loading...</span>
        </div>
      )}

      <BackgroundSlideshow />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 px-6">
        {/* Brand Column */}
        <div className="text-center lg:text-left">
          <AnimatedText className="mb-4">
            <span className="text-primary font-serif text-sm tracking-[0.3em] uppercase inline-block border border-primary/30 rounded px-4 py-2">
              Since {BasicCompanyInfo.established}
            </span>
          </AnimatedText>

          <AnimatedText delay={0.2}>
            <h1 className="text-6xl lg:text-7xl tracking-tight mb-4 font-extralight">
              STARDOM
            </h1>
            <div className="h-px w-24 bg-primary my-6 mx-auto lg:mx-0" />
            <span className="text-xl text-white/80 font-serif italic">by</span>
            <p className="text-2xl text-white/90 font-serif mt-2">
              Ashoka Furniture Udyog
            </p>
          </AnimatedText>

          <AnimatedText delay={0.3} className="mt-6">
            <p className="text-lg text-primary/90 font-serif italic tracking-wide">
              Where Excellence Takes a Seat
            </p>
          </AnimatedText>
        </div>

        {/* Content Column */}
        <div className="text-center lg:text-left lg:border-l lg:border-white/20 lg:pl-16">
          <AnimatedText delay={0.4}>
            <h2 className="text-3xl lg:text-4xl font-light leading-tight mb-8">
              Elevate Your Workspace with{" "}
              <span className="text-primary font-serif italic">Timeless</span>{" "}
              Design
            </h2>
          </AnimatedText>

          <AnimatedText
            delay={0.6}
            className="text-white/80 text-lg mb-12 leading-relaxed"
          >
            Experience the fusion of artisanal craftsmanship and contemporary
            luxury in every piece. Creating distinguished office environments
            for those who demand excellence.
          </AnimatedText>

          <AnimatedText delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Button
                size="lg"
                className={`${buttonBaseClass} bg-primary hover:bg-primary/90`}
                asChild
              >
                <Link href="/products">View Collection</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`${buttonBaseClass} border-2 border-white/20 hover:border-white hover:bg-white/10 text-foreground-700 hover:text-white`}
                asChild
              >
                <Link href="/contact">Book Consultation</Link>
              </Button>
            </div>
          </AnimatedText>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
