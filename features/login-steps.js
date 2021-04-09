const { Given, When, Then } = require('cucumber');
const { Builder } = require('selenium-webdriver');
const driver = new Builder().forBrowser('chrome').build();
const assert=require('assert');

Given('I am on the Login Page', {timeout:30*1000},async function () {
    await driver.get('http://localhost:3000/login');
});


Then('the page title is {string}', async function (string) {
  assert.equal(await driver.getTitle(), string);
});

When('I input userName {string} and password {string}',async function(userName,password){
    const user_name= (await driver).findElement({id:"input1"})
    user_name.sendKeys(userName)
    const pass_word= (await driver).findElement({id:"input2"})
    pass_word.sendKeys(password)
    await (await (await driver).findElement({className:"login"})).click()
})

Then('the alert message {string} pops up', async function (string) {
    // driver.ignoreSynchronization = true
    driver.sleep(1000)
    const alert = await driver.switchTo().alert()
    assert.equal( await alert.getText(), string);
    alert.accept()
  });
  When('I click Search Button on the navbar',async function(){
    await (await (await driver).findElement({id:"SearchTag"})).click()
})
When("I search for {string}",async function(string){
    await (await (await driver).findElement({id:"people"})).sendKeys(string)
})
Then("the outcome should display {string}",async function(string){
    const card_title=await driver.findElement({id:"peopleName"})
    assert.equal( await card_title.getText(), string);
    // return "pending"
})