/* 
=========================================================
    * Widget for the current Nimiq course in different currencies. 
    * Used API: https://www.coingecko.com/en/api/documentation? 
            * This widget was created by @olipda
========================================================= 


Make sure to copy the whole code


*/


let configs = {
    BaseAPI: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=nimiq-2&order=market_cap_desc&per_page=100&page=1&sparkline=false',
}

let CurrencyEnum = {
    EURO: 'euro',
    USD: 'usd',
    GBP: 'gbp',
    CZK: 'czk',
}

let ColorEnum = {
    RED: '#c91a23',
    GREEN: '#30bf4f',
}

SymboleEnum = {
    [CurrencyEnum.USD]: String.fromCharCode(0x24),
    [CurrencyEnum.EURO]: String.fromCharCode(0x20ac),
    [CurrencyEnum.GBP]: String.fromCharCode(0x163),
    [CurrencyEnum.CZK]: 'Kč',
    [null]: '',
}



var AppControll = function () {

    let refreshIntervalValue = 60;

    class ModelData {
        constructor() {
            this.currency = args.widgetParameter;

            if (this.currency != null) {
                let el = []
                for (var key in CurrencyEnum) {
                    el.push(CurrencyEnum[key])
                }
                if (el.includes(this.currency) == false) {
                    this.currency = 'FAILED'
                }

            }

            this.items = []
        }

        async ReceiveInformationItem(handler) {

            if (this.items.length > 0) {
                this.items.length = 0
            }


            const BaseData = await new Request(configs.BaseAPI, 
                {
                headers: {
                    'cache': 'no-cache'}
                }).loadJSON();
            const el = BaseData[0]


            const item = {
                price: (await this.CurrencyLoader(el.current_price)),
                img: el.image,
                id: el.id,
                changed_price: (await this.LogicalChangeCreator(el.price_change_percentage_24h)),
            }

            this.items = item


            handler(this.items)


        }

        async CurrencyLoader(value) {
            let ch = {}
            switch (this.currency) {
                case CurrencyEnum.EURO:
                    ch.value = (value / 1.16).toFixed(5)
                    break;
                case CurrencyEnum.USD:
                    ch.value = (value / 1).toFixed(5)
                    break;
                case CurrencyEnum.GBP:
                    ch.value = (value / 1.37).toFixed(5)
                    break;
                case CurrencyEnum.CZK:
                    ch.value = (value / 0.046).toFixed(3)
                    break;
                default:
                    ch.value = 'No Currency set'

            }

            ch.value.toString();
            ch.symbole = SymboleEnum[this.currency]

            return ch
        }

        async LogicalChangeCreator(val) {
            let st = {}
            if(val < 0) {
                st.stateSymbole = '';
                st.value = (val / 1).toFixed(2);
                st.stateColor = ColorEnum.RED;
            } else {
                st.stateSymbole = '+';
                st.value = (val / 1).toFixed(2);
                st.stateColor = ColorEnum.GREEN;
            }

            st.value.toString()
            return st
        }


    }

    class ViewModel {
        constructor() {
            this.BuildWidget()

        }

        BuildWidget() {
            let mainWidget = new ListWidget()
            mainWidget.refreshAfterDate = new Date(Date.now() + refreshIntervalValue)
            mainWidget.backgroundColor = Color.black()
            this.widget = mainWidget;
        }

        async VisulizeInformation(items) {

            let mainStack = this.widget.addStack()
            mainStack.setPadding(8, 15, 0, 10);
            mainStack.layoutHorizontally();
            mainStack.centerAlignContent();

            if (items.length == 0) {
                let FailedMsg = mainStack.addText('Failed to fetch');
                FailedMsg.textColor = Color.white();
                FailedMsg.font = Font.systemFont(18);

            } else {

                let req = new Request(items.img.toString());
                let res = await req.loadImage();

                let appIconElement = mainStack.addImage(res)


                appIconElement.imageSize = new Size(45, 45)
                appIconElement.centerAlignImage();
                mainStack.addSpacer(12)


                let logoTextStack = mainStack.addStack();
                logoTextStack.layoutVertically();
                logoTextStack.addSpacer(0);

                let baseText = logoTextStack.addText('NIM');
                baseText.textColor = Color.white();
                baseText.font = Font.systemFont(18);

                let priceChanged = logoTextStack.addText(items.changed_price.stateSymbole + items.changed_price.value + '%');
                priceChanged.textColor = new Color(items.changed_price.stateColor)
                priceChanged.font = Font.systemFont(10);

                this.widget.addSpacer(4)
                let fullCoinName = this.widget.addText('NIMIQ');

                fullCoinName.textColor = Color.white()
                fullCoinName.font = Font.systemFont(12)
                fullCoinName.centerAlignText()

                mainStack.addSpacer(2)
                let amountText = this.widget.addText('1 NIM =')
                amountText.textColor = Color.gray();
                amountText.font = Font.mediumSystemFont(10);
                amountText.centerAlignText()

                this.widget.addSpacer(8);


                let nimiqPrice = this.widget.addText(items.price.value + items.price.symbole)
                nimiqPrice.textColor = Color.orange()
                nimiqPrice.centerAlignText()
                nimiqPrice.font = Font.systemFont(16)
            }

            if (config.runsInApp) {
                Script.setWidget(this.widget);
                Script.complete();
                this.widget.presentSmall()
            } else {
                this.widget.presentSmall();
            }

        }


    }

    class Controller {
        constructor(model, view) {
            this.model = model;
            this.view = view;

            this.handleShowInformation()

        }

        handleShowInformation = async () => {
            this.model.ReceiveInformationItem(this.onDataChanged)

        }

        onDataChanged = async (item) => {
            this.view.VisulizeInformation(item)
        }

    }

    return new Controller(new ModelData, new ViewModel)

}

AppControll();