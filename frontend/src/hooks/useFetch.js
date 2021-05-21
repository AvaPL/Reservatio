import { useState, useEffect } from "react";

export function useFetch(promiseFn, dependencyArray) {
    const [state, setState] = useState({isLoading: true, data: null})

    useEffect(() => {
        setState({isLoading: true, data: null});
        promiseFn().then(async (res) => {
            if (!res.ok) {
                throw new Error(res.code);
            } else {
                const raw = await res.json();
                setState({isLoading: false, data: raw});
            }
        })
            .catch((err) => {
                throw new Error(err)
            })
    }, dependencyArray ? [...dependencyArray] : [])

    return state;
}



