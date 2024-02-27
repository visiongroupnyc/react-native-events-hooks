# react-native-events-hooks
La librería proporciona un mecanismo flexible y potente para la gestión de eventos dentro de aplicaciones React Native. Permite a los componentes suscribirse a eventos específicos y reaccionar a ellos, facilitando la comunicación entre componentes dispersos a través de la aplicación sin necesidad de prop drilling o contextos complejos. Ofrece funcionalidades para manejar tanto eventos globales, compartidos a través de toda la aplicación, como eventos privados, limitados al ámbito de un componente individual, ofreciendo así una gran versatilidad en la gestión de la comunicación entre componentes.


![React Native Events Hook logo](./assets/react-native-events-hook.png)


- [react-native-events-hooks](#react-native-events-hooks)
- [install](#install)
- [Características Principales](#características-principales)
	- [Manejo de Eventos Globales y Privados](#manejo-de-eventos-globales-y-privados)
	- [Gestión de Suscripciones a Eventos](#gestión-de-suscripciones-a-eventos)
	- [Limpieza Automática](#limpieza-automática)
	- [Flexibilidad de Implementación](#flexibilidad-de-implementación)
	- [Generación de IDs Únicos para Listeners](#generación-de-ids-únicos-para-listeners)
- [useEvents](#useevents)
	- [listen y listenPrivate](#listen-y-listenprivate)
	- [emit y emitPrivate](#emit-y-emitprivate)
	- [unlisten y unlistenPrivate](#unlisten-y-unlistenprivate)
	- [removeAllListenersByEvent](#removealllistenersbyevent)
- [getAllEventsName](#getalleventsname)
- [Aspectos Destacados de la Implementación](#aspectos-destacados-de-la-implementación)
- [Uso Recomendado](#uso-recomendado)
- [Ejemplo](#ejemplo)



# install
```bash
$ npm install react-native-events-hooks --save
```

# Características Principales

## Manejo de Eventos Globales y Privados
Permite a los componentes escuchar y emitir eventos tanto de forma global como privada. Los eventos globales son accesibles en toda la aplicación, mientras que los eventos privados se limitan al componente que los crea.

## Gestión de Suscripciones a Eventos
Los componentes pueden registrarse para escuchar eventos específicos y definir callbacks que se ejecutarán cuando esos eventos sean emitidos.

## Limpieza Automática
Incorpora mecanismos para limpiar automáticamente los listeners de eventos privados cuando el componente se desmonta, previniendo así fugas de memoria.

## Flexibilidad de Implementación
Proporciona una API sencilla y flexible, haciendo que la integración y el uso de la librería en proyectos existentes sea fácil y directa.

## Generación de IDs Únicos para Listeners
Utiliza una generación simple pero efectiva de identificadores únicos para los listeners de eventos, facilitando la gestión y eliminación de suscripciones a eventos.

# useEvents

useEvents es un hook que nos proporcionará una lista de métodos para poder operar con nuestros eventos.

```javascript
function MyBox({ boxId }) {
	const {
		listen,
		unlisten,
		emit,
	} = useEvents();
	...
```

## listen y listenPrivate
Para suscribirse a eventos globales o privados, respectivamente. Los callbacks registrados a través de estos métodos se invocarán cuando el evento correspondiente sea emitido.
Ambos método retornan un `listenerId`.
Es importante entender que a la hora de realizar el `listen` o `listenPrivate`, se deberá realizar dentro de un `useEffect`, para evitar múltiples subscripciones al mismo evento.

```javascript
useEffect(() => {
	const listenerId = listen('backgroundChage', (payload) => {
		if (payload.boxId === boxId) {
			setBackgroundColor(payload.backgroundColor);
		}
	});

	const listener2Id = listen('resetBoxState', () => setBackgroundColor('#efefef'));

	return () => {
		unlisten('backgroundChage', listenerId);
		unlisten('resetBoxState', listener2Id);
	};
}, []);

```

## emit y emitPrivate
```javascript
export default function App() {
	const {
		emit,
	} = useEvents();

	return (
		<Button
			style={styles.btn}
			title="Reset"
			onPress={() => emit('resetBoxState')}
		/>
	);
}
```

## unlisten y unlistenPrivate
Estos métodos eliminan los listeners de un evento.
Es requerido el `eventName` y `listenerId`.

```javascript
useEffect(() => {
	const listenerId = listen('backgroundChage', (payload) => {
		if (payload.boxId === boxId) {
			setBackgroundColor(payload.backgroundColor);
		}
	});

	const listener2Id = listen('resetBoxState', () => setBackgroundColor('#efefef'));

	return () => {
		unlisten('backgroundChage', listenerId);
		unlisten('resetBoxState', listener2Id);
	};
}, []);
```

## removeAllListenersByEvent
Elimina todos los listeners de un `eventName`.

# getAllEventsName
Este método nos permitirá obtener todos los eventos registrados hasta el momento.

```javascript
import { getAllEventsName } from 'react-native-events-hook';
```


# Aspectos Destacados de la Implementación

- Eventos Globales y Privados: La distinción entre eventos globales y privados permite a los componentes manejar eventos específicamente dentro de su propio ámbito o compartir eventos en toda la aplicación, según sea necesario.

- Gestión del Estado para Eventos Privados: Utilizar useState para almacenar eventos privados permite a los componentes tener su propio conjunto de listeners que no afectan ni son afectados por otros componentes, a menos que explícitamente se comparta la información.

# Uso Recomendado
Esta librería es ideal para aplicaciones React que requieren una gestión compleja de la comunicación entre componentes, especialmente en casos donde el prop drilling o el uso excesivo de contextos se vuelve impracticable. Es especialmente útil en aplicaciones grandes y modulares, donde la separación de preocupaciones y la eficiencia en la comunicación entre componentes son críticas para el mantenimiento y la escalabilidad.


# Ejemplo
El ejemplo proporcionado ilustra cómo utilizar useEvents para crear una dinámica interactiva donde múltiples "cajas" pueden cambiar de color de forma aleatoria o resetearse a un estado inicial. Esto demuestra la potencia de react-native-events-hooks para facilitar interacciones complejas entre componentes de forma eficiente y con código reducido.

![Ejemplo de uso](./assets/example2.gif)


```javascript
import {
	useState,
	useEffect,
} from 'react';

import {
	View,
	StyleSheet,
	Text,
	Button,
} from 'react-native';

import {
	useEvents,
} from 'react-native-events-hooks';

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: '#FF0000',
		flex: 1,
		marginTop: 40,
	},
	btn: {
		marginTop: 10,
		backgroundColor: '#333333',
	},
	boxes: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		alignContent: 'center',
		flexWrap: 'wrap',
		padding: 4,
	},
	box: {
		marginVertical: 2,
		marginHorizontal: 2,
		borderWidth: 1,
		borderColor: 'green',
		width: 50,
		height: 50,
		alignItems: 'center',
		padding: 4,
	},
});

function MyBox({ boxId }) {
	const {
		listen,
		unlisten,
	} = useEvents();
	const [backgroundColor, setBackgroundColor] = useState('#efefef');

	useEffect(() => {
		const listenerId = listen('backgroundChage', (payload) => {
			if (payload.boxId === boxId) {
				setBackgroundColor(payload.backgroundColor);
			}
		});

		const listener2Id = listen('resetBoxState', () => setBackgroundColor('#efefef'));

		return () => {
			unlisten('backgroundChage', listenerId);
			unlisten('resetBoxState', listener2Id);
		};
	}, []);

	console.info('rendering box: ', boxId);
	return (
		<View
			style={[styles.box, { backgroundColor }]}
		>
			<Text>{`${boxId}`}</Text>
		</View>
	);
}

export default function App() {
	const [totalBoxes] = useState(60);
	const [runRandomColors, setBackgroundColors] = useState(false);

	const {
		emit,
	} = useEvents();

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (!runRandomColors) return;
			emit('backgroundChage', {
				backgroundColor: `#${Math.round(Math.random() * 16777215).toString(16).toUpperCase()}`,
				boxId: Math.round(Math.random() * (totalBoxes - 1)),
			});
		}, 300);

		return () => clearInterval(intervalId);
	}, [runRandomColors]);

	return (
		<View style={styles.container}>
			<Button
				style={styles.btn}
				title={`${runRandomColors ? 'Randoms enabled' : 'Randoms disabled'}`}
				onPress={() => setBackgroundColors((prev) => !prev)}
			/>
			<Button
				style={styles.btn}
				title="Reset"
				onPress={() => emit('resetBoxState')}
			/>
			<View style={styles.boxes}>
				{[...Array(totalBoxes)].map((a, index) => (
					<MyBox
						key={`box-${index}`}
						boxId={index}
					/>
				))}
			</View>
		</View>
	);
}

```