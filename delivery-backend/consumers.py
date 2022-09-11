from fastapi import HTTPException
import json

def create_delivery(state, event):
    data = json.loads(event.data)

    return {
        "id": event.delivery_id,
        "budget": float(data['budget']),
        "notes": data['notes'],
        "status": "ready"
    }

def start_delivery(state, event):
    if state['status'] != 'ready':
        raise HTTPException(status_code=400, detail="Delivery has already been started")

    return state | {
        "status": "active"
    }

def pickup_products(state, event):
    data = json.loads(event.data)
    new_budget = float(state['budget']) - float(data['purchase_price']) * int(data['quantity'])

    if new_budget < 0:
        raise HTTPException(status_code=400, detail="Not enough budget")

    return state | {
        "budget": new_budget,
        "purchase_price": float(data['purchase_price']),
        "quantity": int(data['quantity']),
        "status": "collected"
    }

def deliver_products(state, event):
    data = json.loads(event.data)
    new_budget = float(state['budget']) + float(data['sell_price']) * int(data['quantity'])

    return state | {
        "budget": new_budget,
        "sell_price": float(data['sell_price']),
        "quantity": int(data['quantity']),
        "status": "delivered"
    }

def increase_budget(state, event):
    data = json.loads(event.data)
    state['budget'] += float(data['budget'])

    return state

TYPES = {
    "CREATE_DELIVERY": create_delivery,
    "START_DELIVERY": start_delivery,
    "PICKUP_PRODUCTS": pickup_products,
    "DELIVER_PRODUCTS": deliver_products,
    "INCREASE_BUDGET": increase_budget
}