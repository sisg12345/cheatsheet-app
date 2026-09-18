import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import type { CheatSheetSummary } from "@/src/cheatsheets/types";
import styles from "./SheetMenu.module.css";

interface SheetMenuProps {
  /** 並び順はそのまま表示順になる（一覧のカードと同じ registry の順）。 */
  sheets: CheatSheetSummary[];
}

/**
 * ヘッダーの「チートシート」メニュー。ボタンでシートへのリンクの一覧を開閉する。
 *
 * ARIA の menu ロールは使わず、ボタン＋リンク一覧のディスクロージャーにしている。
 * 中身はただのナビゲーションのリンクで、Tab で順にたどれれば十分なため
 * （menu ロールにすると矢印キーでの移動まで実装する必要がある）。
 */
export function SheetMenu({ sheets }: SheetMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const { pathname } = useLocation();

  // 開いている間だけ、メニューの外を押したら閉じる。
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onKeyDown={(event) => {
        // 検索欄のクリア（window で Escape を拾う）まで届かないよう、ここで止める。
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        // Tab などでフォーカスがメニューの外の要素へ移ったら閉じる。移り先が無い場合
        // （何もない所のクリックや、Safari でリンクを押した瞬間）は pointerdown 側に任せる。
        const next = event.relatedTarget;
        if (next && !event.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
      >
        チートシート
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </button>

      {/* 閉じている間も DOM には残して hidden で隠す。aria-controls の参照先を常に存在させるため。 */}
      <ul id={listId} className={styles.list} hidden={!open}>
        {sheets.map((sheet) => {
          const to = `/cheatsheets/${sheet.slug}`;
          return (
            <li key={sheet.slug}>
              <Link
                to={to}
                aria-current={pathname === to ? "page" : undefined}
                style={{ "--sheet-accent": sheet.accent } as CSSProperties}
                onClick={() => setOpen(false)}
              >
                <span className={styles.dot} aria-hidden="true" />
                {sheet.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
