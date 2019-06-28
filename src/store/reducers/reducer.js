const INITIAL_STATE = {
    userName: '',
    userID: '',
    isLogin : false,
    // progressBarDisplay : false,
    // type: '',
    errorMessage : '',
    file_url : '',
    file_names: '',
    file_hash: '',
    userprivatekey:[],
    notify:'',
    selection:false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'USER_NAME':
        return({
            ...state,
            userName : action.payload
        })
        case 'CURRENT_USER_UID':
            console.log(action.payload);
            return ({
                ...state,
                userID: action.payload
            })
            case 'IS_LOGIN':
            return ({
                ...state,
                isLogin : action.payload
            })
            // case 'SHOW_PROGRESS_BAR':
            // return ({
            //     ...state,
            //     progressBarDisplay : action.payload
            // })
            case 'ERROR_MESSAGE':
            return({
                ...state,
                errorMessage : action.payload
            })

            case 'Private_Key':
                console.log(action.payload)
                return({
                    ...state,
                    userprivatekey : action.payload
                })

            case 'File_URL':
            return ({
                ...state,
                file_url : action.payload
            })
            case 'FILE_NAMES':
                console.log(action.payload)
            return ({
                
                ...state,
                file_names : action.payload
            })
            case 'File_Hash':
            return ({
                ...state,
                file_hash : action.payload
            })
            case 'NOTIFICATION':
            return ({
                ...state,
                notify : action.payload
            })
            case 'IS_FILE_SELECTED':
                return({
                    ...state,
                    selection : action.payload

                })
            // case 'TYPE':
            // { console.log(action.payload) }
            // return ({
            //   ...state,
            //     type: action.payload
            // })
        default:
            return state;
    }

}