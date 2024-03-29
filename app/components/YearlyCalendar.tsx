import { Link } from "@remix-run/react";

export function YearlyCalendar({
    calendarData,
    today,
    year,
    user,
  }: {
    calendarData: Array<any>,
    today: number,
    year: number,
    user: string | undefined
  }) {
    return (
        <div className="w-full grid grid-cols-7 gap-4 justify-items-center"> 
            {calendarData.map((day: any) => {
                return <Link to={`/daily/${year}/${day.number}/${user}`} key={day.number}>
                <div className={`${today === day.number ? 'border-solid border-2 border-indigo-600' : ''}`} >
                <div className={`w-10 h-10 flex items-center justify-center 
                    ${day.future ? 'bg-gray-200' : !day.future && day.complete ? 'bg-green-500' : 'bg-red-100'}`}>
                    {day.number}
                </div>
                </div>
                </Link>
            })}
        </div>
    )}