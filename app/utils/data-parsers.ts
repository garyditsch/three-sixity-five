import { getDayOfYear, getDaysInYear } from "./date-helper";

// gets at unique arrary that filters out any repeating days of year for a logged behavior 
// not double dipping on logged behaviors!
export const getUniqueDayList = (list: Array<any>) => {
    const uniqueDaysList = list.filter((function(){
      const loggedDays = new Set();
      return function(day){
        if (!loggedDays.has(day.day_of_year)){
          loggedDays.add(day.day_of_year)
          return true;
        }
        return false;
      };
    })());
    return uniqueDaysList
}

export const getBehaviorList = (data: Array<any> | null) => {
    const fullList = data?.map((day) => {
      return {
        created_at: new Date(day.created_at),
        activity_date: new Date(day.activity_date),
        day_of_year: getDayOfYear(new Date(day.activity_date)),
        goal_id: day.goals.id,
        category: day.goals.category,
        id: day.id,
        user: day.user_id,
      }
    })
    return fullList;
}

export const groupedByCategory = (data: any) => {
    const x = data.reduce((acc, day) => {
      (acc[day.goals.category] = acc[day.goals.category] || []).push(day);
      return acc;
    }, {});
    return x;
  }
  
 export const getCountsByGoal = (data: any) => {
    let groupedAndCounts: { [key: string]: number } = {}
    for(let i = 0; i < data.length; i++) {
      const goal = data[i].goals.goal
      if(groupedAndCounts[goal]) {
        groupedAndCounts[goal] = groupedAndCounts[goal] + 1
      } else {
        groupedAndCounts[goal] = 1
      }
    }
    return groupedAndCounts
  }
  
export const getCountsByCategory = (data: any) => {
    let groupedAndCounts: { [key: string]: number } = {}
    for(let i = 0; i < data.length; i++) {
      const category = data[i].goals.category
      if(groupedAndCounts[category]) {
        groupedAndCounts[category] = groupedAndCounts[category] + 1
      } else {
        groupedAndCounts[category] = 1
      }
    }
    return groupedAndCounts
  }
  
export const getUniqueGoalList = (data: any) => {
    const uniqueGoalList = new Map();
    return data.filter(item => {
      return uniqueGoalList.has(item.goal_id) ? false : uniqueGoalList.set(item.goal_id, true);
    });
  };

export const createYearlyCalendar = (list: Array<any>) => {
  const year: object[] = [];
  let currentYear = new Date().getFullYear();
  const noDays = getDaysInYear(Number(currentYear));

  for(let i = 1; i < noDays + 1; i++){
    if(list.includes(i)){
      year.push({
        "number": i,
        "future": false,
        "complete": true
      })
    } else {
      year.push({
        "number": i,
        "future": false,
        "complete": false,
      })
    }
  }
  return year;
};