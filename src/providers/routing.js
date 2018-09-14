import {connect} from 'react-redux'
import {connectRoutes, NOT_FOUND} from 'redux-first-router'
import RouteRenderer from '../components/RouteRenderer'
import createHistory from 'history/createBrowserHistory'

export const ROUTES = {
    ROUTE_MAIN: 'ROUTE_MAIN',
    ROUTE_DETAILS: 'ROUTE_DETAILS'
}

export default ioc => {
    ioc.service('RouteMap', ioc => {
        return {
            [ROUTES.ROUTE_MAIN]: {
                path: `/`,
                thunk: async (dispatch, getState) => {
                    /** @type {KindergartenAction} kindergartenAction */
                    const kindergartenAction = ioc['Kindergarten.KindergartenAction']
                    kindergartenAction.loadCounties()
                }
            },
            [ROUTES.ROUTE_DETAILS]: {
                path: `/:kindergartenId`,
                thunk: async (dispatch, getState) => {
                    /** @type {KindergartenAction} kindergartenAction */
                    const kindergartenAction = ioc['Kindergarten.KindergartenAction']
                    kindergartenAction.loadKindergartenDetails(getState().location.payload.kindergartenId)
                }
            },
            [NOT_FOUND]: {
                thunk: async (dispatch, getState) => {
                    window.location.replace(ioc['CONFIG']['ROUTE_PREFIX'])
                }
            }
        }
    })

    // Used by the RouteRenderer component when it chooses what component to render
    ioc.service('RouteToComponentMap', ioc => {
        return {
            [ROUTES.ROUTE_MAIN]: ioc['Kindergarten.App'],
            [ROUTES.ROUTE_DETAILS]: ioc['Kindergarten.Details']
        }
    })

    ioc.service('RouteRenderer', ioc => connect(state => ({route: state.route}))(RouteRenderer(ioc['RouteToComponentMap'])))

    // Store the current route to redux state.
    // The RouteRenderer component uses the state (the route) and the RouteToComponentMap to choose a component to render
    // NB: Define this reducer in this file just because we then have all routing stuff in the same place
    ioc.service('routeReducer', ioc => {
        const routes = Object.values(ROUTES)

        return function(state = ROUTES.ROUTE_MAIN, action){
            if(routes.includes(action.type)){
                return action.type
            }
            return state
        }
    })

    ioc.service('ReduxFirstRouter', ioc => {
        return connectRoutes(createHistory(), ioc['RouteMap'], {initialDispatch: false}) // NB: Prevent initial dispatch. Do that after container is finished setting up to avoid routing before the ioc container is created.
    })
}