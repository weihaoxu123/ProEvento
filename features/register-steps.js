const { Given, When, Then } = require('cucumber');
const { Builder } = require('selenium-webdriver');
const driver = new Builder().forBrowser('chrome').build();
const assert=require('assert');

Given('I am on the Register Page', {timeout:30*1000},async function () {
    await driver.get('http://localhost:3000/register');
});
Then('the current page title is {string}', async function (string) {
  driver.ignoreSynchronization = true
  driver.sleep(2000)
    assert.equal(await driver.getTitle(), string);
  });

  When('I signup with userName {string} and password {string}',async function(userName,password){
    const user_name= (await driver).findElement({id:"input1"})
    user_name.sendKeys(userName)
    const pass_word= (await driver).findElement({id:"input2"})
    pass_word.sendKeys(password)
    const confirm_pass_word= (await driver).findElement({id:"input3"})
    confirm_pass_word.sendKeys(password)
    await (await (await driver).findElement({className:"login"})).click()
})
Then('the alert message {string} will pop up', async function (string) {
    driver.ignoreSynchronization = true
    driver.sleep(2000)
    const alert = await driver.switchTo().alert()
    assert.equal( await alert.getText(), string);
    alert.accept()
  });