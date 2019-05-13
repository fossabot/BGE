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
    command = ''
    while True:
        command = input()
        if command.lower() == 'quit':
            print("Goodbye!")
            return

        if command.lower().startswith('shoot'):
            command = command.replace('shoot', '')
            (x, y) = list(map(int, command.split()))
            game.shoot(x, y)


def old():
    print(f"Hello! Enter command to begin")
    bot_token = ''
    player_token = ''
    player_field = []
    bot_field = []
    while True:
        command = input()
        print(command)
        if command.lower() == 'quit':
            print("Goodbye!")
            return

        if command.lower().startswith('shoot'):
            command = command.replace('shoot', '')
            (x, y) = list(map(int, command.split()))
            data = api.shoot(x, y, player_token)
            bot_field = data['playerState']['field']
            zipped = list(zip(list(zip(*player_field)), list(zip(*bot_field))))
            for tpl in zipped:
                print(tpl)

        if command.lower() == 'startgame':
            player = api.start_game()
            player_token = player["token"]
            bot = api.start_game(player_token)
            bot_token = bot["token"]
            player_field = player['playerState']['field']
            bot_field = bot['playerState']['field']
            zipped = list(zip(list(zip(*player_field)), list(zip(*bot_field))))
            # len(player_field[0])
            numbers = ''.join(
                map(str, list(range(1,
                                    len(player_field[0]) + 1))))
            print(f' /{numbers}\\')
            print(f' |{"-" * (len(player_field[0]))}|')
            for (idx, tpl) in enumerate(zipped):

                (player, bot) = tpl
                print(
                    f'{idx + 1}|',
                    ''.join(list(player)),
                    f'|   {idx + 1}|',
                    ''.join(list(bot)),
                    '|',
                    sep='')


if __name__ == '__main__':
    thread = None
    if len(sys.argv) > 1:
        thread = threading.Thread(target=main, args=(sys.argv[1], ))
    else:
        thread = threading.Thread(target=main)
    thread.start()
