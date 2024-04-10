import { combineReducers } from 'redux';
import User from './UserReducer';
import HomeItems from './HomeItemsReducer';
import Brands from './BrandsReducer';


export default combineReducers({
    User,
    HomeItems,
    Brands
});