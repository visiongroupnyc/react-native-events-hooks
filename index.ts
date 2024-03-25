import {
	useCallback,
	useState,
	useEffect,
} from 'react';

interface EventCallback {
  (params: any): void;
}

interface Listener {
  callback: EventCallback;
  listenerId: string;
}

interface EventStore {
  [eventName: string]: Listener[];
}

const registeredEvents: EventStore = {};

const listenHandle = (store: EventStore = registeredEvents) => (
  eventName: string,
  callback: EventCallback
): { listenerId: string; store: EventStore } => {
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


const unlistenHandle = (store: EventStore = registeredEvents) => (
  eventName: string,
  listenerId: string
): EventStore => {
  if (!eventName) throw new Error('eventName is required');
  if (!listenerId) throw new Error('listenerId is required');
  if (!store[eventName]) return null;
  store[eventName] = store[eventName].filter((cb) => cb.listenerId !== listenerId);
  return store;
};

const removeAllListenersByEventHandle = (eventName: string): boolean => {
  if (!eventName) throw new Error('eventName is required');
  if (!registeredEvents[eventName]) return false;
  registeredEvents[eventName] = [];
  return true;
};

const emitHandle = (store: EventStore = registeredEvents) => (
  eventName: string,
  params: any
): void => {
  if (!eventName) throw new Error('eventName is required');
  if (store[eventName]) {
    store[eventName].forEach(async (cb) => {
      cb.callback(params);
    });
  }
};

export function getAllEventsName(): string[] {
  return Object.keys(registeredEvents);
}

export function useEvents() {
  const [privateRegisteredEvents, setPrivateRegisteredEvents] = useState<EventStore>({});

  const listen = useCallback((eventName: string, eventCallback: EventCallback): string => {
    const { listenerId } = listenHandle()(eventName, eventCallback);
    return listenerId;
  }, []);

  const listenPrivate = useCallback((eventName: string, eventCallback: EventCallback): string => {
    const { listenerId, store } = listenHandle(privateRegisteredEvents)(eventName, eventCallback);
    setPrivateRegisteredEvents(store);
    return listenerId;
  }, [privateRegisteredEvents]);

  const unlisten = useCallback((eventName: string, listenerId: string) => unlistenHandle()(eventName, listenerId), []);

  const unlistenPrivate = useCallback((eventName: string, listenerId: string) => {
    const store = unlistenHandle(privateRegisteredEvents)(eventName, listenerId);
    setPrivateRegisteredEvents(store);
  }, [privateRegisteredEvents]);

  const emit = useCallback((eventName: string, payload: any) => {
    emitHandle()(eventName, payload);
  }, []);

  const emitPrivate = useCallback((eventName: string, payload: any) => {
    emitHandle(privateRegisteredEvents)(eventName, payload);
  }, [privateRegisteredEvents]);

  const removeAllListenersByEvent = useCallback((eventName: string): boolean => removeAllListenersByEventHandle(eventName), []);

  useEffect(() => {
    return () => setPrivateRegisteredEvents({});
  }, []);

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