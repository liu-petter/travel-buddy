from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from geopy.geocoders import Nominatim
import json
import os
import time


GOOGLE_API_KEY = "key"
genai.configure(api_key=GOOGLE_API_KEY)

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('gemini-1.5-pro-latest')
geolocator = Nominatim(user_agent="travel_planner")

def generate_daily_itinerary(city, num_days):
    prompt = f"""
    Generate a numbered list of activities and their exact physical addresses (including street number, street name, city, postal code, and country) for a {num_days}-day trip to {city}. Format:
    1. Day X: Activity - Address
    Only include the list, no extra text. insure there are at least 7 activities per day.
    """
    response = model.generate_content(prompt)
    return response.text

def get_lat_long(address):
    try:
        location = geolocator.geocode(address, timeout=10)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        print("Geocode error:", e)
    return None, None

def parse_itinerary(text):
    results = []
    for line in text.strip().split('\n'):
        if not line or not line[0].isdigit():
            continue
        try:
            _, content = line.split('. ', 1)
            activity, address = content.split(' - ')
            lat, lng = get_lat_long(address)
            time.sleep(1)  # to avoid Nominatim throttling
            results.append({
                "activity": activity.strip(),
                "exact_address": address.strip(),
                "latitude": lat,
                "longitude": lng
            })
        except Exception as e:
            print("Parse error:", e)
    return results

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
        structured = parse_itinerary(raw)

        
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
