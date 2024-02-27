import {
	useCallback,
	useState,
	useEffect,
} from 'react';

const registeredEvents = {};

const listenHandle = (store = registeredEvents) => (eventName, callback) => {
	if (!eventName) throw new Error('eventName is required');
	if (!callback || typeof callback !== 'function') throw new Error('eventCallback is required');
	if (!store[eventName]) store[eventName] = [];

	const listenerId = `${Math.random().toString(32)}-${Math.random().toString(32)}-${Math.random().toString(32)}`;

	store[eventName].push({
		callback,
		listenerId,
	});

	return {
		listenerId,
		store,
	};
};

const unlistenHandle = (store = registeredEvents) => (eventName, listenerId) => {
	if (!eventName) throw new Error('eventName is required');
	if (!listenerId) throw new Error('listenerId is required');
	if (!store[eventName]) return null;
	store[eventName] = store[eventName].filter((cb) => cb.listenerId !== listenerId);
	return store;
};

const removeAllListenersByEventHandle = (eventName) => {
	if (!eventName) throw new Error('eventName is required');
	if (!registeredEvents[eventName]) return null;
	registeredEvents[eventName] = [];
	return true;
};

const emitHandle = (store = registeredEvents) => (eventName, params) => {
	if (!eventName) throw new Error('eventName is required');
	if (store[eventName]) {
		store[eventName].forEach(async (cb) => {
			cb.callback(params);
		});
	}
};

export function getAllEventsName() {
	return Object.keys(registeredEvents);
}

export function useEvents() {
	const [privateRegisteredEvents, setPrivateRegisteredEvents] = useState({});

	const listen = useCallback((eventName, eventCallback) => {
		const { listenerId } = listenHandle()(eventName, eventCallback);
		return listenerId;
	}, []);

	const listenPrivate = useCallback((eventName, eventCallback) => {
		const { listenerId, store } = listenHandle(privateRegisteredEvents)(eventName, eventCallback);
		setPrivateRegisteredEvents(store);
		return listenerId;
	}, []);

	const unlisten = useCallback((eventName, listenerId) => unlistenHandle()(eventName, listenerId), []);

	const unlistenPrivate = useCallback((eventName, listenerId) => {
		const store = unlistenHandle(privateRegisteredEvents)(eventName, listenerId);
		setPrivateRegisteredEvents(store);
	}, []);

	const emit = useCallback((eventName, payload) => {
		emitHandle()(eventName, payload);
	}, []);

	const emitPrivate = useCallback((eventName, payload) => {
		emitHandle(privateRegisteredEvents)(eventName, payload);
	}, []);

	const removeAllListenersByEvent = useCallback(removeAllListenersByEventHandle, []);

	useEffect(() => setPrivateRegisteredEvents({}), []);

	return {
		listen,
		listenPrivate,
		emit,
		emitPrivate,
		unlisten,
		unlistenPrivate,
		removeAllListenersByEvent,
	};
}
