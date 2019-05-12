import api


def main():
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
            for tpl in zipped:
                print(tpl)
            '''print(" /12345678\\")
            print(" |--------|")
            
            for (idx, row) in enumerate(data["result"]["firstPlayer"]):
                print(f'{chr(idx + 65)}|', end='')
                for col in row:
                    print(col, end='')
                print('|', end='')
                print()
            print(" \\--------/")'''


if __name__ == '__main__':
    main()
