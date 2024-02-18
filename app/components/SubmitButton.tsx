type LinkButtonProps = {
  label: string;
  width: string;
}

export const SubmitButton = ({label, type, width}: LinkButtonProps) => {
  return (
    <div className="py-4">
        <button type="submit" className={`block ${width} p-2 bg-gray-800 text-white text-center rounded-md`}> {label} </button>
    </div>
  );
}