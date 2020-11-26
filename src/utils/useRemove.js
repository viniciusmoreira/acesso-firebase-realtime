import {useReducer} from 'react';
import axios from 'axios';

const  reducer = (state, action) => {
  if(action.type === 'REQUEST'){
    return {
      ...state,
      loading: true
    }
  }

  if(action.type === 'SUCCESS'){
    return {
      ...state,
      loading: false
    }
  }
  return state;
}

const useRemove = () => {
  const [, dispatch] = useReducer(reducer, {loading: true, data:[]})

  const remove = (url) => {
    axios.delete(url)
      .then(() => {
        dispatch({
          loading: false
        })
      })
  }

  return [remove]
}

export default useRemove;