import { useEffect } from "react";
import { gameplayStoreState } from "../store/gameplay";

export const useTimer = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            gameplayStoreState().incrementTimeElapsed();
        }, 1000);

        return () => clearInterval(interval);
    }, [])
}