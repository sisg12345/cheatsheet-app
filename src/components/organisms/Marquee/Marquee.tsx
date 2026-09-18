import { Children, isValidElement, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/src/components/atoms/Button/Button";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  /** 1要素が1枚になる。null などの描画されない値は数えない。 */
  children: ReactNode;
}

/** 1枚あたりの秒数。枚数に比例させ、枚数が変わっても流れる速さを一定に保つ。 */
const SECONDS_PER_ITEM = 4.5;

/**
 * 子要素を横1列に並べ、右から左へ一定の速さで流し続けるカルーセル（マーキー）。
 *
 * 同じ列を2本並べて一緒に「1列ぶん＋間隔」だけ左へ動かし、動き終わりを動き始めと
 * 同じ見た目にすることで継ぎ目なく繰り返している。動きは CSS アニメーションだけで、
 * スクロール位置の計測はしない。
 *
 * 2本目は見た目のための複製なので、aria-hidden と inert で読み上げと Tab の対象から外す。
 * 流れる内容は読み途中で動くと追えないため、ホバー中・フォーカスが中にある間は止め、
 * 止めたままにできるボタンも置く。動きを減らす設定では流さず、横スクロールで見せる。
 *
 * 一時停止の状態を持つので、molecules ではなく organisms に置いている。
 */
export function Marquee({ children }: MarqueeProps) {
  const items = Children.toArray(children);
  const [paused, setPaused] = useState(false);

  const list = (clone: boolean) => (
    <ul className={styles.track} aria-hidden={clone || undefined} inert={clone || undefined}>
      {items.map((item, index) => (
        <li key={isValidElement(item) ? (item.key ?? index) : index}>{item}</li>
      ))}
    </ul>
  );

  return (
    <div
      className={`${styles.marquee} ${paused ? styles.paused : ""}`}
      style={{ "--marquee-duration": `${items.length * SECONDS_PER_ITEM}s` } as CSSProperties}
    >
      <div
        className={styles.viewport}
        onBlur={(event) => {
          // Tab で見えていない1枚へ移ると、ブラウザがこの枠を横にスクロールして見せる。
          // 枠の外へフォーカスが出たら戻し、流れの位置とスクロールのずれを残さない。
          // 動きを減らす設定では枠がふつうの横スクロールなので、読んでいた位置を保つ。
          const viewport = event.currentTarget;
          if (viewport.contains(event.relatedTarget)) return;
          if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          viewport.scrollLeft = 0;
        }}
      >
        {list(false)}
        {list(true)}
      </div>

      <div className={styles.controls}>
        <Button size="sm" variant="ghost" onClick={() => setPaused((current) => !current)}>
          <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
          {paused ? "再生" : "一時停止"}
        </Button>
      </div>
    </div>
  );
}
