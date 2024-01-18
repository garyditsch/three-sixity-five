import { Form, Link } from "@remix-run/react";
import type { Navigation, Params } from "@remix-run/react";

export function CategoryFilters({
  navigation,
  categoryParam,
  params,
}: {
  navigation?: Navigation;
  categoryParam: string | null;
  params: Params
}) {
  return (
    <div className="w-full py-4">
      <Form className="flex justify-between">
        {navigation?.state === 'loading' && navigation.location.search === '' ? <Link to={`/calendar/2024/${params.user}`} 
            className="w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 text-center bg-gray-800  text-white"
          >
            Loading...
          </Link>  : <Link to={`/calendar/2024/${params.user}`}  
            className={`w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 text-center ${categoryParam === null ? 'bg-gray-800  text-white': 
            'border-solid border-2 border-gray-800'}`}
          >
            All
          </Link>
        }
        {navigation?.state === 'loading' && navigation.location.search === '?category=Fitness' ? <button 
            className="w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 bg-gray-800  text-white"
            name="category" value="Fitness">
            Loading...
          </button>  : <button 
            className={`w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 ${categoryParam === 'Fitness' ? 'bg-gray-800  text-white': 
            'border-solid border-2 border-gray-800'}`}
            name="category" value="Fitness">
            Fitness
          </button>
        }
        {navigation?.state === 'loading' && navigation.location.search === '?category=Mental' ? <button 
            className="w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 bg-gray-800  text-white"
            name="category" value="">
            Loading...
          </button>  : <button 
            className={`w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 ${categoryParam === 'Mental' ? 'bg-gray-800  text-white': 
            'border-solid border-2 border-gray-800'}`}
            name="category" value="Mental">
            Mental
          </button>
        }
        {navigation?.state === 'loading' && navigation.location.search === '?category=Spiritual' ? <button 
            className="w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 bg-gray-800  text-white"
            name="category" value="Spiritual">
            Loading...
          </button>  : <button 
            className={`w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 ${categoryParam === 'Spiritual' ? 'bg-gray-800  text-white': 
            'border-solid border-2 border-gray-800'}`}
            name="category" value="Spiritual">
            Spiritual
          </button>
        }
        {navigation?.state === 'loading' && navigation.location.search === '?category=Social' ? <button 
            className="w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 bg-gray-800  text-white"
            name="category" value="Social">
            Loading...
          </button>  : <button 
            className={`w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 ${categoryParam === 'Social' ? 'bg-gray-800  text-white': 
            'border-solid border-2 border-gray-800'}`}
            name="category" value="Social">
            Social
          </button>
        }
        {navigation?.state === 'loading' && navigation.location.search === '?category=Purpose' ? <button 
            className="w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 bg-gray-800  text-white"
            name="category" value="Purpose">
            Loading...
          </button>  : <button 
            className={`w-1/4 mx-2 rounded-full text-xs font-bold py-1 px-2 ${categoryParam === 'Purpose' ? 'bg-gray-800  text-white': 
            'border-solid border-2 border-gray-800'}`}
            name="category" value="Purpose">
            Purpose
          </button>
        }
      </Form>
    </div>
  );
}