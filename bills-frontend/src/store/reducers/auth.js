import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    error: null,
    loading: false,
    billSet: {
        openFilters: false,
        filterProducts: [],
        filterStartDate: '',
        filterEndDate: '',
        filterAmountMin: '',
        filterAmountMax: '',
        searchQuery: null,
        order: null,
        orderBy: null,
        page: null,
        rowsPerPage: null
    },
    itemSet: {
        openFilters: false,
        filterRateMin: '',
        filterRateMax: '',
        filterStartDate: '',
        filterEndDate: '',
        searchQuery: null,
        order: null,
        orderBy: null,
        page: null,
        rowsPerPage: null
    },
    customerSet: {
        openFilters: false,
        filterStartDate: '',
        filterEndDate: '',
        searchQuery: null,
        order: null,
        orderBy: null,
        page: null,
        rowsPerPage: null
    },
    user: null
}

const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    })
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        error: null,
        loading: false
    })
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    })
}

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null
    })
}

const updateBillSet = (state, action) => {
    return updateObject(state, {
        billSet: action.billSet
    })
}

const updateItemSet = (state, action) => {
    return updateObject(state, {
        itemSet: action.itemSet
    })
}

const updateCustomerSet = (state, action) => {
    return updateObject(state, {
        customerSet: action.customerSet
    })
}


const addUser = (state, action) => {
    return updateObject(state, {
        user: action.user
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.BILLSET_UPDATE: return updateBillSet(state, action);
        case actionTypes.ITEMSET_UPDATE: return updateItemSet(state, action);
        case actionTypes.CUSTOMERSET_UPDATE: return updateCustomerSet(state, action);
        case actionTypes.USER_ADDED: return addUser(state, action);
        default:
            return state;

    }
}

export default reducer;