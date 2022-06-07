import {
    FETCH_LIST,
    FETCH_DOCUMENT,
} from './actions';

const INITIAL_STATE = {
    list: [],
    document: {},
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_LIST:
            return {
                ...state,
                list: [...action.data.content],
            };
        case FETCH_DOCUMENT:
            return {
                ...state,
                document: action.data,
            };
        default:
            return state;
    }
}