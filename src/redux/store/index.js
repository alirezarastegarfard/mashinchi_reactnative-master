import { createStore , applyMiddleware , compose } from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from "redux-logger";
import reducers from '../reducers';

const middleware = [ thunk ];

if (__DEV__)
    middleware.push(createLogger());

const Store = createStore(

    reducers ,
    undefined,
    compose(
        applyMiddleware(...middleware)
    )
);

export default Store;