import React, { Fragment } from "react";

import Link from "next/link";

import { LastEventQueryResult } from "@/sanity.types";

import { DateHourFormat } from "../ui";
import TransitionLink from "../ui/TransitionLink";

type Props = {
  events: LastEventQueryResult;
  title: string;
  link: string;
};

export default function EventsModule({ events, title, link }: Props) {
  return (
    <ul className="flex flex-col pb-[5rem]">
      {events.map((event) => (
        <Fragment key={event.eventTitle}>
          {event.eventType === "true" && (
            <li className="border-b-[3px] border-black py-[1rem]">
              <h4 className="font-tanker text-[.8rem] uppercase tracking-wider lg:text-[1rem]">
                {event.eventType}
              </h4>
              <h3 className="font-tanker text-[1.2rem] uppercase tracking-wider lg:text-[1.5rem]">
                {event.eventTitle}
              </h3>
              <div className="richText">
                <DateHourFormat
                  formatType="fullDate"
                  dateString={event.eventDate?.eventStartDate || ""}
                />
                {event.eventDate?.eventEndDate && (
                  <>
                    <span>&nbsp;-&nbsp;</span>
                    <DateHourFormat
                      formatType="fullDate"
                      dateString={event.eventDate?.eventEndDate || ""}
                    />
                  </>
                )}
                <p className="">{event.eventLocation}</p>
              </div>
            </li>
          )}
        </Fragment>
      ))}
      <Link href="/agenda" className="linkButton mt-[2rem]">
        {link}
      </Link>
    </ul>
  );
}
