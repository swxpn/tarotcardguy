import { LoaderCircle } from 'lucide-react';

type ThrobberProps = {
  className?: string;
};

export function Throbber({ className = 'h-4 w-4' }: ThrobberProps) {
  return <LoaderCircle className={`${className} animate-spin`} />;
}