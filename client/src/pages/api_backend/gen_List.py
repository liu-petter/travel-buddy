import google.generativeai as genai
import os
import json
import time
from geopy.geocoders import Nominatim

GOOGLE_API_KEY = "ket"  
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro-latest')

geolocator = Nominatim(user_agent="travel_planner")

def generate_daily_itinerary(destination, num_days):
    prompt = f"Generate a numbered list of activities and their exact physical addresses (including street number, street name, city, postal code, and country) for a {num_days}-day trip to {destination}. Each item in the list should follow this format:\n\n'Day X: Activity - Exact Physical Address'\n\nFor example:\n\n'Day 1: Visit the Eiffel Tower - Champ de Mars, 5 Av. Anatole France, 75007 Paris, France'\n'Day 1: Explore the Louvre Museum - Rue de Rivoli, 75001 Paris, France'\n...\n\nOnly provide the numbered list of activities and exact physical addresses. Do not include any introductory or concluding paragraphs, explanations, or additional commentary. Do not include the leading number before 'Day X'. have a minimum of 7 activities per day."
    response = model.generate_content(prompt)
    return response.text

def get_lat_long(location_name):
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

                #rate limit
                time.sleep(1)

                latitude, longitude = get_lat_long(location_name)

                itinerary_list.append({
                    "day": day,
                    "activity": activity,
                    "exact_address": location_name,
                    "latitude": latitude,
                    "longitude": longitude
                })
            except Exception as e:
                print(f"Warning: Could not parse line: {line} ({e})")
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

        filename = f"client/public/locations.json"
        with open(filename, 'w') as f:
            json.dump(itinerary_list_with_coords, f, indent=4)
        print(f"\nItinerary exported to: {filename}")

    except ValueError:
        print("Invalid input for the number of days. Please enter a number.")