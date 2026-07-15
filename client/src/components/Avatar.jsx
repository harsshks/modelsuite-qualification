import { useState } from 'react';

/**
 * Reusable Avatar component with broken-image fallback.
 *
 * If `src` is provided it renders an <img>; when the image fails to load
 * (or no src is supplied) it gracefully falls back to the user's initials
 * rendered on a coloured circle.
 *
 * Props
 * ─────
 * @param {string}  [src]       – URL of the profile image (optional)
 * @param {string}  name        – Full name used for initials + colour seed
 * @param {number}  [size=32]   – Pixel diameter of the avatar
 * @param {string}  [className] – Extra class names forwarded to the wrapper
 * @param {string}  [variant]   – "admin" | "talent" | "auto" (gradient variant)
 * @param {object}  [style]     – Extra inline styles forwarded to the wrapper
 */

/* ── Deterministic gradient palette ── */
const GRADIENTS = [
  'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
  'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
];

const VARIANT_GRADIENT = {
  admin:  'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  talent: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
};

const getGradient = (name = '', variant) => {
  if (variant && VARIANT_GRADIENT[variant]) return VARIANT_GRADIENT[variant];
  const code = name.charCodeAt(0) || 0;
  return GRADIENTS[code % GRADIENTS.length];
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.[0] || '?').toUpperCase();
};

const Avatar = ({
  src,
  name = '',
  size = 32,
  className = '',
  variant,
  style = {},
}) => {
  const [imgError, setImgError] = useState(false);

  const showImage = src && !imgError;
  const fontSize = Math.max(Math.round(size * 0.375), 10);

  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    fontFamily: 'Inter, sans-serif',
    ...style,
  };

  if (showImage) {
    return (
      <div className={className} style={baseStyle}>
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    );
  }

  /* Fallback: coloured circle with initials */
  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        background: getGradient(name, variant),
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: `${fontSize}px`,
        letterSpacing: '0.02em',
        userSelect: 'none',
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
