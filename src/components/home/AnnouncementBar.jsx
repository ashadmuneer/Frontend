export default function AnnouncementBar({ settings }) {
  const text = settings?.text ?? '✨ Free Shipping on Orders Over $150';
  const linkText = settings?.linkText ?? 'Book a Custom Wig Consultation';
  const linkUrl = settings?.linkUrl ?? '#custom';
  const enabled = settings?.enabled ?? true;

  if (!enabled) return null;

  return (
    <div className="bg-[var(--color-home-primary)] text-white py-3 text-center text-sm">
      <span>{text} | </span>
      <a href={linkUrl} className="text-yellow-300 hover:text-yellow-200 hover:underline font-medium">
        {linkText}
      </a>
    </div>
  );
}
