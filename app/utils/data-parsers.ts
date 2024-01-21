import { getDayOfYear } from "./date-helper";

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
        day_of_year: getDayOfYear(new Date(day.created_at)),
        goal_id: day.goals.id,
        category: day.goals.category,
        id: day.id,
        user: day.user_id,
      }
    })
    return fullList;
}

// CALENDAR SCREEN DATA RETURNS

const loaderQueryCalendarScreen = [
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
    {
        "id": 33,
        "goal_id": 3,
        "created_at": "2024-01-04T23:26:12.148636+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 34,
        "goal_id": 3,
        "created_at": "2024-01-05T12:56:52.761912+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 35,
        "goal_id": 5,
        "created_at": "2024-01-05T22:27:26.656024+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 5,
            "goal": "Swim",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 42,
        "goal_id": 6,
        "created_at": "2024-01-07T02:06:29.190128+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 43,
        "goal_id": 3,
        "created_at": "2024-01-07T02:06:39.602637+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 45,
        "goal_id": 5,
        "created_at": "2024-01-06T14:51:20+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 5,
            "goal": "Swim",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 46,
        "goal_id": 3,
        "created_at": "2024-01-07T14:46:36.58157+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 47,
        "goal_id": 6,
        "created_at": "2024-01-07T16:15:04.825529+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 48,
        "goal_id": 7,
        "created_at": "2024-01-08T01:55:52.66231+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 7,
            "goal": "Walk 10k",
            "value": 25,
            "category": "Fitness"
        }
    },
    {
        "id": 49,
        "goal_id": 3,
        "created_at": "2024-01-08T21:39:31.512136+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 29,
        "goal_id": 3,
        "created_at": "2024-01-01T18:27:05+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 50,
        "goal_id": 3,
        "created_at": "2024-01-09T21:58:33.511448+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 51,
        "goal_id": 4,
        "created_at": "2024-01-10T01:07:14.923147+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 4,
            "goal": "Full body strength session",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 52,
        "goal_id": 3,
        "created_at": "2024-01-10T13:32:01.628721+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 53,
        "goal_id": 5,
        "created_at": "2024-01-11T01:10:22.948278+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 5,
            "goal": "Swim",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 54,
        "goal_id": 3,
        "created_at": "2024-01-12T02:31:53.014025+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 55,
        "goal_id": 6,
        "created_at": "2024-01-12T02:32:01.598894+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 56,
        "goal_id": 3,
        "created_at": "2024-01-12T12:36:51.276891+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 57,
        "goal_id": 4,
        "created_at": "2024-01-13T01:54:09.044333+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 4,
            "goal": "Full body strength session",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 58,
        "goal_id": 3,
        "created_at": "2024-01-13T14:32:26.679376+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 59,
        "goal_id": 3,
        "created_at": "2024-01-14T13:23:18.533931+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 60,
        "goal_id": 6,
        "created_at": "2024-01-13T11:00:52+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 61,
        "goal_id": 6,
        "created_at": "2024-01-14T21:29:25.702961+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 62,
        "goal_id": 3,
        "created_at": "2024-01-15T22:02:04.713458+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 63,
        "goal_id": 4,
        "created_at": "2024-01-15T23:01:18.969353+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 4,
            "goal": "Full body strength session",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 64,
        "goal_id": 6,
        "created_at": "2024-01-17T03:00:52.3144+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 65,
        "goal_id": 3,
        "created_at": "2024-01-17T03:00:59.846315+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 66,
        "goal_id": 3,
        "created_at": "2024-01-17T22:36:26.827961+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 67,
        "goal_id": 3,
        "created_at": "2024-01-18T21:41:53.801637+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 68,
        "goal_id": 3,
        "created_at": "2024-01-19T20:54:02.182772+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 69,
        "goal_id": 6,
        "created_at": "2024-01-20T00:24:22.037879+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 70,
        "goal_id": 3,
        "created_at": "2024-01-20T15:34:07.591205+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 71,
        "goal_id": 4,
        "created_at": "2024-01-18T23:51:30+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 4,
            "goal": "Full body strength session",
            "value": 75,
            "category": "Fitness"
        }
    }
]
console.log('Calendar Screen Loader Query: ', loaderQueryCalendarScreen)

