#!/usr/bin/env python3
"""
Тестовый скрипт для TourGid FastAPI Backend
"""

import requests
import json

# URL вашего backend (замените на реальный после деплоя)
BACKEND_URL = "http://localhost:8000"  # Для локального тестирования
# BACKEND_URL = "https://your-render-url.onrender.com"  # Для продакшена

def test_backend():
    """Тестируем все endpoint'ы backend'а"""
    
    print("🧪 Testing TourGid FastAPI Backend")
    print("=" * 50)
    
    # Тест 1: Health check
    print("\n1️⃣ Testing health endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=10)
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Тест 2: Root endpoint
    print("\n2️⃣ Testing root endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        if response.status_code == 200:
            print("✅ Root endpoint passed")
            print(f"   Message: {response.json().get('message', 'N/A')}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
    
    # Тест 3: Attractions
    print("\n3️⃣ Testing attractions endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/attractions", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Attractions endpoint passed")
            print(f"   Count: {data.get('count', 'N/A')}")
            print(f"   First attraction: {data.get('data', [{}])[0].get('name', 'N/A')}")
        else:
            print(f"❌ Attractions endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Attractions endpoint error: {e}")
    
    # Тест 4: AI Voice Processing
    print("\n4️⃣ Testing AI voice processing...")
    try:
        test_query = {
            "query": "Найди маршрут к Байтереку",
            "user_location": {"latitude": 52.3, "longitude": 76.95}
        }
        
        response = requests.post(
            f"{BACKEND_URL}/ai/process-voice",
            json=test_query,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ AI voice processing passed")
            print(f"   Intent: {data.get('data', {}).get('intent', 'N/A')}")
            print(f"   Response: {data.get('data', {}).get('response_text', 'N/A')[:50]}...")
        else:
            print(f"❌ AI voice processing failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ AI voice processing error: {e}")
    
    # Тест 5: Route Generation
    print("\n5️⃣ Testing route generation...")
    try:
        test_route = {
            "destination_id": "ast001",
            "preferences": ["scenic", "historical"]
        }
        
        response = requests.post(
            f"{BACKEND_URL}/ai/generate-route",
            json=test_route,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Route generation passed")
            print(f"   Destination: {data.get('data', {}).get('destination', {}).get('name', 'N/A')}")
            print(f"   Distance: {data.get('data', {}).get('route', {}).get('estimated_distance', 'N/A')} km")
        else:
            print(f"❌ Route generation failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Route generation error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Backend testing completed!")

if __name__ == "__main__":
    test_backend() 