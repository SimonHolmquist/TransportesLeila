﻿//import { useState } from "react";

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected: false};
        this.handleSelected = this.handleSelected.bind(this);
    }
    async handleSelected(e)
    {
        await this.setState({ selected: !(e.target.selected) });
        if(this.state.selected) console.log(this);
    }
    render() {
        return (
            <tr style={{ backgroundColor: this.props.verified ? 'yellow' : '' }}>
                <td>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        selected={this.state.selected}
                        onClick={this.handleSelected}
                    />
                </td>
                <td>{this.props.id}</td>
                <td>{this.props.author}</td>
                <td>{this.props.children}</td>
            </tr>
        );
    }
}

class CommentList extends React.Component {
    render() {
        const commentNodes = this.props.data.map(comment => (
            <Comment
                author={comment.author}
                key={comment.id}
                id={comment.id}
                verified={comment.verified}
            >
                {comment.text}
            </Comment>
        ));
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Select</th>
                        <th scope="col">#</th>
                        <th scope="col">Author</th>
                        <th scope="col">Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {commentNodes}
                </tbody>
            </table>
        );
    }
}

class SearchComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: '' };
        this.handleIdChange = this.handleIdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleIdChange(e) {
        this.setState({ id: e.target.value });
        this.props.onSearch({ id: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        const id = this.state.id.trim();
        this.props.onSearch({ id: id });
        this.setState({ id: '' });
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Comment Id"
                    value={this.state.id}
                    onChange={this.handleIdChange}
                />
                <input type="submit" value="search" />
            </form>
        );
    }
}

class Check extends React.Component {
    constructor(props){
        super(props);
        //this.state = { toChek = [] };
    }
    render() {
        return (
            <button
                className="btn btn-success"
                value="Check"
                onClick={this.props.onCheck}
            >
                Check
            </button>
        );
    }
}

class CommentForm extends React.Component {

    constructor(props) {

        super(props);
        this.inputNameRef = React.createRef();
        this.state = { author: '', text: '' };
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.inputNameRef.current.focus();
    }
    handleAuthorChange(e) {
        this.setState({ author: e.target.value });
    }
    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }
    handleSubmit(e) {
        this.inputNameRef.current.focus();
        e.preventDefault();
        const author = this.state.author.trim();
        const text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
    }
    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    ref={this.inputNameRef}
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <input type="submit" className="btn btn-primary" value="Post" />
            </form>
        );
    }
}

class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: []};
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }

    loadCommentsFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = () => {
            //console.log(xhr.response);
            const data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        };
        //console.log(this.state.data.find(comment => comment.id === 3));
        xhr.send();
    }

    handleCommentSubmit(comment) {
        const comments = this.state.data;
        // Optimistically set an id on the new comment. It will be replaced by an
        // id generated by the server. In a production application you would likely
        // use a more robust system for ID generation.
        const newComments = comments.concat([comment]);
        this.setState({ data: newComments });

        const data = new FormData();
        data.append('Author', comment.author);
        data.append('Text', comment.text);
        data.append('Verified', false)

        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = () => this.loadCommentsFromServer();
        xhr.send(data);
    }

    loadSearchCommentFormServer(id) {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ data: data.filter(comment => comment.id.toString().substring(0, id.length) === id) });
        };
        xhr.send();
    }

    handleSearch = id => {
        if (id.id === '') this.loadCommentsFromServer();
        else this.loadSearchCommentFormServer(id.id)
    }

    handleCheck = () => console.log(this.state.data);

    componentDidMount() {
        this.loadCommentsFromServer();
        // window.setInterval(
        //     () => this.loadCommentsFromServer(),
        //     this.props.pollInterval,
        // );
    }
    render() {
        return (
            <>
                <SearchComment onSearch={this.handleSearch} />
                <Check onCheck={this.handleCheck}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                <CommentList data={this.state.data} />
            </>
        );
    }
}

ReactDOM.render(
    <CommentBox
        url="/comments"
        submitUrl="/comments/new"
    />,
    document.getElementById('content'),
);