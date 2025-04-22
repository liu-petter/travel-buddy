from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from geopy.geocoders import Nominatim
import json
import os
import time


GOOGLE_API_KEY = "AIzaSyBiIBVelNjG6TFzfugbM6YPv5j44y4sY_Y"
genai.configure(api_key=GOOGLE_API_KEY)

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('gemini-1.5-pro-latest')
geolocator = Nominatim(user_agent="travel_planner")

def generate_daily_itinerary(city, num_days):
    prompt = f"""
    Generate a numbered list of activities and their exact physical addresses (including street number, street name, city, postal code, and country) for a {num_days}-day trip to {city}.
    Each item in the list should follow this format:

    '1. Day X: Activity - Exact Physical Address'
    Only provide the list without intro or conclusion.
    """
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

@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    data = request.json
    city = data.get('city')
    days = data.get('days')

    if not city or not days:
        return jsonify({"error": "Missing city or days"}), 400

    print(f" Generating plan for {city} ({days} days)...")

    try:
        raw = generate_daily_itinerary(city, int(days))
        structured = parse_itinerary_to_list_with_coords(raw)

        
        output_path = os.path.join(os.path.dirname(__file__), "../client/public/locations.json")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(structured, f, indent=4, ensure_ascii=False)

        return jsonify(structured)

    except Exception as e:
        print(" Error generating plan:", e)
        return jsonify({"error": "Failed to generate plan"}), 500

if __name__ == '__main__':
    app.run(port=5000)
