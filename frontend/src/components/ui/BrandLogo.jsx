import { useSelector } from 'react-redux';

const SIZES = {
  xs: 'h-10 w-10',
  sm: 'h-14 w-14',
  md: 'h-16 w-16',
  lg: 'h-20 w-20',
  xl: 'h-28 w-28',
  '2xl': 'h-36 w-36',
  '3xl': 'h-44 w-44',
};

/**
 * AF monogram with double blue ring — transparent PNG.
 * @param {boolean} forDarkBg - white AF variant for dark backgrounds
 * @param {boolean} autoTone - pick variant from global dark mode (navbar)
 */
export default function BrandLogo({
  size = 'md',
  forDarkBg = false,
  autoTone = false,
  className = '',
  ...props
}) {
  const darkMode = useSelector((s) => s.ui?.darkMode);
  const onDark = forDarkBg || (autoTone && darkMode);
  const src = onDark ? '/logo-af-dark.png' : '/logo-af.png';

  return (
    <img
      src={src}
      alt="Anura Furniture"
      className={`object-contain shrink-0 bg-transparent ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    />
  );
}
