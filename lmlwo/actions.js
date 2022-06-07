import { doGet, doPost, doPut } from '../../../utils/apiActions';
import { handleError, notify } from '../../../general/notification/notification_action';
import { modifyLoader } from '../../../general/loader/loader_action';

export const FETCH_LIST = 'LMLWO_FETCH_LIST';
export const FETCH_DOCUMENT = 'LMLWO_FETCH_DOCUMENT';
export const CLEAR_LIST = 'LMLWO_CLEAR_LIST';

export const fetchList = params => {
    return function(dispatch) {
        dispatch(modifyLoader(true));
        doGet(`core/logistics/write-off-lost`, {...params, size: 20})//2147483647
            .then(({ data }) => {
                dispatch(modifyLoader(false));
                dispatch({
                    type: FETCH_LIST,
                    data,
                });
            })
            .catch(error => {
                dispatch(modifyLoader(false));
                handleError(error, dispatch);
            });
    };
};

export const clearList = () => {
    return function(dispatch) {
        dispatch({
            type: CLEAR_LIST,
        });
    };
};
export const fetchDocument = id => {
    return function(dispatch) {
        dispatch(modifyLoader(true));
        doGet(`core/logistics/write-off-lost/${id}`)
            .then(({data})=>{
                dispatch(modifyLoader(false));
                dispatch({
                    type: FETCH_DOCUMENT,
                    data,
                });
            })
            .catch(error => {
                dispatch(modifyLoader(false));
                handleError(error, dispatch);
            });
    };
};

