Feature: Login and Testing Search Funcitonality
  Scenario: Visiting Login Page
    Given I am on the Login Page
    Then the page title is "ProEvento-Login"
  Scenario: Login with incorrect password
    Given I am on the Login Page
    When I input userName "jack" and password "321"
    Then the alert message "wrong combination!" pops up
  Scenario: Login with correct password
    Given I am on the Login Page
    When I input userName "jack" and password "123"
    Then the page title is "ProEvento"
  Scenario: Visiting Search Page
    When I click Search Button on the navbar
    Then the page title is "ProEvento-Plaza"
  Scenario: Search people by name
    When I search for "jack"
    Then the outcome should display "jack"