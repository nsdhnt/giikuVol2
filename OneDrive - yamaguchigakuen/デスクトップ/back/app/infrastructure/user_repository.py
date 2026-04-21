# app/infrastructure/user_repository.py

def fetch_user(user_id: int):
    # 仮のデータ
    users = {
        1: {"id": 1, "name": "Taro"},
        2: {"id": 2, "name": "Hanako"}
    }
    return users.get(user_id)