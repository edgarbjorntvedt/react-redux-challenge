import Container from './util/Container'
import app from './providers/app'
import config from './providers/config'
import redux from './providers/redux'
import routing from './providers/routing'

import layout from './modules/layout/provider'
import kindergarten from './modules/kindergarten/provider'

export default () => {
    let ioc = new Container()

    app(ioc)
    config(ioc)
    redux(ioc)
    routing(ioc)

    // Module providers go here
    layout(ioc)
    kindergarten(ioc)

    return ioc
}