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
        player = self.api.accept(self.user_id, game_token)
        state = self.api.state(self.user_id)
        self.printer.draw_field(
            state["playerGameState"]["playerState"]["field"],
            state["opponentGameState"]["playerState"]["field"])
        return player["userToken"]

    def accepted(self):
        os.system("clear")
        state = self.api.state(self.user_id)
        print("Opponent accepted challenge")
        self.printer.draw_field(
            state["playerGameState"]["playerState"]["field"],
            state["opponentGameState"]["playerState"]["field"])

    def start(self):
        player = self.api.start(self.user_id)
        return player["userToken"], player["gameToken"]

    def shot(self):
        os.system("clear")
        state = self.api.state(self.user_id)
        self.printer.draw_field(
            state["playerGameState"]["playerState"]["field"],
            state["opponentGameState"]["playerState"]["field"])
        if state["playerGameState"]["turn"]:
            print("Your turn")
        else:
            print("Enemy turn")

    def shoot(self, x, y):
        os.system("clear")
        result = self.api.shoot(x, y, self.user_id)
        if result is not None:
            print(result["message"])

        state = self.api.state(self.user_id)
        self.printer.draw_field(
            state["playerGameState"]["playerState"]["field"],
            state["opponentGameState"]["playerState"]["field"])
        if state["playerGameState"]["turn"]:
            print("Your turn")
        else:
            print("Enemy turn")
