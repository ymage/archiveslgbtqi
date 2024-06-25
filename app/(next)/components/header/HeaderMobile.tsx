"use client";
import { SettingsQueryResult } from "@/sanity.types";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tr } from "date-fns/locale";

type NavLinkProps = {
  settings: SettingsQueryResult;
};

const headerVariants = {
  hidden: {
    translateX: "100%",
    borderTopLeftRadius: "100%",
    borderBottomLeftRadius: "100%",
  },
  visible: {
    translateX: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    transition: {
      ease: [0.6, 0.01, 0.05, 0.95],
      duration: 0.7,
      staggerChildren: 0.2,
    },
  },
};

const headerItemVariants = {
  hidden: { translateY: "100%" },
  visible: { translateY: 0 },
};

export default function HeaderMobile({ settings }: NavLinkProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [menu, setMenu] = React.useState(false);

  const handleMenu = () => {
    setMenu((prevMenu) => !prevMenu);

    if (menu) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  return (
    <div className="z-50">
      <button onClick={handleMenu} className="z-50 lg:hidden">
        {menu ? "[close]" : "[menu]"}
      </button>

      <AnimatePresence>
        {menu && (
          <motion.div
            key={"menu"}
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            exit={{
              translateX: "100%",
              borderTopLeftRadius: "100%",
              borderBottomLeftRadius: "100%",
              transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] },
            }}
            ref={menuRef}
            className="absolute left-0 top-0 z-50 mt-[5rem] h-screen w-full flex-col gap-[1rem] overflow-hidden bg-white p-[1rem] lg:hidden"
          >
            <nav className="flex flex-col items-center justify-center gap-[3rem]">
              {settings?.header.links &&
                settings.header.links.map((link, index) => {
                  if (link.type === "internal") {
                    return (
                      <motion.a
                        key={link.internalLinkDetails?._id || ""}
                        onClick={handleMenu}
                        href={`/${link.internalLinkDetails?.slug || ""}`}
                        className="headerMobileItem h-[1.5rem] overflow-hidden"
                      >
                        <motion.div variants={headerItemVariants}>
                          {link.internalLinkDetails?.title || ""}
                        </motion.div>
                      </motion.a>
                    );
                  } else {
                    return (
                      <a
                        key={`link-${index}`}
                        onClick={handleMenu}
                        href={link.externalLinkDetails.url || ""}
                        target="_blank"
                        rel="noreferrer"
                        className="headerMobileItem h-[1.5rem] overflow-hidden"
                      >
                        <motion.div variants={headerItemVariants}>
                          {link.externalLinkDetails.title}
                        </motion.div>
                      </a>
                    );
                  }
                })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
