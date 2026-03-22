/**
 * ImageLabelOverlay — Shared component for rendering positioned text labels on images.
 * Used across product galleries, catalog cards, and custom hair pages.
 * 
 * Props:
 * - meta: { label: string, labelPosition: string, showLabel: boolean }
 * - size: 'sm' | 'md' (default 'md') - controls padding and font size
 */

const POSITION_STYLES = {
  'top-left': { top: '0.75rem', left: '0.75rem', textAlign: 'left' },
  'top-center': { top: '0.75rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
  'top-right': { top: '0.75rem', right: '0.75rem', textAlign: 'right' },
  'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' },
  'bottom-left': { bottom: '0.75rem', left: '0.75rem', textAlign: 'left' },
  'bottom-center': { bottom: '0.75rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
  'bottom-right': { bottom: '0.75rem', right: '0.75rem', textAlign: 'right' },
};

const SM_POSITION_STYLES = {
  'top-left': { top: '0.5rem', left: '0.5rem', textAlign: 'left' },
  'top-center': { top: '0.5rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
  'top-right': { top: '0.5rem', right: '0.5rem', textAlign: 'right' },
  'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' },
  'bottom-left': { bottom: '0.5rem', left: '0.5rem', textAlign: 'left' },
  'bottom-center': { bottom: '0.5rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
  'bottom-right': { bottom: '0.5rem', right: '0.5rem', textAlign: 'right' },
};

export default function ImageLabelOverlay({ meta, size = 'md' }) {
  if (!meta?.label || !meta?.showLabel) return null;

  const positions = size === 'sm' ? SM_POSITION_STYLES : POSITION_STYLES;
  const isSmall = size === 'sm';

  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        ...positions[meta.labelPosition || 'bottom-center'],
        maxWidth: '90%',
      }}
      role="img"
      aria-label={meta.label}
    >
      <span
        style={{
          display: 'inline-block',
          padding: isSmall ? '0.25rem 0.6rem' : '0.35rem 0.75rem',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
          color: '#fff',
          fontSize: isSmall ? '0.75rem' : '0.8125rem',
          fontWeight: 600,
          fontFamily: "'Poppins', sans-serif",
          borderRadius: isSmall ? '0.375rem' : '0.5rem',
          letterSpacing: '0.02em',
          lineHeight: 1.4,
        }}
      >
        {meta.label}
      </span>
    </div>
  );
}
