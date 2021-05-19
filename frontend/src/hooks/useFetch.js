import { useState, useEffect } from "react";

export function useFetch(promiseFn, dependencyArray) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        setLoading(true);
        promiseFn().then(async (res) => {
            if (!res.ok) {
                setData({status: false, raw: res.code});
            } else {
                const raw = await res.json();
                setData({status: true, raw});
            }
        })
            .catch((err) => setData({status: false, raw: err}))
            .finally(() => setLoading(false))
    }, dependencyArray ? [...dependencyArray] : [])

    return isLoading ? ({ isLoading, status: false, data: null }) : ({ isLoading, status: data.status, data: data.raw })
}