// The loader on the Calendar screen pulls in an array of all behaviors as an object, with the goals nested inside.
// The loader can take in a url search parameter to filter the behaviors by category

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
    {
        "created_at": "2024-01-03T21:50:08.729Z",
        "day_of_year": 3,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 31,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-03T23:25:25.000Z",
        "day_of_year": 3,
        "goal_id": 6,
        "category": "Fitness",
        "id": 32,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-04T23:26:12.148Z",
        "day_of_year": 4,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 33,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-05T12:56:52.761Z",
        "day_of_year": 5,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 34,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-05T22:27:26.656Z",
        "day_of_year": 5,
        "goal_id": 5,
        "category": "Fitness",
        "id": 35,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-06T14:51:20.000Z",
        "day_of_year": 6,
        "goal_id": 5,
        "category": "Fitness",
        "id": 45,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-07T02:06:29.190Z",
        "day_of_year": 6,
        "goal_id": 6,
        "category": "Fitness",
        "id": 42,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-07T02:06:39.602Z",
        "day_of_year": 6,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 43,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-07T14:46:36.581Z",
        "day_of_year": 7,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 46,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-07T16:15:04.825Z",
        "day_of_year": 7,
        "goal_id": 6,
        "category": "Fitness",
        "id": 47,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-08T01:55:52.662Z",
        "day_of_year": 7,
        "goal_id": 7,
        "category": "Fitness",
        "id": 48,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-08T21:39:31.512Z",
        "day_of_year": 8,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 49,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-09T21:58:33.511Z",
        "day_of_year": 9,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 50,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-10T01:07:14.923Z",
        "day_of_year": 9,
        "goal_id": 4,
        "category": "Fitness",
        "id": 51,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-10T13:32:01.628Z",
        "day_of_year": 10,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 52,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-11T01:10:22.948Z",
        "day_of_year": 10,
        "goal_id": 5,
        "category": "Fitness",
        "id": 53,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-12T02:31:53.014Z",
        "day_of_year": 11,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 54,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-12T02:32:01.598Z",
        "day_of_year": 11,
        "goal_id": 6,
        "category": "Fitness",
        "id": 55,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-12T12:36:51.276Z",
        "day_of_year": 12,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 56,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-13T01:54:09.044Z",
        "day_of_year": 12,
        "goal_id": 4,
        "category": "Fitness",
        "id": 57,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-13T11:00:52.000Z",
        "day_of_year": 13,
        "goal_id": 6,
        "category": "Fitness",
        "id": 60,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-13T14:32:26.679Z",
        "day_of_year": 13,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 58,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-14T13:23:18.533Z",
        "day_of_year": 14,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 59,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-14T21:29:25.702Z",
        "day_of_year": 14,
        "goal_id": 6,
        "category": "Fitness",
        "id": 61,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-15T22:02:04.713Z",
        "day_of_year": 15,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 62,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-15T23:01:18.969Z",
        "day_of_year": 15,
        "goal_id": 4,
        "category": "Fitness",
        "id": 63,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-17T03:00:52.314Z",
        "day_of_year": 16,
        "goal_id": 6,
        "category": "Fitness",
        "id": 64,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-17T03:00:59.846Z",
        "day_of_year": 16,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 65,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-17T22:36:26.827Z",
        "day_of_year": 17,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 66,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-18T21:41:53.801Z",
        "day_of_year": 18,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 67,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-18T23:51:30.000Z",
        "day_of_year": 18,
        "goal_id": 4,
        "category": "Fitness",
        "id": 71,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-19T20:54:02.182Z",
        "day_of_year": 19,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 68,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-20T00:24:22.037Z",
        "day_of_year": 19,
        "goal_id": 6,
        "category": "Fitness",
        "id": 69,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    },
    {
        "created_at": "2024-01-20T15:34:07.591Z",
        "day_of_year": 20,
        "goal_id": 3,
        "category": "Spiritual",
        "id": 70,
        "user": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0"
    }
]

