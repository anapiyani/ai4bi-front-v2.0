// here we will create a hook that will allow us to use a state with a callback
import { useCallback, useEffect, useRef, useState } from 'react'

const useStateWithCallBack = (initialState: any) => {
	const [state, setState] = useState<any>(initialState);
	const cbRef = useRef<any>(null);

	const updateState = useCallback((newState: any, cb: any) => {
		cbRef.current = cb;
		setState((prev: any) => typeof newState === 'function' ? newState(prev) : newState);
	}, []);

	useEffect(() => {
		if (cbRef.current) {
			cbRef.current(state);
			cbRef.current = null;
		}
	}, [state]);

	return [state, updateState];
}

export default useStateWithCallBack;