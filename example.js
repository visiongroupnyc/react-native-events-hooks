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
} from 'react-native-events-hook';

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
