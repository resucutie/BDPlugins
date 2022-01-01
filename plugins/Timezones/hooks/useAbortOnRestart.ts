import { useCallback, useEffect, useRef } from "react";

export default function() {
    const ref = useRef<AbortController>();

    useEffect(() => () => ref.current.abort(), []);

    return useCallback(() => {
        ref.current = new AbortController();
        return ref.current.signal;
    }, []);
}