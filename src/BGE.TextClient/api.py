import requests
from requests.exceptions import HTTPError


def _send_request(url: str):
    try:
        response = requests.post(url)

        response.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')
    else:
        return response.json()

    return None


def start_game():
    data = _send_request("http://127.0.0.1:3000/api/startGame")
    return data
    print(data)