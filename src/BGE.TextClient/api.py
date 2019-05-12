import requests
from requests.exceptions import HTTPError


def _send_request(url: str, data: dict = None):
    try:
        response = requests.post(url, data)

        response.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')
    else:
        return response.json()

    return None


def start_game(token=None):
    if token is None:
        return _send_request("http://127.0.0.1:3000/api/start")
    else:
        return _send_request("http://127.0.0.1:3000/api/start",
                             {"token": token})


def shoot(x: int, y: int, token: str):
    return _send_request("http://127.0.0.1:3000/api/shoot", {
        "token": token,
        "x": x,
        "y": y
    })
