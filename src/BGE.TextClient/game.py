from api import Api
from printer import BasePrinter, DefaultPrinter
import os


class Game:
    def __init__(self,
                 players,
                 user_id,
                 printer: BasePrinter = DefaultPrinter()):
        self.printer = printer
        self.players = players
        self.user_id = user_id

        self.player_token = ''
        self.bot_token = ''

        self.api = Api('http://127.0.0.1:3000/api')

    def accept(self, game_token):
        os.system("clear")
        player = self.api.start_game(self.user_id, game_token)
        state = self.api.state(self.user_id)
        self.printer.draw_field(state["player"]["state"]["field"],
                                state["enemy"]["state"]["field"])
        return player["token"]

    def accepted(self):
        os.system("clear")
        state = self.api.state(self.user_id)
        print("Opponent accepted challenge")
        self.printer.draw_field(state["player"]["state"]["field"],
                                state["enemy"]["state"]["field"])

    def start(self):
        player = self.api.start_game(self.user_id)
        return player["token"]

    def reset(self):
        self.api.reset()

    def shot(self):
        os.system("clear")
        state = self.api.state(self.user_id)
        self.printer.draw_field(state["player"]["state"]["field"],
                                state["enemy"]["state"]["field"])
        if state["player"]["turn"]:
            print("Your turn")
        else:
            print("Enemy turn")

    def shoot(self, x, y):
        os.system("clear")
        result = self.api.shoot(x, y, self.user_id)
        if result is not None:
            print(result["message"])

        state = self.api.state(self.user_id)
        self.printer.draw_field(state["player"]["state"]["field"],
                                state["enemy"]["state"]["field"])
        if state["player"]["turn"]:
            print("Your turn")
        else:
            print("Enemy turn")
