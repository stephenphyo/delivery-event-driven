from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from redis_om import get_redis_connection, HashModel
import json
import consumers

# Redis Connection #
redis = get_redis_connection(
    host="redis-13354.c296.ap-southeast-2-1.ec2.cloud.redislabs.com",
    port=13354,
    username="stephenphyo",
    password="ALPHAbetagammatango@123",
    decode_responses=True
)

# FastAPI #
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_headers=['*'],
    allow_methods=['*']
)

class Delivery(HashModel):
    budget: float = 0
    notes: str = ''

    class Meta:
        database = redis

class Event(HashModel):
    delivery_id: str = None
    type: str
    data: str

    class Meta:
        database = redis

# GET #
@app.get('/')
async def root():
    return {"message": "Hello World"}

@app.get('/deliveries/{pk}/status')
async def get_state(pk: str):
    state = redis.get(f'delivery:{pk}')
    if state is None:
        return {}

    return json.loads(state)

# POST #
@app.post('/deliveries/create', status_code=201)
async def create(request:  Request):
    body = await request.json()
    delivery = Delivery(budget=body['data']['budget'], notes=body['data']['notes']).save()
    event = Event(delivery_id=delivery.pk, type=body['type'], data=json.dumps(body['data'])).save()
    state = consumers.TYPES[event.type]({}, event)
    redis.set(f'delivery:{delivery.pk}', json.dumps(state))

    return state

@app.post('/deliveries/event')
async def dispatch_event(request: Request):
    body = await request.json()
    delivery_id = body['delivery_id']
    event = Event(delivery_id=delivery_id, type=body['type'], data=json.dumps(body['data'])).save()
    state = await get_state(delivery_id)
    new_state = consumers.TYPES[event.type](state, event)
    redis.set(f'delivery:{delivery_id}', json.dumps(new_state))

    return new_state