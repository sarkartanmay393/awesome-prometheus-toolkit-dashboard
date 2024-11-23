import Image from "next/image";

type Props = {
  svgCode: string;
  width?: number;
  height?: number;
  alt?: string;
};

export default function SVGWrapper({ svgCode, width, height, alt }: Props) {
  return (
    <Image
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svgCode)}`}
      width={width || 100}
      height={height || 100}
      alt={"My simple SVG" + alt}
    />
  );
}
