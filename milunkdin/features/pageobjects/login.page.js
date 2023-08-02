

const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ProfilePage extends Page {
    /**
     * define selectors using getter methods
     */
    get loginBtn() {
        return $('#login')
    }

    get inputMail() {
        return $('#identifierId')
    }
    get nextGoogle() {
        return $('#identifierNext')
    }
    get inputUsername () {
        return $('#username');
    }

    get inputPassword () {
        return $('#password');
    }

    get btnSubmit () {
        return $('button[type="submit"]');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login (mail) {
        await this.loginBtn.click()
        await browser.url(`https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?response_type=code&client_id=569622480688-ra532tnkohts5hutsdvj2cgsl0p1fot6.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fmiluinkedin.firebaseapp.com%2F__%2Fauth%2Fhandler&state=AMbdmDl68Mp3owjzJSKn5KrDmKRumlMD7X8XfllTqE8dkaUQ8ZlJzV2A05FfnvWGJN6JhTG2zjUnKRBC7-EwiclruD9uzMW9-pqmUmzwyuCWjhoO-0XB8xjhnD4uu97cN-1yKs5EuPM9u7wVXWqymm_yAbuMNBKJspiv854tCYF7JURY2UThd-07gRNMZCYB9RgstJN_NwsBcx6RfqZiyTFD3_X9LZJRqlG8Fg1sCsLrgqfIsnujVFEKOU_4Ki3cfz-GFSQ1r2JQi9QpIvm1pLfi0MFzPhzGPQDmdjRKOFTXzMPY2ruE6fPACvH__qV-sPqkDh-m&scope=openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20profile&context_uri=http%3A%2F%2Flocalhost%3A3000&flowName=GeneralOAuthFlow`)
        await this.inputMail.setValue(mail);
        await this.nextGoogle.click()
        // await this.inputPassword.setValue(password);
        // await this.btnSubmit.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    open () {
        return super.open('search');
    }
}

module.exports = new ProfilePage();
