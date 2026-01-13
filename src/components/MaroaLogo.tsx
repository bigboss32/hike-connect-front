import { cn } from "@/lib/utils";

interface MaroaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

const MaroaLogo = ({ className, size = 80, showText = false }: MaroaLogoProps) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle background - split into two halves */}
        <clipPath id="circleClip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
        
        <g clipPath="url(#circleClip)">
          {/* Top half - green gradient for mountains/forest */}
          <rect x="0" y="0" width="100" height="55" fill="#4A7C3F" />
          
          {/* Bottom half - brown for earth/trail */}
          <rect x="0" y="55" width="100" height="45" fill="#6B4423" />
          
          {/* Mountains in background */}
          <polygon points="15,55 35,25 55,55" fill="#3D6634" />
          <polygon points="45,55 70,20 95,55" fill="#2D5024" />
          
          {/* Small peak accent */}
          <polygon points="60,35 70,20 80,35" fill="#4A7C3F" />
          
          {/* Winding path/river */}
          <path
            d="M50 8 
               C45 15, 55 22, 48 30
               C42 38, 58 42, 50 50
               C42 58, 58 65, 50 75
               C42 85, 55 90, 50 98"
            stroke="#F5F0E6"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Path starting point marker */}
          <circle cx="50" cy="50" r="6" fill="#F5F0E6" />
          <circle cx="50" cy="50" r="3" fill="#6B4423" />
        </g>
        
        {/* Circle border */}
        <circle cx="50" cy="50" r="48" stroke="#4A7C3F" strokeWidth="2" fill="none" />
      </svg>
      
      {showText && (
        <span 
          className="mt-2 font-bold tracking-wide"
          style={{ 
            color: '#6B4423',
            fontSize: size * 0.25,
          }}
        >
          MAROÁ
        </span>
      )}
    </div>
  );
};

export default MaroaLogo;
