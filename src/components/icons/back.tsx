import Link from "next/link";

interface IconProps {
  url?: string;
}

export default function GoBackIcon(props: IconProps) {
  return (
    <Link href={props.url ?? "/"}>
      <div className="h-5 w-5">
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.33333 1.16667L1.5 6.99995M1.5 6.99995L7.33333 12.8333M1.5 6.99995H16.5"
            stroke="#1F2937"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
