from api import Api
from printer import BasePrinter, DefaultPrinter


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
        player = self.api.start_game(self.user_id, game_token)
        state = self.api.state(self.user_id)
        self.printer.draw_field(state["player"]["state"]["field"],
                                state["enemy"]["state"]["field"])
        return player["token"]

    def accepted(self):
        state = self.api.state(self.user_id)
        self.printer.draw_field(state["player"]["state"]["field"],
                                state["enemy"]["state"]["field"])

    def start(self):
        player = self.api.start_game(self.user_id)
        return player["token"]

    def reset(self):
        self.api.reset()

    def shot(self):
        state = self.api.state(self.user_id)
        self.printer.draw_field(state["player"]["state"]["field"],
                                state["enemy"]["state"]["field"])

    def shoot(self, x, y):
        self.api.shoot(x, y, self.user_id)
        state = self.api.state(self.user_id)
        self.printer.draw_field(state["player"]["state"]["field"],
                                state["enemy"]["state"]["field"])
