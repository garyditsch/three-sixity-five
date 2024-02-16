import { Link } from "@remix-run/react";

type LinkButtonProps = {
  to: string;
  label: string;
  width: string;
}

export const LinkButton = ({label, to, width}: LinkButtonProps) => {
  return (
    <div className="py-8">
        <Link className={`block ${width} p-2 bg-gray-800 text-white text-center rounded-md`} to={to}> {label} </Link>
    </div>
  );
}