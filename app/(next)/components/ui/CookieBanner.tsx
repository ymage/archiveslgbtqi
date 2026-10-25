"use client";
import React, { useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";

export default function CookieBanner() {
  const [isFirstVisit, setIsFirstVisit] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  // localStorage is only readable after mount, so state must be set in the effect
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const firstVisit = localStorage.getItem("firstVisit");

    if (!firstVisit) {
      localStorage.setItem("firstVisit", "true");
      setIsFirstVisit(true);
      setIsVisible(true);
    } else {
      setIsFirstVisit(false);
      setIsVisible(false);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleClose = () => {
    setIsVisible(false);
    setIsFirstVisit(false);
  };

  return (
    <>
      {isFirstVisit && isVisible && (
        <div
          className={clsx(
            "sticky bottom-0 left-0 right-0 z-40 flex h-auto items-center justify-between bg-white p-[1rem] transition-transform duration-300 ease-tamisee",
            isVisible ? "translate-y-[0%]" : "translate-y-[100%]",
          )}
        >
          <div className="flex flex-col items-center justify-between gap-[1rem] font-jetbrains text-[.8rem] leading-[1.2rem] tracking-wider lg:flex-row">
            <p className="lg:max-w-[75%]">
              En utilisant ce site, vous acceptez notre Politique de
              Confidentialité mise à jour et notre Politique en matière de
              cookies. Pour modifier vos préférences ou retirer votre
              consentement, vous devez mettre à jour vos Préférences de cookies.
              En savoir plus sur nos
              <Link
                href="/mentions-legales"
                aria-label="Mentions légales et Politique de confidentialité"
                className="px-[.6rem] uppercase text-pink-arch underline hover:no-underline"
              >
                Mentions légales et Politique de confidentialité
              </Link>
              .
            </p>
            <button
              aria-label="Ok"
              className="heroCta aspect-auto w-full bg-black p-[1rem] text-white hover:text-pink-arch lg:aspect-square lg:w-auto"
              onClick={handleClose}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </>
  );
}
