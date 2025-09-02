from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import openai
import json
from datetime import datetime

# Инициализация FastAPI
app = FastAPI(
    title="TourGid AI Backend",
    description="AI-powered tourism assistant for Kazakhstan",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI конфигурация
openai.api_key = os.getenv("OPENAI_API_KEY", "your-api-key-here")

# Модели данных
class VoiceRequest(BaseModel):
    query: str
    user_location: Optional[Dict[str, float]] = None

class RouteRequest(BaseModel):
    destination_id: str
    preferences: Optional[List[str]] = None
    user_location: Optional[Dict[str, float]] = None

# Данные о достопримечательностях (копируем из Express версии)
ATTRACTIONS = [
    # АСТАНА
    {
        "id": "ast001",
        "name": "Байтерек",
        "description": "Символ Астаны - башня высотой 97 метров с обзорной площадкой",
        "location": "Проспект Нурсултан Назарбаев",
        "coordinates": {"latitude": 51.1283, "longitude": 71.4306},
        "categories": ["architecture", "scenic", "unique"],
        "rating": 4.8,
        "popularity_score": 0.95,
        "working_hours": {"weekdays": "10:00 - 22:00", "weekend": "10:00 - 22:00", "dayOff": None},
        "contacts": {"phone": "+7 (7172) 44-66-44", "address": "Проспект Нурсултан Назарбаев", "website": "www.baiterek.kz"},
        "visit_duration": "45-60 минут"
    },
    {
        "id": "ast002",
        "name": "Хан Шатыр",
        "description": "Крупнейший в мире шатер - торгово-развлекательный центр",
        "location": "Проспект Туран, 37",
        "coordinates": {"latitude": 51.1326, "longitude": 71.4064},
        "categories": ["architecture", "entertainment", "shopping", "unique"],
        "rating": 4.6,
        "popularity_score": 0.90,
        "working_hours": {"weekdays": "10:00 - 22:00", "weekend": "10:00 - 23:00", "dayOff": None},
        "contacts": {"phone": "+7 (7172) 44-44-44", "address": "Проспект Туран, 37", "website": "www.khanshatyr.kz"},
        "visit_duration": "2-4 часа"
    },
    {
        "id": "ast003",
        "name": "Мечеть Нур-Астана",
        "description": "Главная мечеть столицы, одна из крупнейших в Центральной Азии",
        "location": "Проспект Абая, 10",
        "coordinates": {"latitude": 51.1801, "longitude": 71.4460},
        "categories": ["religion", "architecture", "culture"],
        "rating": 4.7,
        "popularity_score": 0.85,
        "working_hours": {"weekdays": "05:00 - 23:00", "weekend": "05:00 - 23:00", "dayOff": None},
        "contacts": {"phone": "+7 (7172) 32-32-32", "address": "Проспект Абая, 10"},
        "visit_duration": "30-45 минут"
    },
    {
        "id": "ast004",
        "name": "Национальный музей Республики Казахстан",
        "description": "Крупнейший музей страны с уникальными экспозициями",
        "location": "Площадь Независимости, 54",
        "coordinates": {"latitude": 51.1278, "longitude": 71.4691},
        "categories": ["culture", "history", "education"],
        "rating": 4.5,
        "popularity_score": 0.80,
        "working_hours": {"weekdays": "10:00 - 19:00", "weekend": "10:00 - 20:00", "dayOff": "Понедельник"},
        "contacts": {"phone": "+7 (7172) 91-98-98", "address": "Площадь Независимости, 54", "website": "www.nationalmuseum.kz"},
        "visit_duration": "2-4 часа"
    },
    
    # ПАВЛОДАР
    {
        "id": "pvl001",
        "name": "Мечеть Машхур Жусупа",
        "description": "Главная соборная мечеть Павлодара, построенная в честь великого казахского просветителя",
        "location": "ул. Академика Сатпаева, 30",
        "coordinates": {"latitude": 52.2970, "longitude": 76.9470},
        "categories": ["religion", "architecture", "culture"],
        "rating": 4.6,
        "popularity_score": 0.9,
        "working_hours": {"weekdays": "05:00 - 23:00", "weekend": "05:00 - 23:00", "dayOff": None},
        "contacts": {"phone": "+7 (7182) 61-15-55", "address": "ул. Академика Сатпаева, 30"},
        "visit_duration": "30-45 минут"
    },
    {
        "id": "pvl002",
        "name": "Благовещенский собор",
        "description": "Православный кафедральный собор - архитектурная жемчужина Павлодара",
        "location": "ул. Кутузова, 4",
        "coordinates": {"latitude": 52.2850, "longitude": 76.9650},
        "categories": ["religion", "architecture", "history"],
        "rating": 4.7,
        "popularity_score": 0.85,
        "working_hours": {"weekdays": "07:00 - 19:00", "weekend": "07:00 - 20:00", "dayOff": None},
        "contacts": {"phone": "+7 (7182) 32-14-85", "address": "ул. Кутузова, 4", "email": "sobor.pavlodar@mail.ru"},
        "visit_duration": "30-60 минут"
    },
    {
        "id": "pvl003",
        "name": "Набережная реки Иртыш",
        "description": "Главная прогулочная зона города с красивыми видами на реку",
        "location": "Набережная им. Габита Мусрепова",
        "coordinates": {"latitude": 52.2900, "longitude": 76.9600},
        "categories": ["nature", "recreation", "scenic"],
        "rating": 4.5,
        "popularity_score": 0.95,
        "working_hours": {"weekdays": "24/7", "weekend": "24/7", "dayOff": None},
        "contacts": {"phone": "+7 (7182) 55-12-00", "address": "Набережная им. Габита Мусрепова"},
        "visit_duration": "1-3 часа"
    },
    {
        "id": "pvl004",
        "name": "Дом-музей Павла Васильева",
        "description": "Мемориальный музей знаменитого поэта, уроженца Павлодара",
        "location": "ул. Павла Васильева, 78",
        "coordinates": {"latitude": 52.2820, "longitude": 76.9580},
        "categories": ["culture", "history", "education"],
        "rating": 4.4,
        "popularity_score": 0.70,
        "working_hours": {"weekdays": "09:00 - 18:00", "weekend": "10:00 - 17:00", "dayOff": "Понедельник"},
        "contacts": {"phone": "+7 (7182) 61-28-47", "address": "ул. Павла Васильева, 78", "email": "vasiliev.museum@mail.ru"},
        "visit_duration": "45-90 минут"
    },
    {
        "id": "pvl005",
        "name": "Областной краеведческий музей",
        "description": "Главный музей региона с богатой коллекцией по истории и природе Прииртышья",
        "location": "ул. Академика Сатпаева, 40",
        "coordinates": {"latitude": 52.2890, "longitude": 76.9420},
        "categories": ["history", "culture", "education"],
        "rating": 4.3,
        "popularity_score": 0.75,
        "working_hours": {"weekdays": "09:00 - 18:00", "weekend": "10:00 - 17:00", "dayOff": "Понедельник"},
        "contacts": {"phone": "+7 (7182) 67-36-64", "address": "ул. Академика Сатпаева, 40", "website": "museum.pavlodar.gov.kz"},
        "visit_duration": "1-2 часа"
    },
    {
        "id": "pvl009",
        "name": "Баянаульский национальный парк",
        "description": "Первый национальный парк Казахстана с уникальной природой",
        "location": "Баянаульский район, 100 км от Павлодара",
        "coordinates": {"latitude": 52.5000, "longitude": 75.7000},
        "categories": ["nature", "adventure", "scenic"],
        "rating": 4.9,
        "popularity_score": 0.95,
        "working_hours": {"weekdays": "08:00 - 20:00", "weekend": "08:00 - 20:00", "dayOff": None},
        "contacts": {"phone": "+7 (71836) 2-13-58", "address": "с. Баянаул", "website": "bayanaul.kz"},
        "visit_duration": "1-3 дня"
    }
]

# Функции для работы с AI
async def process_with_openai(query: str, context: str = "") -> Dict[str, Any]:
    """Обработка запроса через OpenAI API"""
    try:
        system_prompt = f"""
        Ты - туристический гид по Казахстану. Отвечай на русском языке.
        Контекст: {context}
        
        Проанализируй запрос пользователя и верни JSON с полями:
        - intent: намерение (get_route, find_attraction, get_info, general)
        - confidence: уверенность (0.0-1.0)
        - destination: название места назначения (если есть)
        - response_text: естественный ответ на русском языке
        - reasoning: объяснение почему такой ответ
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        # Пытаемся распарсить JSON из ответа
        try:
            ai_response = json.loads(response.choices[0].message.content)
            return ai_response
        except json.JSONDecodeError:
            # Если не удалось распарсить JSON, создаем базовый ответ
            return {
                "intent": "general",
                "confidence": 0.8,
                "response_text": response.choices[0].message.content,
                "reasoning": ["AI сгенерировал ответ, но не в JSON формате"]
            }
            
    except Exception as e:
        print(f"OpenAI API error: {e}")
        # Fallback на базовую обработку
        return {
            "intent": "general",
            "confidence": 0.5,
            "response_text": "Извините, у меня проблемы с подключением к AI. Попробуйте позже.",
            "reasoning": ["OpenAI API недоступен"]
        }

def generate_route(destination: Dict[str, Any], preferences: List[str] = None) -> Dict[str, Any]:
    """Генерация маршрута к достопримечательности"""
    waypoints = []
    
    # Добавляем путевые точки если это популярное место
    if destination.get("popularity_score", 0) > 0.8:
        nearby_attractions = [a for a in ATTRACTIONS if a["id"] != destination["id"] and a.get("popularity_score", 0) > 0.7]
        if nearby_attractions:
            waypoints = nearby_attractions[:2]
    
    estimated_distance = 8.5 + (hash(destination["id"]) % 10)  # Детерминированная случайность
    estimated_duration = 60 + (hash(destination["id"]) % 120)
    
    return {
        "start": {"latitude": 52.2900, "longitude": 76.9500},  # Центр Павлодара
        "end": destination["coordinates"],
        "waypoints": [{"name": w["name"], "coordinates": w["coordinates"]} for w in waypoints],
        "estimated_distance": estimated_distance,
        "estimated_duration": estimated_duration,
        "difficulty_level": "easy" if estimated_distance < 15 else "medium",
        "highlights": ["Исторический центр", "Живописные виды"],
        "warnings": []
    }

# API endpoints
@app.get("/")
async def root():
    """Главная страница API"""
    return {
        "message": "🚀 TourGid AI Backend (FastAPI) is running!",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "ai_voice": "/ai/process-voice",
            "attractions": "/attractions",
            "routes": "/ai/generate-route"
        },
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    """Health check для Railway/Render"""
    return {
        "status": "OK",
        "message": "TourGid Backend is healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "backend": "FastAPI"
    }

@app.get("/attractions")
async def get_attractions():
    """Получить все достопримечательности"""
    return {
        "success": True,
        "data": ATTRACTIONS,
        "count": len(ATTRACTIONS)
    }

@app.post("/ai/process-voice")
async def process_voice(request: VoiceRequest):
    """Обработка голосового запроса через AI"""
    try:
        print(f"🎤 Processing voice query: '{request.query}'")
        
        # Контекст для AI
        context = f"Достопримечательности: {[a['name'] for a in ATTRACTIONS[:5]]}"
        if request.user_location:
            context += f" Пользователь в: {request.user_location}"
        
        # Обработка через OpenAI
        ai_result = await process_with_openai(request.query, context)
        
        # Генерация маршрута если нужно
        route_data = None
        if ai_result.get("intent") == "get_route" and ai_result.get("destination"):
            # Ищем достопримечательность по названию
            destination = None
            for attraction in ATTRACTIONS:
                if attraction["name"].lower() in ai_result["destination"].lower():
                    destination = attraction
                    break
            
            if destination:
                route = generate_route(destination)
                route_data = {
                    "destination": {
                        "id": destination["id"],
                        "name": destination["name"],
                        "coordinates": destination["coordinates"],
                        "categories": destination["categories"],
                        "rating": destination["rating"],
                        "popularity_score": destination["popularity_score"],
                        "opening_hours": destination["working_hours"]["weekdays"],
                        "relevance_score": 13.4
                    },
                    "route": route,
                    "reasoning": [f"Добавлены {len(route.get('waypoints', []))} интересные остановки по пути"]
                }
        
        # Формируем ответ
        result = {
            "success": True,
            "data": {
                "intent": ai_result.get("intent", "general"),
                "confidence": ai_result.get("confidence", 0.8),
                "destination": route_data["destination"] if route_data else None,
                "fetchai_route": route_data["route"] if route_data else None,
                "preferences": [],
                "reasoning": ai_result.get("reasoning", []),
                "alternatives": [],
                "response_text": ai_result.get("response_text", "Извините, не понял ваш запрос"),
                "route_data": route_data
            }
        }
        
        print(f"✅ Generated response: {ai_result.get('response_text', '')[:50]}...")
        return result
        
    except Exception as error:
        print(f"Error processing voice query: {error}")
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/ai/generate-route")
async def generate_route_endpoint(request: RouteRequest):
    """Генерация маршрута к конкретной достопримечательности"""
    try:
        destination = next((a for a in ATTRACTIONS if a["id"] == request.destination_id), None)
        if not destination:
            raise HTTPException(status_code=404, detail="Destination not found")
        
        route = generate_route(destination, request.preferences)
        
        return {
            "success": True,
            "data": {
                "destination": destination,
                "route": route,
                "preferences": request.preferences or []
            }
        }
        
    except Exception as error:
        print(f"Error generating route: {error}")
        raise HTTPException(status_code=500, detail=str(error))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 