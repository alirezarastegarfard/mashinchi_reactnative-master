import {SET_HOME_ITEMS} from "../actions/type";

const initialState = {
    Title        : null,
    HomeTypeId   : null,
    HomeTypeName : null,
    Items        : null
};


export default HomeItemsReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_HOME_ITEMS : {

            const {homeItems} = action;

            if (homeItems == null)
                return initialState;

            return homeItems;

        }

        default:
            return state;

    }

};