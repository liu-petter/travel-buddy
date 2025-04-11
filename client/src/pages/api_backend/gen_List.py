import google.generativeai as genai
import os
import json

GOOGLE_API_KEY = "GOOGLE_API_KEY" #  GOOGLE_API_KEY  replace that soon 
genai.configure(api_key=GOOGLE_API_KEY)
models = genai.list_models()
model = genai.GenerativeModel('gemini-1.5-pro-latest')


def generate_daily_itinerary(destination, num_days):
    """Generates a list of daily activities with locations for a given destination and number of days."""
    prompt = f"Generate a numbered list of activities and their general locations for a {num_days}-day trip to {destination}. Each item in the list should follow this format:\n\n'Day X: Activity - Location'\n\nFor example:\n\n'1. Day 1: Visit the Eiffel Tower - Champ de Mars, Paris, France'\n'2. Day 1: Explore the Louvre Museum - Rue de Rivoli, Paris, France'\n...\n\nOnly provide the numbered list of activities and locations. Do not include any introductory or concluding paragraphs, explanations, or additional commentary."
    response = model.generate_content(prompt)
    return response.text

def parse_itinerary_to_list(itinerary_text):
    """Parses the plain text itinerary into a list of dictionaries with correct day, activity, and location."""
    itinerary_list = []
    for line in itinerary_text.strip().split('\n'):
        line = line.strip()
        if line and line[0].isdigit():  # Check if the line starts with a digit (indicating a day number)
            try:
                # Split at the first colon followed by a space (": ")
                parts = line.split(': ', 1)
                day_activity_num = parts[0].strip()
                location = parts[1].strip()

                # Extract the day number
                day_num_str = day_activity_num.split('.')[0].strip().replace("Day", "").strip()
                day = day_num_str

                # Extract the activity (text after "Day X." and before " - ")
                activity_parts = location.split(' - ')
                activity = activity_parts[0].strip()
                location = ' - '.join(activity_parts[1:]).strip() if len(activity_parts) > 1 else ""

                itinerary_list.append({"day": day, "activity": activity, "location": location})
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
        if num_days <= 0: #this is to check if the user entered a positive number of days
            print("Please enter a positive number of days.")
        else:
            itinerary_text = generate_daily_itinerary(city, num_days)
            print("\nSuggested Activities and Locations (Text):\n")
            print(itinerary_text)

            itinerary_list_of_dicts = parse_itinerary_to_list(itinerary_text)

            # Export the list as JSON
            filename = f"{city.lower().replace(' ', '_')}_itinerary.json"
            with open(filename, 'w') as f:
                json.dump(itinerary_list_of_dicts, f, indent=4)

            print(f"\nItinerary exported as JSON to: {filename}")

    except ValueError:
        print("Invalid input for the number of days. Please enter a number.")