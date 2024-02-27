export function FilterIcon({
  value,
  categoryParam,
  IconComponent,
}: {
    value: string;
    categoryParam: string | null;
    IconComponent: React.FC;
}) {
  return (
    <>
        <div className={`grid justify-self-center min-w-[100px]  ${categoryParam === value ? 'after:h-1 after:bg-gray-800 after:w-2/4 after:justify-self-center' : ''} `}>
            <button className="grid justify-self-center" name="category" value={value}>
                <span className="grid justify-self-center">
                    <div className="grid justify-self-center">
                        <IconComponent />
                    </div>
                    {value}
                </span>
            </button>
        </div>
    </>
  )}