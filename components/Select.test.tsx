import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "./Select";

const FRUITS = ["Apple", "Banana", "Blueberry", "Cherry"] as const;

function Harness({ initial = "" as (typeof FRUITS)[number] | "", onChange = vi.fn() }) {
  const [value, setValue] = useState<(typeof FRUITS)[number] | "">(initial);
  return (
    <>
      <label id="fruit-label" htmlFor="fruit">
        Fruit
      </label>
      <Select
        id="fruit"
        labelId="fruit-label"
        value={value}
        options={FRUITS}
        placeholder="Pick a fruit"
        onChange={(next) => {
          setValue(next);
          onChange(next);
        }}
      />
      <button type="button">After</button>
    </>
  );
}

describe("Select", () => {
  it("renders a labelled combobox with the placeholder and no native select", () => {
    const { container } = render(<Harness />);
    const combo = screen.getByRole("combobox", { name: "Fruit" });
    expect(combo).toHaveTextContent("Pick a fruit");
    expect(combo).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector("select")).toBeNull();
  });

  it("opens on click and chooses an option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeVisible();
    await user.click(screen.getByRole("option", { name: "Cherry" }));
    expect(onChange).toHaveBeenCalledWith("Cherry");
    expect(screen.getByRole("combobox")).toHaveTextContent("Cherry");
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("supports arrow keys, Enter and Escape", async () => {
    const user = userEvent.setup();
    render(<Harness initial="Apple" />);
    const combo = screen.getByRole("combobox");
    combo.focus();

    await user.keyboard("{ArrowDown}");
    expect(combo).toHaveAttribute("aria-expanded", "true");
    expect(combo).toHaveAttribute("aria-activedescendant", "fruit-option-0");

    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(combo).toHaveTextContent("Blueberry");
    expect(combo).toHaveAttribute("aria-expanded", "false");

    await user.keyboard("{ArrowDown}{End}");
    expect(combo).toHaveAttribute("aria-activedescendant", "fruit-option-3");
    await user.keyboard("{Escape}");
    expect(combo).toHaveAttribute("aria-expanded", "false");
    expect(combo).toHaveTextContent("Blueberry");
  });

  it("jumps to a match when a letter is typed and cycles on repeat", async () => {
    const user = userEvent.setup();
    render(<Harness initial="Apple" />);
    const combo = screen.getByRole("combobox");
    combo.focus();

    await user.keyboard("b");
    expect(combo).toHaveAttribute("aria-activedescendant", "fruit-option-1");
    await user.keyboard("b");
    expect(combo).toHaveAttribute("aria-activedescendant", "fruit-option-2");
  });

  it("closes when clicking outside", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("button", { name: "After" }));
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("marks the chosen option as selected", async () => {
    const user = userEvent.setup();
    render(<Harness initial="Banana" />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("aria-selected", "false");
  });
});
