import {SET_USER} from "../actions/type";

const initialState = {

    ID: null,
    UserName: null,
    Mobile: null,
    Email: null,
    Token: null

};


export default UserReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_USER : {

            const {user} = action;

            if (user == null)
                return initialState;

            return user;

        }

        default:
            return state;

    }

};