import { useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const INITIAL_STATE = {
  loading: false,
  data: {}
}

const reducer = (state, action) => {
  if(action.type === 'REQUEST'){
    return {
      ...state,
      loading: true
    }
  }

  if(action.type === 'SUCCESS'){
    return {
      ...state,
      loading: false,
      data: action.data
    }
  }

  return state;
}

const init = baseUrl => {  
 
  const useGet = resource => {
    const [data, dispatch] = useReducer(reducer, INITIAL_STATE);

    const refetch = useCallback(async() => {
      dispatch({type: 'REQUEST'})
      const res = await axios.get(baseUrl + resource + '.json')
      dispatch({type: 'SUCCESS', data: res.data ? res.data : {}});
    },[resource])
  
    useEffect(() => {
      refetch();
    }, [resource, refetch]);

    return {
      ...data,
      refetch
    };
  }

  const usePost = (resource) => {
    const [data, dispatch] = useReducer(reducer, INITIAL_STATE)
  
    const post = async(data) => {
      dispatch({type: 'REQUEST'});
      const res = await axios.post(baseUrl + resource + '.json', data)
      dispatch({type:'SUCCESS', data: res.data})
    }
  
    return {
      data, 
      post
    }
  }

  const useRemove = resource => {
    const [, dispatch] = useReducer(reducer, INITIAL_STATE)
  
    const remove = async(id) => {
      dispatch({type: 'REQUEST'});
      await axios.delete(baseUrl + resource + id + '.json')
      dispatch({type: 'SUCCESS' })
    }
  
    return {
      remove
    }
  }

  const usePatch = resource => {
    const [, dispatch] = useReducer(reducer, INITIAL_STATE)
  
    const patch = async(data) => {
      dispatch({type: 'REQUEST'});
      await axios.patch(baseUrl + resource + '.json', data)
      dispatch({type: 'SUCCESS' })
    }
  
    return {
      patch
    }
  }

  return {
    useGet,
    usePost,
    useRemove,
    usePatch
  }

}

export default init;