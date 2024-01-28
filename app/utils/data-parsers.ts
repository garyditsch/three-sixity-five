import { getDayOfYear, getDaysInYear } from "./date-helper";

// CALENDER SCREEN FUNCTIONS

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

// CALENDAR SCREEN DATA RETURNS

const getBehaviorListReturn = [
    {
        "created_at": "2024-01-01T18:27:05.000Z",
        "day_of_year": 1,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 29,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-01T22:00:10.000Z",
        "day_of_year": 1,
        "goal_id": 4,
        "category": "Fitness",
        "id": 27,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-02T18:26:48.829Z",
        "day_of_year": 2,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 28,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
]

// DASHBOARD SCREEN FUNCTIONS


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

// DASHBOARD SCREEN DATA RETURNS

// The return from the loader on the Dashboard screen. This returns the same thing that the Calendar loader does
// The query can be pulled out into a shared query file and imported into both screens
const behaviorFilteredQueryReturn = [
    {
        "id": 27,
        "goal_id": 4,
        "created_at": "2024-01-01T22:00:10+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 4,
            "goal": "Full body strength session",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 28,
        "goal_id": 3,
        "created_at": "2024-01-02T18:26:48.829375+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 31,
        "goal_id": 3,
        "created_at": "2024-01-03T21:50:08.729449+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    }
]

const finalGroupedOutput = {
    "Fitness": [
        {
            "id": 27,
            "goal_id": 4,
            "created_at": "2024-01-01T22:00:10+00:00",
            "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
            "goals": {
                "id": 4,
                "goal": "Full body strength session",
                "value": 75,
                "category": "Fitness"
            }
        },
    ],
    "Spiritual": [
        {
            "id": 28,
            "goal_id": 3,
            "created_at": "2024-01-02T18:26:48.829375+00:00",
            "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
            "goals": {
                "id": 3,
                "goal": "Daily Bible Reading",
                "value": 365,
                "category": "Spiritual"
            }
        }
    ]
}

const behaviorCountsByGoalReturn = {
    "Full body strength session": 5,
    "Daily Bible Reading": 20,
    "Run": 8,
    "Swim": 3,
    "Walk 10k": 1
}

const behaviorCountsByCategoryReturn = {
    "Fitness": 17,
    "Spiritual": 20
}

const groupedByCategoryReturn = { 
    "Fitness": [
        {
            "id": 27,
            "goal_id": 4,
            "created_at": "2024-01-01T22:00:10+00:00",
            "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
            "goals": {
                "id": 4,
                "goal": "Full body strength session",
                "value": 75,
                "category": "Fitness"
            }
        },
        {
            "id": 32,
            "goal_id": 6,
            "created_at": "2024-01-03T23:25:25+00:00",
            "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
            "goals": {
                "id": 6,
                "goal": "Run",
                "value": 125,
                "category": "Fitness"
            }
        },
    ],
    "Spiritual": [
        {
            "id": 28,
            "goal_id": 3,
            "created_at": "2024-01-02T18:26:48.829375+00:00",
            "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
            "goals": {
                "id": 3,
                "goal": "Daily Bible Reading",
                "value": 365,
                "category": "Spiritual"
            }
        }
    ]
}

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