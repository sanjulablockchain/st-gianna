type IconProps = {
  size?: number;
  className?: string;
};

export function makeIcon(path: string) {
  return function IconComponent({ size = 24, className }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 -960 960 960"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    );
  };
}
