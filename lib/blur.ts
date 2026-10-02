import blurData from "./blurData.json";

const BLUR = blurData as Record<string, string>;

/** next/image props for a blurred placeholder, or nothing if the photo has none. */
export function blurProps(src: string) {
  const blurDataURL = BLUR[src];
  return blurDataURL ? ({ placeholder: "blur", blurDataURL } as const) : {};
}
