export interface Place {
  place_name: string
  short_description: string
  best_time_to_visit: string
  image_url?: string
}

export interface DayPlan {
  day: number;
  places: Place[];
}

export interface ItineraryOnlyResponse {
  type: "itinerary_only";
  city: string;
  days: DayPlan[];
}

export interface Hotel {
  hotel_name: string;
  area: string;
  why_good: string;
}

export interface Restaurant {
  restaurant_name: string;
  cuisine: string;
  why_visit: string;
}

export interface HotelsOnlyResponse {
  type: "hotels_only";
  city: string;
  categories: {
    category_name: string;
    hotels: Hotel[];
  }[];
}

export interface RestaurantsOnlyResponse {
  type: "restaurants_only";
  city: string;
  categories: {
    category_name: string;
    restaurants: Restaurant[];
  }[];
}

export interface RestaurantPageRestaurant {
  name: string;
  area: string;
  cuisine: string;
}

export interface RestaurantCategory {
  category_name: string;
  restaurants: RestaurantPageRestaurant[];
}

export interface RestaurantsPageResponse {
  type: "restaurants_page";
  city: string;
  categories: RestaurantCategory[];
}

export interface HotelPageHotel {
  name: string;
  area: string;
  nearby_info: string;
}

export interface HotelCategory {
  category_name: string;
  hotels: HotelPageHotel[];
}

export interface HotelsPageResponse {
  type: "hotels_page";
  city: string;
  categories: HotelCategory[];
}

export interface RailwayPageResponse {
  type: "railway_page";
  railway_booking_link: string;
}

export interface AboutPageResponse {
  type: "about_page";
  site_name: string;
  description: string;
  features: string[];
  how_to_use: string[];
}

export interface UnifiedTravelResponse {
  type: "unified_travel_plan";
  city: string;
  itinerary: DayPlan[];
  hotels: {
    category_name: string;
    hotels: Hotel[];
  }[];
  restaurants: {
    category_name: string;
    restaurants: Restaurant[];
  }[];
}

export type AIResponse = 
  | ItineraryOnlyResponse
  | HotelsOnlyResponse
  | RestaurantsOnlyResponse
  | RestaurantsPageResponse 
  | HotelsPageResponse 
  | RailwayPageResponse 
  | AboutPageResponse
  | UnifiedTravelResponse;
