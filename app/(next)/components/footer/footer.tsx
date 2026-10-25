import React from "react";

import Image from "next/image";

import { HomepageQueryResult, SettingsQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homepageQuery, settingsQuery } from "@/sanity/lib/queries";
import { MyCustomPortableText } from "../ui";
import { PortableTextBlock } from "next-sanity";
import HeaderTransitionLink from "../header/HeaderTransitionLink";
import CTAMarquee from "../homepage/CTAMarquee";

import FooterNewsLetter from "./FooterNewsletter";

export default async function Footer() {
  const settings = await sanityFetch<SettingsQueryResult>({
    query: settingsQuery,
  });

  const homePage = await sanityFetch<HomepageQueryResult>({
    query: homepageQuery,
  });

  //console.log("Settings: ", settings);


  return (
    <footer id="footer" className="mt-[7rem] overflow-hidden">
      <div>
        <div className="w-full inset-x-0 bottom-[1rem] z-50 px-[1rem] lg:inset-x-auto lg:right-[1rem] lg:pr-[1rem]">
          <div className="flex items-center justify-center px-[1rem] py-[.5rem] font-jetbrains text-[.8rem] ">
            <p>Avec le soutien de : </p>
          </div>
          <div>
          {(settings?.footer?.partnerLogos?.length ?? 0) > 0 && (
            <div className="partner-logos flex flex-wrap gap-10 py-6 justify-center">
              {settings?.footer?.partnerLogos!.map((logo, i) =>
                logo.logoImage ? (
                  <Image
                    key={i}
                    src={logo.logoImage}
                    alt={logo.alt || "Logo partenaire"}
                    width={130}
                    height={60}
                    className="object-contain"
                  />
                ) : null
              )}
            </div>
          )}
          </div>
        </div>
      </div>
      <CTAMarquee marquee={homePage} />
      <div className="bg-black">
        <div className="relative mx-auto flex min-h-full w-full max-w-[1440px] flex-col items-start justify-between gap-[3rem] overflow-hidden px-[1rem] py-[3rem] text-white lg:h-[390px] lg:flex-row lg:items-end lg:gap-0 lg:px-[3rem] lg:py-0">
          {/* 👇🏽 Logo */}
          <div className="order-3 flex items-start justify-start lg:order-none lg:h-[75%]">
            <Image
              src={settings?.footer?.logo?.logoImage || ""}
              alt={settings?.footer?.logo?.alt || "Logo pour le footer"}
              width={100}
              height={100}
              className="h-auto w-[11rem]"
            />
          </div>

          {/* 👇🏽 Address */}
          <div className="footerText relative flex flex-col justify-start gap-[1rem] lg:h-[75%]">
            <span>{settings?.footer?.addressGroup?.addressTitle}</span>
            <MyCustomPortableText
              value={
                settings?.footer?.addressGroup
                  ?.addressContent as PortableTextBlock[]
              }
              className="footerText pb-[3rem] text-white"
            />
            <a
              href={`mailto:${settings?.footer?.addressGroup?.mailAddress}`}
              aria-label="Envoyer un mail"
              className="hidden w-fit transition-colors duration-300 ease-tamisee hover:text-pink-arch lg:block"
            >
              {settings?.footer?.addressGroup?.mailAddress}
            </a>

            <span className="footerCopyright bottom-[1rem] left-0 hidden whitespace-nowrap lg:absolute lg:block">
              © {new Date().getFullYear()}{" "}
              {settings?.footer?.addressGroup?.addressTitle}
            </span>
          </div>

          {/* 👇🏽 Socials */}
          <div className="footerText flex h-[75%] w-full flex-col justify-start gap-[3rem] lg:w-auto">
            <div className="order-last flex flex-col gap-[1rem] lg:order-none lg:gap-[.5rem]">
              <span>Suivez-nous :</span>
              <div className="flex justify-start gap-[1rem]">
                {settings?.footer?.socialGroup?.map((social) => (
                  <a
                    key={social.socialName}
                    href={social.socialLink || ""}
                    aria-label="Lien vers le réseau social"
                    className="group relative flex aspect-square h-[2.75rem] w-[2.75rem] cursor-pointer items-center justify-center rounded-full border-[1px] border-white transition-colors duration-300 ease-tamisee hover:border-pink-arch lg:h-[2rem] lg:w-[2rem]"
                  >
                    <Image
                      src={social.socialLinkImage?.imageUrl || ""}
                      alt={social.socialLinkImage?.alt || ""}
                      width={50}
                      height={50}
                      className="h-[2rem] w-[2rem] antialiased lg:h-[1.25rem] lg:w-[1.25rem]"
                    />
                    <div className="absolute inset-0 rounded-full bg-pink-arch opacity-0 mix-blend-multiply transition-opacity duration-300 ease-tamisee group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <span>Newsletter :</span>
              <div className="relative flex min-w-full">
                <FooterNewsLetter />
                <div className="absolute inset-x-0 bottom-[1px] h-[2px] w-[calc(100%-3rem)] bg-white lg:w-[calc(100%-2rem)]" />
              </div>
            </div>
          </div>

          {/* 👇🏽 Links */}
          <div className="footerText flex h-[75%] flex-col items-start justify-start gap-[.5rem] lg:gap-[.25rem]">
            {settings?.footer?.footerLinks?.map((modules) => {
              return (
                <div key={modules.groupName}>
                  {modules.modules?.map((module) => {
                    if (module.type === "internal") {
                      return (
                        <HeaderTransitionLink
                          key={module.internalLink?.slug}
                          href={`/${module.internalLink?.slug}`}
                          className="footerTextHover"
                        >
                          {module.internalLink?.title}
                        </HeaderTransitionLink>
                      );
                    } else {
                      return (
                        <a
                          key={module.externalLink?.url}
                          href={module.externalLink?.url || ""}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Lien externe"
                          className="footerTextHover"
                        >
                          {module.externalLink?.title}
                        </a>
                      );
                    }
                  })}
                </div>
              );
            })}
          </div>
          <a
            href={`mailto:${settings?.footer?.addressGroup?.mailAddress}`}
            aria-label="Envoyer un mail"
            className="footerText mb-[3.5rem] block w-fit transition-colors duration-300 ease-tamisee hover:text-pink-arch lg:hidden"
          >
            {settings?.footer?.addressGroup?.mailAddress}
          </a>
          <span className="footerCopyright bottom-[1rem] left-0 order-last block whitespace-nowrap lg:absolute lg:hidden">
            © {new Date().getFullYear()}{" "}
            {settings?.footer?.addressGroup?.addressTitle}
          </span>
        </div>
      </div>
    </footer>
  );
}
