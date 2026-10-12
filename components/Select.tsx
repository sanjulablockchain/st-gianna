"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Select.module.css";

type SelectProps<T extends string> = {
  id: string;
  /** Id of the visible label. A <label htmlFor={id}> also works, since this renders a button. */
  labelId: string;
  value: T | "";
  options: readonly T[];
  onChange: (value: T) => void;
  /** Shown while nothing is chosen. */
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
};

const TYPEAHEAD_RESET_MS = 500;

/**
 * A themed dropdown in place of the native <select>, whose list is drawn by
 * the operating system and ignores the site theme. Follows the WAI-ARIA
 * select-only combobox pattern: focus stays on the button, and the active
 * option is announced through aria-activedescendant.
 */
export default function Select<T extends string>({
  id,
  labelId,
  value,
  options,
  onChange,
  placeholder = "Choose one",
  invalid = false,
  describedBy,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const typeahead = useRef({ text: "", at: 0 });

  const listId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const selectedIndex = value ? options.indexOf(value as T) : -1;

  // Close when a pointer goes down anywhere outside the control.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted option visible inside a scrolling list.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.children[active] as HTMLElement | undefined;
    node?.scrollIntoView?.({ block: "nearest" });
  }, [open, active]);

  function openAt(index: number) {
    setActive(Math.max(0, Math.min(options.length - 1, index)));
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (option !== undefined) onChange(option);
    setOpen(false);
  }

  function matchTypeahead(key: string) {
    const now = Date.now();
    const state = typeahead.current;
    state.text = now - state.at > TYPEAHEAD_RESET_MS ? key : state.text + key;
    state.at = now;
    // Pressing the same letter again ("bb") means "next match", not a word.
    const repeated = [...state.text].every((char) => char === state.text[0]);
    const query = (repeated ? state.text[0] : state.text).toLowerCase();
    const start = open ? active : Math.max(selectedIndex, 0);
    // A single letter starts after the current option so repeated presses
    // cycle through matches; a longer word may keep the current one.
    const offset = repeated ? 1 : 0;
    for (let step = 0; step < options.length; step += 1) {
      const index = (start + offset + step) % options.length;
      if (options[index].toLowerCase().startsWith(query)) return index;
    }
    return -1;
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;
    const current = open ? active : Math.max(selectedIndex, 0);

    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") {
        event.preventDefault();
        openAt(current);
        return;
      }
      if (key === "Home") {
        event.preventDefault();
        openAt(0);
        return;
      }
      if (key === "End") {
        event.preventDefault();
        openAt(options.length - 1);
        return;
      }
    } else {
      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          setActive(Math.min(options.length - 1, active + 1));
          return;
        case "ArrowUp":
          event.preventDefault();
          if (event.altKey) {
            choose(active);
          } else {
            setActive(Math.max(0, active - 1));
          }
          return;
        case "Home":
          event.preventDefault();
          setActive(0);
          return;
        case "End":
          event.preventDefault();
          setActive(options.length - 1);
          return;
        case "Enter":
        case " ":
          event.preventDefault();
          choose(active);
          return;
        case "Escape":
          event.preventDefault();
          setOpen(false);
          return;
        case "Tab":
          // Commit the highlighted option and let focus move on as normal.
          choose(active);
          return;
      }
    }

    if (key.length === 1 && /\S/.test(key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const match = matchTypeahead(key);
      if (match >= 0) openAt(match);
    }
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`${styles.trigger} ${invalid ? styles.invalid : ""} ${open ? styles.open : ""}`}
        onClick={() => (open ? setOpen(false) : openAt(Math.max(selectedIndex, 0)))}
        onKeyDown={onKeyDown}
        onBlur={(event) => {
          if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
        }}
      >
        <span className={value ? styles.value : styles.placeholder}>{value || placeholder}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </button>

      <ul
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        tabIndex={-1}
        ref={listRef}
        className={styles.list}
        hidden={!open}
      >
        {options.map((option, index) => (
          <li
            key={option}
            id={optionId(index)}
            role="option"
            aria-selected={index === selectedIndex}
            className={`${styles.option} ${index === active ? styles.active : ""}`}
            // Keep focus on the button so the list does not blur itself shut.
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => setActive(index)}
            onClick={() => choose(index)}
          >
            <span>{option}</span>
            {index === selectedIndex ? <span className={styles.tick} aria-hidden="true" /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
