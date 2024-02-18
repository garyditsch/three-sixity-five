import { Form, Link } from "@remix-run/react";
import type { Navigation, Params } from "@remix-run/react";
import { FilterIcon } from "./FilterIcons";
import { FitnessIcon } from "../assets/fitness";
import { MentalIcon } from "~/assets/mental";
import { SpiritualIcon } from "~/assets/spiritual";
import { SocialIcon } from "~/assets/social";
import { PurposeIcon } from "~/assets/purpose";


// Future Enchancement is to make it scrollable like Airbnb category filters
// https://youtu.be/c_-b_isI4vg?si=aRq6FnNHE4bP_mJN&t=9882

// <CategoryFilters navigation={navigation} categoryParam={categoryParam} params={params} pathcategoryParams={pathcategoryParams} search={search}/>

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
  return (
    <div className="w-full py-4 overflow-x-scroll">
      <Form className="flex justify-between">
      <div className="grid justify-self-center min-w-[100px]">
            <Link className="grid " to="/goalfilters">
                <span className="grid justify-self-center">
                    <div className="grid justify-self-center">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 4167 4167">
                            <image x="6" y="5" width="4155" height="4157" xlinkHref="data:img/png;base64,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"/>
                        </svg>
                    </div>
                    By Goal
                </span>
            </Link>
        </div>
        <div className="grid justify-self-center min-w-[100px]">
            <Link className="grid " to={pathname}>
                <span className="grid justify-self-center">
                    <div className="grid justify-self-center">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 4167 4167">
                            <image x="6" y="5" width="4155" height="4157" xlinkHref="data:img/png;base64,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"/>
                        </svg>
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