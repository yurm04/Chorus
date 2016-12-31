import React from 'react';
const PropTypes = React.PropTypes;

class SubmitComment extends React.Component {
	constructor(props) {
		super(props);

		// bound functions
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		const inputEl = document.querySelector('.text-input');
		const inputValue = inputEl.value;

		if (inputValue === '') {
			return false;
		}

		// submit input based on if is username or comment
		if (!this.props.username) {
			this.props.onSubmitUsername(inputValue);
		} else {
			this.props.onSubmitComment(inputValue);
		}

		// clear out input after submit
		inputEl.value ='';

		// force blur event
		inputEl.blur();
	}

	render() {
		let isFocused = 'submit-form' + (this.props.focus ? ' focus' : '');
		let canSend   = 'submit-btn' + (this.props.canSend ? ' ready' : '');

		return (
			<form className={isFocused} onSubmit={this.handleSubmit}>
				<input
					className="text-input"
					type="text"
					placeholder={this.props.username ? "Enter new comment" : "Enter your name"} />
				<button
					className={canSend}
					type="submit">
					submit
				</button>
			</form>
		);
	}
}

SubmitComment.propTypes = {
	onSubmitComment: PropTypes.func.isRequired,
	onSubmitUsername: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	focus: PropTypes.bool,
	canSend: PropTypes.bool,
};

export default SubmitComment;