from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None

app = FastAPI()

@app.post('/items/')
async def create_item(item: Item):
    return item

# 구조 1. pydantic을 사용해서 api(post)에서 보낼 데이터 모델 검증
# 구조 2. 정의된 데이터 클래스 생성해주는 post api 개발
