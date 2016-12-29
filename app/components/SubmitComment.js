import React from 'react';
const PropTypes = React.PropTypes;

class SubmitComment extends React.Component {
	constructor(props) {
		super(props);

		// bound functions
		this.createComment = this.createComment.bind(this);
	}

	createComment(e) {
		e.preventDefault();
		const inputEl = document.querySelector('.comment-text');
		const inputValue = inputEl.value;

		if (inputValue !== '') {
			this.props.onSubmitComment(inputValue);

			// clear out input after submit
			inputEl.value ='';
		}
	}

	render() {
		return (
			<form onSubmit={this.createComment}>
				<input
					className="comment-text"
					type="text"
					placeholder="Enter new comment" />
				<button
					className="submit-button"
					type="submit">
					Submit
				</button>
			</form>
		);
	}
}

SubmitComment.propTypes = {
	onSubmitComment: PropTypes.func.isRequired
};

export default SubmitComment;