import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_app_starts():
    assert app is not None

def test_generate_itinerary(client):
    response = client.post('/generate', json={"city": "Paris", "days": 3})
    assert response.status_code == 200
    assert isinstance(response.json, list) or isinstance(response.json, str)

def test_geocode_valid_address(client):
    response = client.post('/geocode', json={"address": "Eiffel Tower"})
    assert response.status_code == 200
    data = response.get_json()
    assert "lat" in data and "lng" in data