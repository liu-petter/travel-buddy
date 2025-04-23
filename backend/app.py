from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from geopy.geocoders import Nominatim
import time

# configuration gemini and flask 
GOOGLE_API_KEY = "key"
genai.configure(api_key=GOOGLE_API_KEY)

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel("gemini-1.5-pro-latest")
geolocator = Nominatim(user_agent="travel_planner")

# generates prompts by using gemini
def generate_itinerary(city, days):
    prompt = f"""
    Generate a list of short activities and exact addresses for a {days}-day trip to {city}.
    Format like:
    1. Day X: Activity - Full address
    Only return the list, no extra text.
    """
    response = model.generate_content(prompt)
    return response.text

# getting the geocode (physical) address using Nominatim 
def geocode(address):
    try:
        location = geolocator.geocode(address, timeout=10)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        print("Geocoding failed:", e)
    return None, None

# parse AI response into structured objects with coordinates 
def parse_response(text):
    results = []
    for line in text.split("\n"):
        if not line.strip() or not line[0].isdigit():
            continue
        try:
            _, content = line.split(". ", 1)
            activity, address = content.rsplit(" - ", 1)
            lat, lng = geocode(address)
            time.sleep(1)  # prevents throttling
            results.append({
                "activity": activity.strip(),
                "exact_address": address.strip(),
                "latitude": lat,
                "longitude": lng
            })
        except Exception as e:
            print("Parse error:", e)
    return results

# trip generation with gemini
@app.route("/generate-plan", methods=["POST"])
def generate_plan():
    data = request.get_json()
    city = data.get("city")
    days = data.get("days")

    if not city or not days:
        return jsonify({"error": "Missing city or days"}), 400

    print(f"Generating {days}-day trip to {city}...")

    try:
        raw = generate_itinerary(city, days)
        places = parse_response(raw)
        return jsonify(places)
    except Exception as e:
        print("Generation error:", e)
        return jsonify({"error": "Failed to generate plan"}), 500

# to runn the server
if __name__ == "__main__":
    app.run(port=5000)
