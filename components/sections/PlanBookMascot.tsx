"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  PLAN_BOOK_MASCOT_ALT,
  PLAN_BOOK_MASCOT_HEIGHT,
  PLAN_BOOK_MASCOT_PATH,
  PLAN_BOOK_MASCOT_WIDTH,
} from "@/lib/plan-mascot";

export function PlanBookMascot() {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHost(document.getElementById("plan-mascot-host"));
  }, []);

  if (!host) return null;

  return createPortal(
    <figure className="plan-book-mascot rv">
      <Image
        src={PLAN_BOOK_MASCOT_PATH}
        alt={PLAN_BOOK_MASCOT_ALT}
        width={PLAN_BOOK_MASCOT_WIDTH}
        height={PLAN_BOOK_MASCOT_HEIGHT}
        loading="lazy"
        decoding="async"
        sizes="(max-width: 960px) 160px, 220px"
        className="plan-book-mascot__img"
        draggable={false}
      />
    </figure>,
    host
  );
}
