import { useEffect } from 'react'

/**
 * The following types have been copied directly from the `zustand` library (specifically from version 4.4.7), as they
 * didn't export them:
 * - SubscribableStoreSelectorFunction
 * - SubscribableStoreListenerFunction
 * - SubscribableStoreListenerOptions
 * - SubscribableStore (the main type)
 *
 * @see zustand at /middleware/subscribeWithSelector.d.ts
 */
type SubscribableStoreSelectorFunction<TStoreState, USelectedState> = (state: TStoreState) => USelectedState;
type SubscribableStoreListenerFunction<USelectedState> = (selectedState: USelectedState, previousSelectedState: USelectedState) => void;
type SubscribableStoreListenerOptions<USelectedState> = {
    equalityFn?: (a: USelectedState, b: USelectedState) => boolean;
    fireImmediately?: boolean;
}
type UnsubscribeFunction = () => void;

type SubscribableStore<TStoreState> = {
    subscribe: {
        <USelectedState>(
            selector: SubscribableStoreSelectorFunction<TStoreState, USelectedState>,
            listener: SubscribableStoreListenerFunction<USelectedState>,
            options?: SubscribableStoreListenerOptions<USelectedState>
        ): UnsubscribeFunction;
    };
};

/**
 * A thin wrapper for zustand to subscribe to store change events that cleans up (unsubscribes on component unmounting) for you.
 *
 * @param subscribableStore - A subscribable zustand store. That is, the store must be using the `subscribeWithSelector` middleware.
 * @param selector - The state to listen for changes.
 * @param listener - The change listener.
 * @param options - Additional subscription options.
 */
export const useStoreSubscription = <TStoreState, USelectedState>(
    subscribableStore: SubscribableStore<TStoreState>,
    selector: SubscribableStoreSelectorFunction<TStoreState, USelectedState>,
    listener: SubscribableStoreListenerFunction<USelectedState>,
    options?: SubscribableStoreListenerOptions<USelectedState>,
): void => {
    useEffect(() => {
        // Subscribe for changes on mount. Returns the unsubscription callback that is used when unmounted.
        return subscribableStore.subscribe(selector, listener, options);
    }, []);
}