import { Form, Link } from "@remix-run/react";
import type { Navigation, Params } from "@remix-run/react";
import { FilterIcon } from "./FilterIcons";
import { FitnessIcon } from "../assets/fitness";
import { MentalIcon } from "~/assets/mental";
import { SpiritualIcon } from "~/assets/spiritual";
import { SocialIcon } from "~/assets/social";
import { PurposeIcon } from "~/assets/purpose";
import { GoalIcon } from "~/assets/bygoal";
import { AllIcon } from "~/assets/allcategory";


// Future Enchancement is to make it scrollable like Airbnb category filters
// https://youtu.be/c_-b_isI4vg?si=aRq6FnNHE4bP_mJN&t=9882

const categoryFilterItems = [
  { value: 'Fitness', IconComponent: FitnessIcon },
  { value: 'Spiritual', IconComponent: SpiritualIcon },
  { value: 'Mental', IconComponent: MentalIcon },
  { value: 'Social', IconComponent: SocialIcon },
  { value: 'Purpose', IconComponent: PurposeIcon },
]

const goalsStartsWith = (search: string | null) => {
  if (search === null) {
    return null;
  } else if (search.startsWith('?goal_id')){
    return true;
  } else {
    return false;
  }
}

export function CategoryFilters({
  navigation,
  categoryParam,
  params,
  pathname,
  search
}: {
  navigation?: Navigation;
  categoryParam: string | null;
  params: Params;
  pathname: string;
  search: string;
}) {

  const filterMenu = categoryFilterItems.map((item) => {
    return (
      <FilterIcon key={item.value} value={item.value} IconComponent={item.IconComponent} categoryParam={categoryParam}/>
    )
  })

  return (
    <div className="w-full py-8 overflow-x-scroll">
      <Form className="flex justify-between">
      <div className={`grid justify-self-center min-w-[100px]  ${goalsStartsWith(search) ? 'after:h-1 after:bg-gray-800 after:w-2/4 after:justify-self-center' : ''} `}>
            <Link to="/goalfilters" state={{ from: pathname, searching: search }} className="grid justify-self-center">
                <span className="grid justify-self-center">
                    <div className="grid justify-self-center">
                        <GoalIcon />
                    </div>
                    By Goal
                </span>
            </Link>
        </div>
        <div className={`grid justify-self-center min-w-[100px]  ${categoryParam === null && search === '' ? 'after:h-1 after:bg-gray-800 after:w-2/4 after:justify-self-center' : ''} `}>
            <Link className="grid " to={pathname}>
                <span className="grid justify-self-center">
                    <div className="grid justify-self-center">
                        <AllIcon />
                    </div>
                    All
                </span>
            </Link>
        </div>
        {filterMenu} 
      </Form>
    </div>
  );
}