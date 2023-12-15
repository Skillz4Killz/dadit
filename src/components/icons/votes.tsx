interface VoteProps {
  active?: boolean;
}

export function UpVote(props: VoteProps) {
  return (
    <div className="h-5 w-5 flex items-center justify-center">
      <svg
        width="16"
        height="11"
        viewBox="0 0 16 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.33325 7.66667L7.99992 1L14.6666 7.66667M4.66659 10.1665L7.99992 6.83318L11.3333 10.1665"
          stroke={props.active ? "#818cf8" : "#374151"}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}

export function DownVote(props: VoteProps) {
  return (
    <div className="h-5 w-5 flex items-center justify-center">
      <svg
        width="16"
        height="11"
        viewBox="0 0 16 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.3333 0.83333L7.99992 4.16666L4.66659 0.833329M1.33325 3.33333L7.99992 10L14.6666 3.33333"
          stroke={props.active ? "#818cf8" : "#374151"}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}
