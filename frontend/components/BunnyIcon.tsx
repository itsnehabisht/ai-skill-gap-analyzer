type BunnyIconProps = {
  className?: string;
};

export default function BunnyIcon({
  className,
}: BunnyIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* EARS */}
      <path
        d="M18 27C15 21 13 10 16 5C17 3 19 2 21 4C25 8 25 19 22 27"
        fill="currentColor"
      />

      <path
        d="M46 27C49 21 51 10 48 5C47 3 45 2 43 4C39 8 39 19 42 27"
        fill="currentColor"
      />

      {/* INNER EARS */}
      <path
        d="M19 21C17.5 16 17 9 19 7C20 6 21 8 21.5 11C22 15 21 19 19 21Z"
        fill="#FF9EB5"
        fillOpacity="0.9"
      />

      <path
        d="M45 21C46.5 16 47 9 45 7C44 6 43 8 42.5 11C42 15 43 19 45 21Z"
        fill="#FF9EB5"
        fillOpacity="0.9"
      />

      {/* HEAD */}
      <path
        d="M32 17C20.5 17 11 25 11 36C11 47 20 55 32 55C44 55 53 47 53 36C53 25 43.5 17 32 17Z"
        fill="currentColor"
      />

      {/* SOFT FACE HIGHLIGHT */}
      <ellipse
        cx="25"
        cy="23"
        rx="7"
        ry="4"
        fill="white"
        fillOpacity="0.1"
      />

      {/* CHEEKS */}
      <ellipse
        cx="19"
        cy="40"
        rx="4"
        ry="2.3"
        fill="#FF9EB5"
        fillOpacity="0.55"
      />

      <ellipse
        cx="45"
        cy="40"
        rx="4"
        ry="2.3"
        fill="#FF9EB5"
        fillOpacity="0.55"
      />

      {/* EYES */}
      <ellipse
        cx="24"
        cy="33"
        rx="4"
        ry="4.8"
        fill="white"
      />

      <ellipse
        cx="40"
        cy="33"
        rx="4"
        ry="4.8"
        fill="white"
      />

      {/* PUPILS */}
      <ellipse
        cx="24.7"
        cy="33.5"
        rx="2"
        ry="2.8"
        fill="#211D3D"
      />

      <ellipse
        cx="40.7"
        cy="33.5"
        rx="2"
        ry="2.8"
        fill="#211D3D"
      />

      {/* EYE HIGHLIGHTS */}
      <circle
        cx="25.4"
        cy="32.6"
        r="0.8"
        fill="white"
      />

      <circle
        cx="41.4"
        cy="32.6"
        r="0.8"
        fill="white"
      />

      {/* NOSE */}
      <path
        d="M29.5 39C30.5 37.8 33.5 37.8 34.5 39C35 39.7 34.5 40.6 32 41.3C29.5 40.6 29 39.7 29.5 39Z"
        fill="#FF7F9D"
      />

      {/* MOUTH */}
      <path
        d="M32 41C32 43 30.2 44 28.8 44"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />

      <path
        d="M32 41C32 43 33.8 44 35.2 44"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />

      {/* LITTLE TEETH */}
      <path
        d="M30.3 43.1H33.7V45C33.7 45.7 33.1 46.2 32 46.2C30.9 46.2 30.3 45.7 30.3 45V43.1Z"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  );
}