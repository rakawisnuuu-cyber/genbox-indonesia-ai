import sharp from "sharp";

function createWatermarkSvg(width: number, height: number): Buffer {
  const mainFontSize = Math.round(width * 0.05);
  const cornerFontSize = Math.round(mainFontSize * 0.4);
  const centerX = width / 2;
  const centerY = height / 2;
  const cornerX = width - cornerFontSize * 4;
  const cornerY = height - cornerFontSize;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="black" flood-opacity="0.5"/>
        </filter>
        <filter id="shadow-sm" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="black" flood-opacity="0.4"/>
        </filter>
      </defs>
      <text
        x="${centerX}"
        y="${centerY}"
        text-anchor="middle"
        dominant-baseline="central"
        font-family="Arial, Helvetica, sans-serif"
        font-weight="bold"
        font-size="${mainFontSize}px"
        fill="white"
        fill-opacity="0.3"
        letter-spacing="${Math.round(mainFontSize * 0.15)}px"
        filter="url(#shadow)"
        transform="rotate(-30, ${centerX}, ${centerY})"
      >GENBOX FREE TRIAL</text>
      <text
        x="${cornerX}"
        y="${cornerY}"
        text-anchor="end"
        dominant-baseline="auto"
        font-family="Arial, Helvetica, sans-serif"
        font-weight="bold"
        font-size="${cornerFontSize}px"
        fill="white"
        fill-opacity="0.5"
        letter-spacing="${Math.round(cornerFontSize * 0.1)}px"
        filter="url(#shadow-sm)"
      >GENBOX</text>
    </svg>`;

  return Buffer.from(svg);
}

export async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width ?? 1024;
    const height = metadata.height ?? 1024;

    const svgOverlay = createWatermarkSvg(width, height);

    const result = await sharp(imageBuffer)
      .composite([
        {
          input: svgOverlay,
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    return result;
  } catch (err) {
    console.warn(
      "Watermark failed, returning original image:",
      err instanceof Error ? err.message : String(err),
    );
    return imageBuffer;
  }
}
