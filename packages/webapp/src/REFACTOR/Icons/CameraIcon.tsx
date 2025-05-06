import { FC } from "react";

const CameraIcon: FC<{ width: number | string; height: number | string }> = ({
  height,
  width,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M67.6667 18.6666H44.3334L32.6667 32.6666H18.6667C16.1914 32.6666 13.8174 33.65 12.067 35.4003C10.3167 37.1506 9.33337 39.5246 9.33337 42V84C9.33337 86.4753 10.3167 88.8493 12.067 90.5996C13.8174 92.35 16.1914 93.3333 18.6667 93.3333H93.3334C95.8087 93.3333 98.1827 92.35 99.933 90.5996C101.683 88.8493 102.667 86.4753 102.667 84V42C102.667 39.5246 101.683 37.1506 99.933 35.4003C98.1827 33.65 95.8087 32.6666 93.3334 32.6666H79.3334L67.6667 18.6666Z"
        stroke="currentColor"
        strokeWidth="9.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56 74.6666C63.732 74.6666 70 68.3986 70 60.6666C70 52.9346 63.732 46.6666 56 46.6666C48.268 46.6666 42 52.9346 42 60.6666C42 68.3986 48.268 74.6666 56 74.6666Z"
        stroke="currentColor"
        strokeWidth="9.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { CameraIcon };
