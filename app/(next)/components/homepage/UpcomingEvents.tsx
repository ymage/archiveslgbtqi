import React from "react";

import Image from "next/image";
import Link from "next/link";

import { HomepageQueryResult } from "@/sanity.types";

import { DateHourFormat } from "../ui";
import HeaderTransitionLink from "../header/HeaderTransitionLink";

type UpcomingEventsProps = {
  events: HomepageQueryResult;
};

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <>
      {events?.upcomingEventsSection?.upcomingEventsSectionVisibility && (
        <section className="mx-auto max-w-[1440px] px-[1rem] pb-[10rem] pt-[2.5rem] lg:px-[3rem]">
          <div className="flex flex-col justify-between pb-[2.5rem] lg:flex-row lg:items-center lg:justify-normal lg:gap-[8.75%]">
            <h2 className="font-tanker text-[2rem] uppercase lg:text-[3.3rem]">
              {events?.upcomingEventsSection?.upcomingEventsTitle ||
                "Prochaines dates"}
            </h2>
            <HeaderTransitionLink
              href={
                events?.upcomingEventsSection?.upcomingEventsCTA?.eventsCTA
                  ?.slug?.current || ""
              }
              className="font-tanker text-[1rem] duration-200 ease-tamisee hover:text-pink-arch lg:text-[1.12rem]"
            >
              {events?.upcomingEventsSection?.upcomingEventsCTA
                ?.eventsCTATitle || "Voir l'agenda"}{" "}
              [+]
            </HeaderTransitionLink>
          </div>
          <div className="grid min-h-full w-full grid-cols-1 place-content-between place-items-start gap-[5rem] lg:grid-cols-3 lg:gap-[1.5rem]">
            {events?.upcomingEventsSection?.upcomingEvents?.map((event) => (
              <HeaderTransitionLink
                href="/agenda"
                key={event._id}
                className="group relative aspect-square min-h-[80%] min-w-full text-white hover:text-pink-arch"
              >
                <div className="upcomingEventsBoxSize">
                  <Image
                    src={event.image?.imageUrl || ""}
                    alt={event.image?.alt || ""}
                    width={200}
                    height={200}
                    className="upcomingEventsBoxSize absolute inset-0"
                  />
                </div>
                <div className="upcomingEventsBoxSize bg-black p-[1rem]">
                  <span className="font-jetbrains text-[.8rem] uppercase">
                    {event.eventType}
                  </span>
                  <h3 className="font-tanker text-[2rem] uppercase leading-[1.75rem]">
                    {event.eventTitle}
                  </h3>
                  <h4 className="absolute bottom-[1rem] left-[1rem] font-jetbrains text-[.8rem] uppercase leading-[1rem]">
                    {(event.eventDate?.eventDateType as String) ===
                    "dateRange" ? (
                      <>
                        {/* start date */}
                        <DateHourFormat
                          formatType="shortDate"
                          dateString={event.eventDate?.eventStartDate || ""}
                        />
                        {/* end date */}
                        {" - "}
                        <DateHourFormat
                          formatType="shortDateWithYear"
                          dateString={event.eventDate?.eventEndDate || ""}
                        />
                        {/* start hour */}
                        {" - "}
                        <DateHourFormat
                          formatType="shortHour"
                          dateString={event.eventDate?.eventStartDate || ""}
                        />
                      </>
                    ) : (
                      <>
                        {event.eventDate?.eventEndDate ? (
                          <>
                            {/* start date */}
                            <DateHourFormat
                              formatType="shortDateWithYear"
                              dateString={event.eventDate?.eventStartDate || ""}
                            />
                            {/* hour "Entre 20h00 - 23h00" */}
                            {" - Entre "}
                            <DateHourFormat
                              formatType="shortHour"
                              dateString={event.eventDate?.eventStartDate || ""}
                            />
                            <>
                              {" Et "}
                              <DateHourFormat
                                formatType="shortHour"
                                dateString={event.eventDate?.eventEndDate || ""}
                              />
                            </>
                          </>
                        ) : (
                          <>
                            {/* start date */}
                            <DateHourFormat
                              formatType="shortDateWithYear"
                              dateString={event.eventDate?.eventStartDate || ""}
                            />
                            {/* hour "20h00" */}
                            {" - "}
                            <DateHourFormat
                              formatType="shortHour"
                              dateString={event.eventDate?.eventStartDate || ""}
                            />
                          </>
                        )}
                      </>
                    )}
                  </h4>
                </div>
                <div className="heroCta absolute bottom-0 right-0 z-10 translate-y-[99%] bg-black px-[1.25rem] pb-[.75rem]">
                  {events.upcomingEventsSection?.upcomingEventsCTATitle || ""}{" "}
                  [+]
                </div>
              </HeaderTransitionLink>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
