Feature: Fight of Flight

  In order to increase the ninja survival rate,
  As a ninja commander
  I want my ninjas to decide whether to attack
  based on their skill levels.

  Background: Night fight setup
    Given the ninja encounters another opponent

  Scenario: Weaker opponent
    Given the ninja has a third level black-belt
    When attacked by a samurai
    Then the ninja should engage the opponent

  Scenario: Stronger opponent
    Given the ninja has a third level black-belt
    When attacked by Chuck Norris
    Then the ninja should run for his life
