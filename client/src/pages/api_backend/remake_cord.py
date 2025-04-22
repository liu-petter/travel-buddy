import google.generativeai as genai
import os
import json
import re  # For potential coordinate extraction

GOOGLE_API_KEY = os.environ.get("AIzaSyBiAZ48AujcWuehEazn6X5-W8UlGbNDc8s")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash-latest')  # Using a more capable model

def generate_itinerary_with_coords(destination, num_days):
    """Generates a list of daily activities and attempts to get coordinates directly from Gemini."""
    prompt = f"""Generate a numbered list of activities for a {num_days}-day trip to {destination}. For each activity, also provide its exact physical address (including street number, street name, city, postal code, and country) and its latitude and longitude coordinates. Format each item like this:

'Day X: Activity - Exact Physical Address - Latitude, Longitude'

For example:

'Day 1: Visit the Eiffel Tower - Champ de Mars, 5 Av. Anatole France, 75007 Paris, France - 48.8584, 2.2945'
'Day 1: Explore the Louvre Museum - Rue de Rivoli, 75001 Paris, France - 48.8606, 2.3376'

Only provide the numbered list of activities, addresses, and coordinates. Do not include any introductory or concluding paragraphs or explanations."""
    response = model.generate_content(prompt)
    return response.text

def parse_itinerary_with_gemini_coords(itinerary_text):
    """Parses the Gemini-generated itinerary to extract day, activity, address, latitude, and longitude."""
    itinerary_list = []
    for line in itinerary_text.strip().split('\n'):
        line = line.strip()
        if line.startswith("Day"):
            try:
                parts = line.split(': ', 1)
                day_activity = parts[0].strip()
                rest = parts[1].strip().split(' - ')

                day_match = re.search(r'Day\s*(\d+)', day_activity, re.IGNORECASE)
                day = day_match.group(1) if day_match else None

                activity = rest[0].strip()
                exact_address = rest[1].strip() if len(rest) > 1 else None
                coords_str = rest[2].strip() if len(rest) > 2 else None

                latitude = None
                longitude = None
                if coords_str:
                    try:
                        lat_str, lon_str = map(str.strip, coords_str.split(','))
                        latitude = float(lat_str)
                        longitude = float(lon_str)
                    except ValueError:
                        print(f"Warning: Could not parse coordinates from '{coords_str}' in line: {line}")

                itinerary_list.append({
                    "day": day,
                    "activity": activity,
                    "exact_address": exact_address,
                    "latitude": latitude,
                    "longitude": longitude
                })
            except IndexError:
                print(f"Warning: Could not parse line: {line}")
    return itinerary_list

if __name__ == "__main__":
    city = input("Enter the destination city: ")
    days = input("Enter the number of days for your trip: ")

    try:
        num_days = int(days)
        if num_days <= 0:
            print("Please enter a positive number of days.")
        else:
            itinerary_text = generate_itinerary_with_coords(city, num_days)
            print("\nSuggested Activities, Addresses, and Coordinates (from Gemini):\n")
            print(itinerary_text)

            itinerary_list_with_coords = parse_itinerary_with_gemini_coords(itinerary_text)

            filename = f"{city.lower().replace(' ', '_')}_itinerary_gemini_coords.json"
            with open(filename, 'w') as f:
                json.dump(itinerary_list_with_coords, f, indent=4)

            print(f"\nItinerary exported as JSON with coordinates from Gemini to: {filename}")

    except ValueError:
        print("Invalid input for the number of days. Please enter a number.")