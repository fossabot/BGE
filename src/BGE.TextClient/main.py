from game import Game
import sys
import threading
from signalrcore.hub_connection_builder import HubConnectionBuilder


def main(game_token=None):
    game = None
    token = None
    if game_token is None:
        game = Game(2, 'user1')
        game.reset()
        token = game.start()
    else:
        game = Game(2, 'user2')
        token = game.accept(game_token)
    hub_connection = HubConnectionBuilder().with_url(
        "ws://localhost:5000/engine",
        options={
            "access_token_factory": lambda: token
        }).build()

    hub_connection.start()
    hub_connection.on("Shot", lambda _: game.shot())
    hub_connection.on("Accepted", lambda _: game.accepted())
    while True:
        command = input()
        if command.lower() == 'quit':
            print("Goodbye!")
            return

        if command.lower().startswith('shoot'):
            command = command.replace('shoot', '')
            (x, y) = list(map(int, command.split()))
            game.shoot(x, y)


if __name__ == '__main__':
    thread = None
    if len(sys.argv) > 1:
        thread = threading.Thread(target=main, args=(sys.argv[1], ))
    else:
        thread = threading.Thread(target=main)
    thread.start()
