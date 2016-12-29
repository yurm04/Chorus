import React from 'react';
import ReactDOM from 'react-dom';
import ChorusContainer from './containers/ChorusContainer';

class Chorus extends React.Component {
	constructor(props) {
		super(props);
		self.io = io();
	}

	render() {
		return (
			<ChorusContainer />
		);
	}
}

ReactDOM.render(
	<Chorus />,
	document.getElementById('chorus')
)