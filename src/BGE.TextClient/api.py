import requests
from requests.exceptions import HTTPError


class Api:
    def __init__(self, url: str):
        self.url = url

    def start_game(self, user_id, game_token: str = None):
        data = {"userId": user_id}
        if game_token is not None:
            data["gameToken"] = game_token

        return _send_request(f'{self.url}/start', data)

    def shoot(self, x: int, y: int, user_id: str):
        _send_request(f'{self.url}/shoot', {"userId": user_id, "x": x, "y": y})

    def state(self, user_id: str):
        return _send_request(f'{self.url}/state', {"userId": user_id})

    def reset(self):
        _send_request(f'{self.url}/reset')


def _send_request(url: str, data: dict = None):
    try:
        response = requests.post(url, data)
        response.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')
    else:
        if response.content != b'':
            return response.json()

    return None
