import pytest
from unittest.mock import patch, MagicMock
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    return app.test_client()

@patch("app.generate_daily_itinerary")
@patch("app.get_lat_long")
def test_generate_plan_success(mock_get_lat_long, mock_generate_daily_itinerary, client):
    mock_generate_daily_itinerary.return_value = """
1. Day 1: Visit the Eiffel Tower - Champ de Mars, 5 Av. Anatole France, 75007 Paris, France
2. Day 2: Louvre Museum Tour - Rue de Rivoli, 75001 Paris, France
    """
    mock_get_lat_long.side_effect = [
        (48.8584, 2.2945),  # Eiffel Tower
        (48.8606, 2.3376)   # Louvre Museum
    ]

    response = client.post("/generate-plan", json={"city": "Paris", "days": 2})

    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["activity"] == "Day 1: Visit the Eiffel Tower"
    assert "Champ de Mars" in data[0]["exact_address"]
    assert data[0]["latitude"] == 48.8584
    assert data[0]["longitude"] == 2.2945

@patch("app.generate_daily_itinerary")
def test_generate_plan_invalid_input(mock_generate_daily_itinerary, client):
    response = client.post("/generate-plan", json={"city": "Paris"})  
    assert response.status_code == 400
    assert response.get_json()["error"] == "Missing city or days"

@patch("app.generate_daily_itinerary")
@patch("app.get_lat_long", return_value=(None, None))
def test_generate_plan_parsing_error(mock_get_lat_long, mock_generate_daily_itinerary, client):
    # this will make sure it parses correctly
    mock_generate_daily_itinerary.return_value = "1. Day 1: InvalidFormatWithoutDash"
    response = client.post("/generate-plan", json={"city": "Paris", "days": 1})
    assert response.status_code == 200
    data = response.get_json()
    assert data == []

@patch("app.generate_daily_itinerary", side_effect=Exception("AI Error"))
def test_generate_plan_model_failure(mock_generate_daily_itinerary, client):
    response = client.post("/generate-plan", json={"city": "Paris", "days": 1})
    assert response.status_code == 500
    assert response.get_json()["error"] == "Failed to generate plan"
