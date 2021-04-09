Feature: Register
  Scenario:Visiting Register Page
    Given I am on the Register Page
    Then the current page title is "ProEvento-Register"
  Scenario: Register with user that already exists
    When I signup with userName "jack" and password "123"
    Then the alert message "user already existed!" will pop up
  Scenario: Register with user that doesn't exists
    When I signup with userName "juice" and password "123"
    Then the current page title is "ProEvento"