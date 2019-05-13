from abc import ABC, abstractmethod


class BasePrinter(ABC):
    @abstractmethod
    def draw_field(self, first_player, second_player):
        pass


class DefaultPrinter(BasePrinter):
    def draw_field(self, first_player, second_player):
        zipped = list(zip(list(zip(*first_player)), list(zip(*second_player))))
        for tpl in zipped:
            print(tpl)