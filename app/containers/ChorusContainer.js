import React from 'react';
import CommentsList from '../components/CommentsList';
import SubmitComment from '../components/SubmitComment';
import Comment from '../components/Comment';
const PropTypes = React.PropTypes;


class ChorusContainer extends React.Component {
	constructor(props) {
		super(props);

		// replaces getInitialState() from regulat createClass()
		this.state = {
			comments: []
		};

		// bound functions
		this.handleSubmitComment = this.handleSubmitComment.bind(this);
	}

	handleSubmitComment(submitText) {
		// add new comment to comment list
		const allComments = this.state.comments;
		const nextKey = allComments.length + 1;

		// create new comment
		const newComment = <Comment commentText={submitText} key={nextKey} />
		allComments.push(newComment);

		this.setState({
			comments: allComments
		});
	}

	render() {
		return (
			<div className="main-containter">
				<CommentsList
					comments={this.state.comments} />
				<SubmitComment
					onSubmitComment={this.handleSubmitComment} />
			</div>
		);
	}
}

ChorusContainer.propTypes = {
	comments: PropTypes.array
};

export default ChorusContainer;
