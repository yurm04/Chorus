import React from 'react';
import CommentsList from '../components/CommentsList';
import SubmitComment from '../components/SubmitComment';
import Comment from '../components/Comment';
import getAllComments from '../utils/helpers';
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
		this.handleNewCommentAdded = this.handleNewCommentAdded.bind(this);

		// set socket.io event handlers
		io.on('chorus:comments:latest', this.handleNewCommentAdded);
	}

	componentDidMount() {
		getAllComments()
		.then((res) => {
			const comments = res.data;

			// map comments array with comment handler and render
			comments.map(this.handleNewCommentAdded);
		})
		.catch((err) => {
			console.warn('OH NO', err);
		});
	}

	handleNewCommentAdded(comment) {
		// add new comment to comment list
		const allComments = this.state.comments;
		const num = allComments.length + 1;
		const commentObj = JSON.parse(comment);

		// create new comment
		const newComment = <Comment commentText={commentObj.msg} key={num}/>
		allComments.push(newComment);

		this.setState({
			comments: allComments
		});
	}

	handleSubmitComment(submitText) {
		console.log('client: sending message');
		io.emit('io:comments:new', submitText);
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
