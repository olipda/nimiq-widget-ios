/* =========================================================
    * Widget for the current Nimiq course in different currencies. 
    * Used API: https://www.coingecko.com/en/api/documentation? 

            * This widget was created by @olipda
========================================================= */


// Make sure to copy the whole code


let currency = args.widgetParameter;

let apiData = await getApiData();

const nimiqLogo = await getNimiqLogo();


let widget = createWidget(); 

    if(config.runsInWidget) {
        Script.setWidget(widget);
        Script.complete();
    } else {
        widget.presentSmall();
}


/* =========================================================
    * important functions *
========================================================= */


async function getApiData() {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=nimiq-2&order=market_cap_desc&per_page=100&page=1&sparkline=false"

    const req = new Request(apiUrl);

    const res = await req.loadJSON();

    let data = {};

    data.price = res.map(obj => obj.current_price);
    data.changedCoursePercentage = res.map(obj => obj.price_change_percentage_24h);
    data.nimiqLogoUrl = res.map(obj => obj.image);

    return data;

}

async function getNimiqLogo() {
    const req = new Request(apiData.nimiqLogoUrl.toString())
    const res = await req.loadImage();

    return res;
}

function getEuroCourse() {
    const euroValue = apiData.price / 1.16;
    return euroValue.toFixed(5);
}

function getUsdCourse() {
    const usdValue = apiData.price / 1;
    return usdValue.toFixed(5)
}

function getPoundCourse() {
    const poundValue = apiData.price / 1.37;
    return poundValue.toFixed(5);
}

function getCzkCourse() {
    const czkValue = apiData.price / 0.046;
    return czkValue.toFixed(3);
}

function selectCurrency () {
    if(currency == "euro") {
        return getEuroCourse().toString() + "€";
    } else if (currency == "usd") {
        return getUsdCourse().toString() + "$";
    } else if (currency == "gbp"){
        return getPoundCourse().toString() + "£";
    } else if (currency == "czk") {
        return getCzkCourse().toString() + "Kč";
    } else { 
        return "No Currency defined";
    }
}

/* =========================================================
    * Design and layout of the widget
========================================================= */

function createWidget() {

    let listwidget = new ListWidget()


    listwidget.refreshAfterDate = new Date(Date.now() + 3600)

    listwidget.backgroundColor = Color.black()

    let logoStack = listwidget.addStack()
    logoStack.setPadding(8, 15, 0, 10);
    logoStack.layoutHorizontally();
    logoStack.centerAlignContent();

    let appIconElement = logoStack.addImage(nimiqLogo)
    appIconElement.imageSize = new Size(45, 45)
    appIconElement.centerAlignImage();
    logoStack.addSpacer(12)

    let logoTextStack = logoStack.addStack();
    logoTextStack.layoutVertically();
    logoTextStack.addSpacer(0);

    let baseText = logoTextStack.addText("NIM");
    baseText.textColor = Color.white();
    baseText.font = Font.systemFont(18);


    let actualValue = apiData.changedCoursePercentage / 1;
    let course = null;

    if(actualValue < 0) {
        course = logoTextStack.addText(actualValue.toFixed(2) + "%")
        course.textColor = Color.red();
    } else {
        course = logoTextStack.addText("+" +actualValue.toFixed(2) + "%")
        course.textColor = Color.green();
    }

    course.font = Font.systemFont(10)

    listwidget.addSpacer(4)
    let fullCoinName = listwidget.addText("NIMIQ");

    fullCoinName.textColor = Color.white()
    fullCoinName.font = Font.systemFont(12)
    fullCoinName.centerAlignText()

    listwidget.addSpacer(2)
    let amountText = listwidget.addText("1 NIM =")
    amountText.textColor = Color.gray();
    amountText.font = Font.mediumSystemFont(10);
    amountText.centerAlignText()

    listwidget.addSpacer(8);

    let nimiqPrice = listwidget.addText(selectCurrency())
    nimiqPrice.textColor = Color.orange()
    nimiqPrice.centerAlignText()
    nimiqPrice.font = Font.systemFont(16)

    return listwidget;

}