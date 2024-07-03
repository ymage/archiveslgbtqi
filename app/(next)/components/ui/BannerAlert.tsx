"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore, useTransition } from "react";

import { disableDraftMode } from "../../actions";

const emptySubscribe = () => () => {};

export default function BannerAlert() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const shouldShow = useSyncExternalStore(
    emptySubscribe,
    () => window.top === window,
    () => false,
  );

  if (!shouldShow) return null;

  return (
    <div
      className={`${
        pending ? "animate-pulse" : ""
      } text-black-primary fixed left-0 top-0 z-50 w-full border-b bg-white/95 backdrop-blur`}
    >
      <div className="z-50 py-2 text-center text-sm">
        {pending ? (
          "Disabling draft mode..."
        ) : (
          <>
            {"Previewing drafts. "}
            <button
              type="button"
              onClick={() =>
                startTransition(() =>
                  disableDraftMode().then(() => {
                    router.refresh();
                  }),
                )
              }
              className="hover:text-cyan underline transition-colors duration-200"
            >
              Back to published
            </button>
          </>
        )}
      </div>
    </div>
  );
}
