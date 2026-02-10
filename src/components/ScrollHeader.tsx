import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

interface ScrollHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollHeader = ({ children, className }: ScrollHeaderProps) => {
  const isVisible = useScrollDirection();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-transform duration-300 ease-in-out",
        !isVisible && "-translate-y-full",
        className
      )}
    >
      {children}
    </header>
  );
};

export default ScrollHeader;
