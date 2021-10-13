/* =========================================================

    * Widget for the current Nimiq course in different currencies. *

    * Used API: https://www.coingecko.com/en/api/documentation? *

            * The widget was created by @olipda *

========================================================= */


// Make sure to copy the whole code


const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=nimiq-2&order=market_cap_desc&per_page=100&page=1&sparkline=false"

const req = new Request(apiUrl);

const res = await req.loadJSON();

const nimiqCourse = res.map(obj => obj.current_price)

const nimiqCourseChanged = res.map(obj => obj.price_change_percentage_24h)

const logoUrl = res.map(obj => obj.image)

let currency = args.widgetParameter;

const nimiqLogo = await getNimiqLogo();


let widget = createWidget(); 

if(config.runsInWidget) {
    Script.setWidget(widget);
    Script.complete();
} else {
    widget.presentSmall();
}


/* =========================================================

    * important functions

========================================================= */

async function getNimiqLogo() {
    const req = new Request(logoUrl.toString())
    const res = await req.loadImage();

    return res;
}

function getEuroCourse() {
   const euroValue = nimiqCourse / 1.16;
   return euroValue.toFixed(5);
}

function getUsdCourse() {
    const usdValue = nimiqCourse / 1;
    return usdValue.toFixed(5)
}

function getNimiqChanged() {
    const actualValue = nimiqCourseChanged / 1;
    return actualValue.toFixed(2);
}

function selectCurrency () {
    if(currency == "euro") {
        return getEuroCourse().toString();
    } else if (currency == "usd") {
        return getUsdCourse().toString();
    } else {
        return "No Currency defined";
    }
}

function currencyTitle(widget) {
    if(currency == "euro") {
        return widget.addText("NIM/EUR");
    } else if(currency == "usd") {
        return widget.addText("NIM/USD");
    } else {
        return widget.addText(" --- ");
    }
}


/* =========================================================

    * Design and layout of the widget

========================================================= */

function createWidget() {

    let listwidget = new ListWidget()

    let titleStack = listwidget.addStack()
    let appIconElement = titleStack.addImage(nimiqLogo)
    appIconElement.imageSize = new Size(15, 15)
    appIconElement.cornerRadius = 4
    titleStack.addSpacer(4)

    let titleElement = currencyTitle(titleStack)
    titleElement.textColor = Color.white()
    titleElement.textOpacity = 0.7
    titleElement.font = Font.mediumSystemFont(13)
    listwidget.addSpacer(12)


   let nameElement = listwidget.addText(getNimiqChanged() + "%")
   nameElement.minimumScaleFactor = 0.5
    
    if (getNimiqChanged() < 0) {
        nameElement.textColor = Color.red();
    } else {
        nameElement.textColor = Color.green();
    }

    nameElement.font = Font.systemFont(12)
    listwidget.addSpacer(2)


    let descriptionElement = listwidget.addText(selectCurrency())
    descriptionElement.textColor = Color.white()
    descriptionElement.font = Font.boldSystemFont(18)

    return listwidget;

}