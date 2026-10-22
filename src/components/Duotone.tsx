/**
 * SVG filter that maps an image's shadows to magenta and highlights to beige,
 * so photos and paintings sit inside the two-colour palette.
 * Use with `style={{ filter: "url(#duotone)" }}`.
 */
export default function Duotone() {
  // magenta #6a0c6f → beige #f1e7d6, channel by channel (0–1)
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter id="duotone" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.416 0.945" />
          <feFuncG type="table" tableValues="0.047 0.906" />
          <feFuncB type="table" tableValues="0.435 0.839" />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}
