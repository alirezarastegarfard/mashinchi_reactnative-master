import {SET_BRANDS, SET_HOME_ITEMS, SET_USER} from './type';

export const setUser = (User) => {

    return {
        type: SET_USER,
        user : User
    }

};

export const setHomeItems = (HomeItems) => {

    return{
        type : SET_HOME_ITEMS,
        homeItems : HomeItems
    }

};

export const setBrands = (Brands) => {

    return {
        type : SET_BRANDS,
        brands : Brands

    }
};

