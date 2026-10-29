"use client";

import {
  faCompress,
  faExpand,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import Player from "@vimeo/player";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteIcon } from "@/components/icons/SiteIcon";

type HeroVimeoPlayerProps = {
  videoId: string;
  posterUrl: string;
  placeholderLabel: string;
  autoplay?: boolean;
  updateSize?: boolean | "cover";
};

function secondsToHms(totalSeconds: number) {
  const s = Math.max(0, Math.trunc(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

function boolAttr(value: boolean) {
  return value ? "true" : "false";
}

export function HeroVimeoPlayer({
  videoId,
  posterUrl,
  placeholderLabel,
  autoplay = false,
  updateSize = true,
}: HeroVimeoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const progressRef = useRef<HTMLProgressElement>(null);
  const timelineRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLSpanElement>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const scrollHandlerRef = useRef<(() => void) | null>(null);
  const mutedRef = useRef(false);
  const pausedByUserRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [activated, setActivated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [hover, setHover] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [beforePadding, setBeforePadding] = useState("56.25%");
  const [showFullscreen, setShowFullscreen] = useState(true);

  mutedRef.current = muted;

  const setHoverIdle = useCallback(() => {
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    setHover(true);
    hoverTimerRef.current = window.setTimeout(() => setHover(false), 3000);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    const root = rootRef.current;
    if (!iframe || !root || !videoId) return undefined;

    iframe.src = `https://player.vimeo.com/video/${videoId}?api=1&background=1&autoplay=0&loop=0&muted=1`;
    const player = new Player(iframe);
    playerRef.current = player;

    const onMouseMove = () => setHoverIdle();
    root.addEventListener("mousemove", onMouseMove, { passive: true });

    const syncFullscreen = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element | null };
      const active =
        document.fullscreenElement === root || doc.webkitFullscreenElement === root;
      setFullscreen(active);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("webkitfullscreenchange", syncFullscreen);

    const onPlay = () => {
      setLoaded(true);
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    player.on("play", onPlay);
    player.on("pause", onPause);

    const onTimeUpdate = (data: { seconds: number }) => {
      const seconds = data.seconds;
      if (timelineRef.current) timelineRef.current.value = String(seconds);
      if (progressRef.current) progressRef.current.value = seconds;
      if (durationRef.current) durationRef.current.textContent = secondsToHms(seconds);
    };
    player.on("timeupdate", onTimeUpdate);

    const onEnded = async () => {
      if (!autoplay) {
        setActivated(false);
        setPlaying(false);
        try {
          await player.unload();
        } catch {
          /* ignore */
        }
      } else {
        try {
          await player.play();
        } catch {
          /* ignore */
        }
      }
    };
    player.on("ended", onEnded);

    const applyUpdateSize = async () => {
      if (updateSize === "cover") {
        setBeforePadding("0%");
        return;
      }
      if (updateSize !== true) return;
      try {
        const [w, h] = await Promise.all([player.getVideoWidth(), player.getVideoHeight()]);
        if (w > 0) setBeforePadding(`${(h / w) * 100}%`);
      } catch {
        /* not ready */
      }
    };

    const checkVisibility = () => {
      if (pausedByUserRef.current) return;
      const rect = root.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) void player.play();
      else void player.pause();
    };

    void (async () => {
      try {
        await applyUpdateSize();
        const duration = await player.getDuration();
        if (timelineRef.current) {
          timelineRef.current.max = String(duration);
          timelineRef.current.value = "0";
        }
        if (progressRef.current) {
          progressRef.current.max = duration;
          progressRef.current.value = 0;
        }

        if (autoplay) {
          await player.setVolume(0);
          setMuted(true);
          scrollHandlerRef.current = checkVisibility;
          window.addEventListener("scroll", checkVisibility, { passive: true });
          checkVisibility();
        } else {
          await player.setVolume(1);
          await player.pause();
        }
      } catch {
        /* invalid id or blocked embed */
      }
    })();

    const fsSupported =
      document.fullscreenEnabled ||
      !!(document as Document & { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled;
    setShowFullscreen(fsSupported);

    return () => {
      root.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("fullscreenchange", syncFullscreen);
      document.removeEventListener("webkitfullscreenchange", syncFullscreen);
      player.off("play", onPlay);
      player.off("pause", onPause);
      player.off("timeupdate", onTimeUpdate);
      player.off("ended", onEnded);
      if (scrollHandlerRef.current) {
        window.removeEventListener("scroll", scrollHandlerRef.current);
        scrollHandlerRef.current = null;
      }
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
      player.destroy().catch(() => {});
      playerRef.current = null;
    };
  }, [autoplay, setHoverIdle, updateSize, videoId]);

  const handlePlay = async () => {
    const player = playerRef.current;
    if (!player) return;
    setActivated(true);
    setPlaying(true);
    try {
      await player.setVolume(0);
      await player.play();
      await player.setVolume(mutedRef.current ? 0 : 1);
    } catch {
      setPlaying(false);
    }
  };

  const handlePause = async () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      await player.pause();
    } catch {
      /* ignore */
    }
    if (autoplay && scrollHandlerRef.current) {
      pausedByUserRef.current = true;
      setPausedByUser(true);
      window.removeEventListener("scroll", scrollHandlerRef.current);
      scrollHandlerRef.current = null;
    }
  };

  const handleMute = async () => {
    const player = playerRef.current;
    if (!player) return;
    const next = !mutedRef.current;
    setMuted(next);
    try {
      await player.setVolume(next ? 0 : 1);
    } catch {
      /* ignore */
    }
  };

  const handleTimeline = async () => {
    const player = playerRef.current;
    const value = Number(timelineRef.current?.value ?? 0);
    if (!player) return;
    try {
      await player.setCurrentTime(value);
      if (progressRef.current) progressRef.current.value = value;
    } catch {
      /* ignore */
    }
  };

  const handleFullscreen = async () => {
    const root = rootRef.current;
    if (!root) return;
    try {
      if (!document.fullscreenElement) {
        const req =
          root.requestFullscreen?.bind(root) ||
          (root as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> })
            .webkitRequestFullscreen?.bind(root);
        await req?.();
      } else {
        const exit =
          document.exitFullscreen?.bind(document) ||
          (document as Document & { webkitExitFullscreen?: () => Promise<void> })
            .webkitExitFullscreen?.bind(document);
        await exit?.();
      }
    } catch {
      /* ignore */
    }
  };

  const updateSizeAttr = updateSize === "cover" ? "cover" : boolAttr(updateSize === true);

  return (
    <div
      ref={rootRef}
      className="vimeo-player"
      data-vimeo-player-init=""
      data-vimeo-video-id={videoId}
      data-vimeo-autoplay={boolAttr(autoplay)}
      data-vimeo-update-size={updateSizeAttr}
      data-vimeo-playing={boolAttr(playing)}
      data-vimeo-activated={boolAttr(activated)}
      data-vimeo-fullscreen={boolAttr(fullscreen)}
      data-vimeo-paused-by-user={boolAttr(pausedByUser)}
      data-vimeo-hover={boolAttr(hover)}
      data-vimeo-loaded={boolAttr(loaded)}
      data-vimeo-muted={boolAttr(muted)}
    >
      <div className="vimeo-player__before" style={{ paddingTop: beforePadding }} />
      <iframe
        ref={iframeRef}
        title={placeholderLabel}
        className="vimeo-player__iframe"
        width={640}
        height={360}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      />
      {posterUrl ? (
        <img src={posterUrl} alt="" className="vimeo-player__placeholder" loading="eager" />
      ) : (
        <div className="vimeo-player__placeholder vimeo-player__placeholder--fallback" aria-hidden>
          <span className="hero-video__placeholder-icon">
            <SiteIcon icon={faPlay} size={28} style={{ color: "var(--g-ink)" }} />
          </span>
        </div>
      )}
      <div className="vimeo-player__dark" aria-hidden />
      <button type="button" className="vimeo-player__play" data-vimeo-control="play" onClick={handlePlay}>
        <div className="vimeo-player__btn">
          <SiteIcon icon={faPlay} size={36} className="vimeo-player__btn-play-svg" />
        </div>
      </button>
      <button type="button" className="vimeo-player__pause" data-vimeo-control="pause" onClick={handlePause}>
        <div className="vimeo-player__btn">
          <SiteIcon icon={faPause} size={36} className="vimeo-player__btn-pause-svg" />
        </div>
      </button>
      <div className="vimeo-player__interface">
        <div className="vimeo-player__interface-bottom">
          <div className="vimeo-player__duration">
            <span ref={durationRef} className="vimeo-player__duration-span" data-vimeo-duration>
              0:00
            </span>
          </div>
          <div className="vimeo-player__timeline">
            <progress
              ref={progressRef}
              className="vimeo-player__timeline-progress"
              max={100}
              value={0}
            />
            <input
              ref={timelineRef}
              className="vimeo-player__timeline-input"
              type="range"
              min={0}
              max={100}
              step={0.01}
              data-vimeo-control="timeline"
              defaultValue={0}
              onInput={handleTimeline}
              onChange={handleTimeline}
            />
          </div>
          <button type="button" className="vimeo-player__mute" data-vimeo-control="mute" onClick={handleMute}>
            <SiteIcon icon={faVolumeHigh} size={20} className="vimeo-player__volume-up-svg" />
            <SiteIcon icon={faVolumeXmark} size={20} className="vimeo-player__volume-mute-svg" />
          </button>
          {showFullscreen && (
            <button
              type="button"
              className="vimeo-player__fullscreen"
              data-vimeo-control="fullscreen"
              onClick={handleFullscreen}
            >
              <SiteIcon icon={faExpand} size={20} className="vimeo-player__fullscreen-scale-svg" />
              <SiteIcon icon={faCompress} size={20} className="vimeo-player__fullscreen-shrink-svg" />
            </button>
          )}
        </div>
      </div>
      <div className="vimeo-player__loading" aria-hidden>
        <svg className="vimeo-player__loading-svg" viewBox="0 0 100 100" aria-hidden>
          <path
            fill="currentColor"
            d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              dur="1s"
              from="0 50 50"
              to="360 50 50"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  );
}
