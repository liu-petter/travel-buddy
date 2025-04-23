from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from geopy.geocoders import Nominatim
from dotenv import load_dotenv
import json
import os
import time
import re

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('gemini-1.5-flash-latest')
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
    """Parses the plain text itinerary into a list of dictionaries with day, activity, and coordinates."""
    itinerary_list = []
    current_day = None
    for line in itinerary_text.strip().split('\n'):
        line = line.strip()
        if line and isinstance(line, str) and line.startswith("Day"):
            try:
                parts = line.split(': ', 1)
                day_activity = parts[0].strip()
                full_description = parts[1].strip()

                # Extract day number
                day_match = re.search(r'Day\s*(\d+)', day_activity, re.IGNORECASE)
                if day_match:
                    current_day = day_match.group(1)
                else:
                    print(f"Warning: Could not extract day number from line: {line}")
                    continue

                # Find the first occurrence of " - " to separate activity and address
                split_index = full_description.find(' - ')
                if split_index != -1:
                    activity = full_description[:split_index].strip()
                    location_name = full_description[split_index + 3:].strip()
                else:
                    activity = full_description.strip()
                    location_name = ""
                    print(f"Warning: Could not find ' - ' separator in line: {line}")

                latitude, longitude = get_lat_long(location_name)

                itinerary_list.append({
                    "day": current_day,
                    "activity": activity,
                    "exact_address": location_name,
                    "latitude": latitude,
                    "longitude": longitude
                })
            except IndexError:
                print(f"Warning: Could not parse line: {line}")
            except ValueError:
                print(f"Warning: Could not extract day number from line: {line}")
        elif line and current_day:  # If the line is not empty and doesn't start with "Day", treat as a new activity for the current day
            try:
                activity_parts = line.split(' - ')
                activity = activity_parts[0].strip()
                location_name = ' - '.join(activity_parts[1:]).strip() if len(activity_parts) > 1 else ""

                latitude, longitude = get_lat_long(location_name)

                itinerary_list.append({
                    "day": current_day,
                    "activity": activity,
                    "exact_address": location_name,
                    "latitude": latitude,
                    "longitude": longitude
                })
            except Exception as e:
                print(f"Warning: Could not parse continuation line: {line} ({e})")

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
        itinerary_text = generate_daily_itinerary(city, days)
        print("\nSuggested Activities and Exact Locations (Text):\n")
        print(itinerary_text)
        itinerary_list_with_coords = parse_itinerary_to_list_with_coords(itinerary_text)

        return jsonify(itinerary_list_with_coords), 200

    except Exception as e:
        print(" Error generating plan:", e)
        return jsonify({"error": "Failed to generate plan"}), 500

if __name__ == '__main__':
    app.run(port=5000)
