Feature: The Internet Guinea Pig Website

  Scenario Outline: As a user, I can login

    Given I am on the login page
    When I login with <mail>

    Examples:
      | mail | 
      | alon2.gold2022@gmail.com |
