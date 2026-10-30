import { Fragment } from "react";
import { ManifestInlineMascot } from "@/components/mascot/ManifestInlineMascot";
import type { Dictionary } from "@/lib/i18n/types";

function ManifestWord({ word }: { word: string }) {
  return (
    <span className="wm">
      <span className="wi">{word}</span>
    </span>
  );
}

export function Manifest({ dict }: { dict: Dictionary }) {
  const { wordsBeforeLogo } = dict.manifest;
  return (
    <section className="manifest">
      <div className="wrap">
        <h2>
          {wordsBeforeLogo.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              {i > 0 ? " " : null}
              <ManifestWord word={word} />
            </Fragment>
          ))}{" "}
          <span className="wm">
            <span className="wi">
              <ManifestInlineMascot />
            </span>
          </span>
        </h2>
        {/* Legacy copy (EN): Your job is the meeting. Everything before that does not belong on your plate. */}
        {/* Legacy copy (NL): Jouw werk is de afspraak. Alles wat daaraan voorafgaat, hoort niet op jouw bord. */}
      </div>
    </section>
  );
}
