export function FilterIcon({
  value,
  categoryParam,
  IconComponent,
}: {
    value: string;
    categoryParam: string;  
    IconComponent: React.FC;
}) {
  return (
    <>
        <div className="grid justify-self-center min-w-[100px]">
            <button className="grid justify-self-center" name="category" value={categoryParam}>
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