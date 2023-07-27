import type { FC } from "preact/compat";

interface LogoProps {
  size?: number;
}

const Logo: FC<LogoProps> = ({ size = 32 }) => {
  return (
    <svg
      style={{ width: size }}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M173.949 77.1025H256L173.949 170.641V214.949H150.974V41H173.949V77.1025ZM82.0513 170.641H0L82.0513 77.1025V41H105.026V214.949H82.0513V170.641Z"
        fill="#1F2937"
      ></path>
    </svg>
  );
};

export default Logo;
