import {SET_BRANDS} from "../actions/type";

const initialState = {

    BrandId    : null,
    BrandImage : null,
    BrandName  : null

};


export default BrandsReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_BRANDS : {

            const {brands} = action;

            if (brands == null)
                return initialState;

            return brands;

        }

        default:
            return state;

    }

};