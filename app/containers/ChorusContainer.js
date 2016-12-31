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
			comments: [],
			formFocused: false,
			canSend: false,
			username: ''
		};

		// bound functions
		this.handleSubmitComment = this.handleSubmitComment.bind(this);
		this.handleNewCommentAdded = this.handleNewCommentAdded.bind(this);
		this.toggleFormFocus = this.toggleFormFocus.bind(this);
		this.toggleSendBtn = this.toggleSendBtn.bind(this);
		this.handleSubmitUsername = this.handleSubmitUsername.bind(this);

		// set socket.io event handlers
		io.on('chorus:comments:latest', this.handleNewCommentAdded);
	}

	componentDidMount() {
		// set event listener for focus event
		const submitForm = document.querySelector('.text-input');
		submitForm.addEventListener('focus', this.toggleFormFocus);
		submitForm.addEventListener('blur', this.toggleFormFocus);
		submitForm.addEventListener('input', this.toggleSendBtn);

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

	setUserName() {

	}

	toggleFormFocus(e) {
		// toggle blur
		this.setState({
			formFocused: !this.state.formFocused
		});

		// check if input has any text and set btn class
		if (e.target.value.length === 0) {
			this.setState({
				canSend: false
			});
		}
	}

	toggleSendBtn() {
		if (!this.state.canSend) {
			this.setState({
				canSend: !this.state.canSend
			});
		}
	}

	handleNewCommentAdded(comment) {
		// add new comment to comment list
		const allComments = this.state.comments;
		const num = allComments.length + 1;
		const commentObj = JSON.parse(comment);

		console.log(commentObj);
		// create new comment
		const newComment = <Comment
							commentText={commentObj.msg}
							username={commentObj.username}
							time={commentObj.time}
							key={num} />

		allComments.push(newComment);

		this.setState({
			comments: allComments
		});

		// also scroll to bottom of comments list
		const commentsList = document.querySelector('.comments-list');
		commentsList.scrollTop = commentsList.scrollHeight;
	}

	handleSubmitComment(submitText) {
		console.log('client: sending message');
		io.emit('io:comments:new', submitText);
	}

	handleSubmitUsername(username) {
		this.setState({
			username: username
		});

		io.emit('io:users:new', username);
	}

	render() {
		return (
			<div className="main-container">
				<header className="header">chorus</header>
				<CommentsList
					showPromptMsg={this.state.username}
					comments={this.state.comments} />
				<SubmitComment
					username={this.state.username}
					onSubmitComment={this.handleSubmitComment}
					focus={this.state.formFocused}
					canSend={this.state.canSend}
					onSubmitUsername={this.handleSubmitUsername} />
			</div>
		);
	}
}


export default ChorusContainer;
