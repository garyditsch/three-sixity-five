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
  { categoryParams: 'Fitness', value: 'Fitness', IconComponent: FitnessIcon },
  { categoryParams: 'Spiritual', value: 'Spiritual', IconComponent: SpiritualIcon },
  { categoryParams: 'Mental', value: 'Mental', IconComponent: MentalIcon },
  { categoryParams: 'Social', value: 'Social', IconComponent: SocialIcon },
  { categoryParams: 'Purpose', value: 'Purpose', IconComponent: PurposeIcon },
]

const filterMenu = categoryFilterItems.map((item) => {
  return (
    <FilterIcon key={item.value} value={item.value} categoryParam={item.categoryParams} IconComponent={item.IconComponent}/>
  )
})

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
  console.log('CATEGORY PARAM', categoryParam)
  console.log('PARAMS', params)
  console.log('PATHNAME', pathname)
  console.log('SEARCH', search)
  console.log('NAVIGATION', navigation)
  return (
    <div className="w-full py-8 overflow-x-scroll">
      <Form className="flex justify-between">
      <div className="grid justify-self-center min-w-[100px]">
            <Link to="/goalfilters" state={{ from: pathname, searching: search }} className="grid justify-self-center">
                <span className="grid justify-self-center">
                    <div className="grid justify-self-center">
                        <GoalIcon />
                    </div>
                    By Goal
                </span>
            </Link>
        </div>
        <div className="grid justify-self-center min-w-[100px]">
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