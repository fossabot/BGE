import api


def main():
    print(f"Hello! Enter command to begin")
    api.start_game()
    while True:

        command = input()
        if command.lower() == 'quit':
            print("Goodbye!")
            return

        if command.lower() == 'startgame':
            data = api.start_game()
            print(" /ABCDEFGJ\\")
            print(" |--------|")
            for (idx, row) in enumerate(data["result"]["firstPlayer"]):
                print(f'{idx + 1}|', end='')
                for col in row:
                    print(col, end='')
                print('|', end='')
                print()
            print(" \\--------/")


if __name__ == '__main__':
    main()