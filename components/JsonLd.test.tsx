import { render } from "@testing-library/react";
import JsonLd from "./JsonLd";

describe("JsonLd", () => {
  it("renders parseable JSON in a ld+json script", () => {
    const { container } = render(<JsonLd data={{ "@type": "Thing", name: "A & B" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.textContent ?? "")).toEqual({ "@type": "Thing", name: "A & B" });
  });

  it("escapes markup so a value cannot close the script", () => {
    const { container } = render(<JsonLd data={{ name: "</script><b>x</b>" }} />);
    const text = container.querySelector("script")!.textContent ?? "";
    expect(text).not.toContain("<");
    expect(JSON.parse(text).name).toBe("</script><b>x</b>");
  });
});
