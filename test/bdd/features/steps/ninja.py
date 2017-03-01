
from behave import given, when, then
from hamcrest import assert_that, equal_to, is_not

# ----------------------------------------------------------------------------
# PROBLEM DOMAIN:
# ----------------------------------------------------------------------------
class NinjaFight(object):
    """
    Domain model for ninja fights.
    """
    # pylint: disable=R0903

    def __init__(self, with_ninja_level=None):
        self.with_ninja_level = with_ninja_level
        self.opponent = None

    def decision(self):
        """
        Business logic how a Ninja should react to increase his survival rate.
        """
        assert self.with_ninja_level is not None
        assert self.opponent is not None
        if self.opponent == "Chuck Norris":
            return "run for his life"
        if "black-belt" in self.with_ninja_level:
            return "engage the opponent"
        else:
            return "run for his life"

@given('the ninja encounters another opponent')
def step_the_ninja_ecnounters(context):
    if hasattr(context, "ninja_fight"):
        assert_that(context.ninja_fight, is_not(equal_to(None)))
    context.ninja_fight = None

@given('the ninja has a {achievement_level}')
def step_the_ninja_has_a(context, achievement_level):
    context.ninja_fight = NinjaFight(achievement_level)

@when('attacked by a {opponent_role}')
def step_attacked_by_a(context, opponent_role):
    context.ninja_fight.opponent = opponent_role

@when('attacked by {opponent}')
def setp_attacked_by(context, opponent):
    context.ninja_fight.opponent = opponent

@then('the ninja should {reaction}')
def step_the_ninja_should(context, reaction):
    assert_that(reaction,
                equal_to(context.ninja_fight.decision()))