console.log('Get Behavior List Return: ', getBehaviorListReturn)

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
const loaderQueryDashboardScreen = [
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
    {
        "id": 33,
        "goal_id": 3,
        "created_at": "2024-01-04T23:26:12.148636+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 34,
        "goal_id": 3,
        "created_at": "2024-01-05T12:56:52.761912+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 35,
        "goal_id": 5,
        "created_at": "2024-01-05T22:27:26.656024+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 5,
            "goal": "Swim",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 42,
        "goal_id": 6,
        "created_at": "2024-01-07T02:06:29.190128+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 43,
        "goal_id": 3,
        "created_at": "2024-01-07T02:06:39.602637+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 45,
        "goal_id": 5,
        "created_at": "2024-01-06T14:51:20+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 5,
            "goal": "Swim",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 46,
        "goal_id": 3,
        "created_at": "2024-01-07T14:46:36.58157+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 47,
        "goal_id": 6,
        "created_at": "2024-01-07T16:15:04.825529+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 48,
        "goal_id": 7,
        "created_at": "2024-01-08T01:55:52.66231+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 7,
            "goal": "Walk 10k",
            "value": 25,
            "category": "Fitness"
        }
    },
    {
        "id": 49,
        "goal_id": 3,
        "created_at": "2024-01-08T21:39:31.512136+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 29,
        "goal_id": 3,
        "created_at": "2024-01-01T18:27:05+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 50,
        "goal_id": 3,
        "created_at": "2024-01-09T21:58:33.511448+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 51,
        "goal_id": 4,
        "created_at": "2024-01-10T01:07:14.923147+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 4,
            "goal": "Full body strength session",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 52,
        "goal_id": 3,
        "created_at": "2024-01-10T13:32:01.628721+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 53,
        "goal_id": 5,
        "created_at": "2024-01-11T01:10:22.948278+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 5,
            "goal": "Swim",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 54,
        "goal_id": 3,
        "created_at": "2024-01-12T02:31:53.014025+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 55,
        "goal_id": 6,
        "created_at": "2024-01-12T02:32:01.598894+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 56,
        "goal_id": 3,
        "created_at": "2024-01-12T12:36:51.276891+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 57,
        "goal_id": 4,
        "created_at": "2024-01-13T01:54:09.044333+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 4,
            "goal": "Full body strength session",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 58,
        "goal_id": 3,
        "created_at": "2024-01-13T14:32:26.679376+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 59,
        "goal_id": 3,
        "created_at": "2024-01-14T13:23:18.533931+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 60,
        "goal_id": 6,
        "created_at": "2024-01-13T11:00:52+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 61,
        "goal_id": 6,
        "created_at": "2024-01-14T21:29:25.702961+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 62,
        "goal_id": 3,
        "created_at": "2024-01-15T22:02:04.713458+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 63,
        "goal_id": 4,
        "created_at": "2024-01-15T23:01:18.969353+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 4,
            "goal": "Full body strength session",
            "value": 75,
            "category": "Fitness"
        }
    },
    {
        "id": 64,
        "goal_id": 6,
        "created_at": "2024-01-17T03:00:52.3144+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 65,
        "goal_id": 3,
        "created_at": "2024-01-17T03:00:59.846315+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 66,
        "goal_id": 3,
        "created_at": "2024-01-17T22:36:26.827961+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 67,
        "goal_id": 3,
        "created_at": "2024-01-18T21:41:53.801637+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 68,
        "goal_id": 3,
        "created_at": "2024-01-19T20:54:02.182772+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 69,
        "goal_id": 6,
        "created_at": "2024-01-20T00:24:22.037879+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 6,
            "goal": "Run",
            "value": 125,
            "category": "Fitness"
        }
    },
    {
        "id": 70,
        "goal_id": 3,
        "created_at": "2024-01-20T15:34:07.591205+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 3,
            "goal": "Daily Bible Reading",
            "value": 365,
            "category": "Spiritual"
        }
    },
    {
        "id": 71,
        "goal_id": 4,
        "created_at": "2024-01-18T23:51:30+00:00",
        "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
        "goals": {
            "id": 4,
            "goal": "Full body strength session",
            "value": 75,
            "category": "Fitness"
        }
    }
]

console.log('Dashboard Screen Loader Query', loaderQueryDashboardScreen)

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
        {
            "id": 35,
            "goal_id": 5,
            "created_at": "2024-01-05T22:27:26.656024+00:00",
            "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
            "goals": {
                "id": 5,
                "goal": "Swim",
                "value": 75,
                "category": "Fitness"
            }
        },
        {
            "id": 48,
            "goal_id": 7,
            "created_at": "2024-01-08T01:55:52.66231+00:00",
            "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
            "goals": {
                "id": 7,
                "goal": "Walk 10k",
                "value": 25,
                "category": "Fitness"
            }
        }
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

console.log('Final Grouped Output', finalGroupedOutput)

const behaviorCountsByGoalReturn = {
    "Full body strength session": 5,
    "Daily Bible Reading": 20,
    "Run": 8,
    "Swim": 3,
    "Walk 10k": 1
}

console.log('Behavior Counts By Goal Return', behaviorCountsByGoalReturn)

const behaviorCountsByCategoryReturn = {
    "Fitness": 17,
    "Spiritual": 20
}

console.log('Behavior Counts By Category Return', behaviorCountsByCategoryReturn)

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
        {
            "id": 35,
            "goal_id": 5,
            "created_at": "2024-01-05T22:27:26.656024+00:00",
            "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
            "goals": {
                "id": 5,
                "goal": "Swim",
                "value": 75,
                "category": "Fitness"
            }
        },
        {
            "id": 48,
            "goal_id": 7,
            "created_at": "2024-01-08T01:55:52.66231+00:00",
            "user_id": "5c6d1d41-f3e4-4e5d-b75e-9a21265e3da0",
            "goals": {
                "id": 7,
                "goal": "Walk 10k",
                "value": 25,
                "category": "Fitness"
            }
        }
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

console.log('Grouped By Category Return', groupedByCategoryReturn)