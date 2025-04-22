import google.generativeai as genai
import os
import json
from geopy.geocoders import Nominatim

GOOGLE_API_KEY = "GOOGLE_API_KEY" #  GOOGLE_API_KEY  replace that soon 
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro-latest')

geolocator = Nominatim(user_agent="travel_planner")

def generate_daily_itinerary(destination, num_days):
    """Generates a list of daily activities with exact locations (including full address) for a given destination and number of days."""
    prompt = f"Generate a numbered list of activities and their exact physical addresses (including street number, street name, city, postal code, and country) for a {num_days}-day trip to {destination}. Each item in the list should follow this format:\n\n'Day X: Activity - Exact Physical Address'\n\nFor example:\n\n'1. Day 1: Visit the Eiffel Tower - Champ de Mars, 5 Av. Anatole France, 75007 Paris, France'\n'2. Day 1: Explore the Louvre Museum - Rue de Rivoli, 75001 Paris, France'\n...\n\nOnly provide the numbered list of activities and exact physical addresses. Do not include any introductory or concluding paragraphs, explanations, or additional commentary."
    response = model.generate_content(prompt)
    return response.text

def get_lat_long(location_name):
    """Retrieves the latitude and longitude for a given location name."""
    try:
        location = geolocator.geocode(location_name, timeout=10)
        if location:
            return location.latitude, location.longitude
        else:
            print(f"Warning: Could not find coordinates for '{location_name}'.")
            return None, None
    except Exception as e:
        print(f"Error geocoding '{location_name}': {e}")
        return None, None

def parse_itinerary_to_list_with_coords(itinerary_text):
    """Parses the plain text itinerary into a list of dictionaries with day, activity, and coordinates."""
    itinerary_list = []
    for line in itinerary_text.strip().split('\n'):
        line = line.strip()
        if line and line[0].isdigit():
            try:
                parts = line.split(': ', 1)
                day_activity_num = parts[0].strip()
                address = parts[1].strip()

                day_num_str = day_activity_num.split('.')[0].strip().replace("Day", "").strip()
                day = day_num_str

                activity_parts = address.split(' - ')
                activity = activity_parts[0].strip()
                location_name = ' - '.join(activity_parts[1:]).strip() if len(activity_parts) > 1 else ""

                latitude, longitude = get_lat_long(location_name)

                itinerary_list.append({
                    "day": day,
                    "activity": activity,
                    "exact_address": location_name,
                    "latitude": latitude,
                    "longitude": longitude
                })
            except IndexError:
                print(f"Warning: Could not parse line: {line}")
            except ValueError:
                print(f"Warning: Could not extract day number from line: {line}")
    return itinerary_list

if __name__ == "__main__":
    city = input("Enter the destination city: ")
    days = input("Enter the number of days for your trip: ")

    try:
        num_days = int(days)
        if num_days <= 0:
            print("Please enter a positive number of days.")
        else:
            itinerary_text = generate_daily_itinerary(city, num_days)
            print("\nSuggested Activities and Exact Locations (Text):\n")
            print(itinerary_text)

            itinerary_list_with_coords = parse_itinerary_to_list_with_coords(itinerary_text)

            # Export the list as JSON
            filename = f"{city.lower().replace(' ', '_')}_itinerary_exact_coords.json"
            with open(filename, 'w') as f:
                json.dump(itinerary_list_with_coords, f, indent=4)

            print(f"\nItinerary exported as JSON with exact addresses and coordinates to: {filename}")

    except ValueError:
        print("Invalid input for the number of days. Please enter a number.")