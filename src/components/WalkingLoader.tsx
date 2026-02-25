const WalkingLoader = ({ className = "" }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={`inline-block ${className}`}
  >
    {/* Head */}
    <circle cx="10" cy="3.5" r="2.2" fill="currentColor" opacity="0.9" />
    {/* Hat brim */}
    <ellipse cx="10" cy="2.2" rx="3.2" ry="0.7" fill="currentColor" opacity="0.6" />
    {/* Hat top */}
    <path d="M7.5 2.2 Q10 -0.2 12.5 2.2" fill="currentColor" opacity="0.7" />
    {/* Body */}
    <rect x="9" y="5.5" width="2.2" height="5.5" rx="1.1" fill="currentColor" opacity="0.85" />
    {/* Backpack */}
    <rect x="6.5" y="5.5" width="2.8" height="4.2" rx="1" fill="currentColor" opacity="0.4" />
    {/* Left leg */}
    <g className="animate-legSwing" style={{ transformOrigin: '9.5px 11px' }}>
      <rect x="8.5" y="11" width="1.8" height="5" rx="0.9" fill="currentColor" opacity="0.8" />
      <ellipse cx="9.5" cy="16.5" rx="1.6" ry="0.7" fill="currentColor" opacity="0.6" />
    </g>
    {/* Right leg */}
    <g className="animate-legSwing" style={{ transformOrigin: '11px 11px', animationDelay: '0.25s' }}>
      <rect x="10.2" y="11" width="1.8" height="5" rx="0.9" fill="currentColor" opacity="0.8" />
      <ellipse cx="11.2" cy="16.5" rx="1.6" ry="0.7" fill="currentColor" opacity="0.6" />
    </g>
    {/* Walking stick */}
    <g className="animate-stickSwing" style={{ transformOrigin: '13px 6px' }}>
      <line x1="12.5" y1="6" x2="15" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
    </g>
  </svg>
);

export default WalkingLoader;
