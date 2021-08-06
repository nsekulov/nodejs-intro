import {useState, useEffect} from 'react'
import './App.css';
import React from 'react'
import axios from './request';
import Comment from './Comments'
import {Button} from './App'

  async function loadComments (post_id) {
    const url = 'http://server.domain.net/restapi/post/' + post_id + '/comments'
    return axios.get(url)
  }

  function Post ({ data, onDelete, user}) {
    const [comments, setComments] = useState([]);
    const [listed, setListed] = useState(true);
    
    useEffect(() => {
      loadComments(data.id)
      .then(({data}) => {
        setComments(data.comments)
      })
      .catch(() => alert('Failed to load comments from API'))
    }, []);
    
    const deletePost = () => {
      onDelete(data.id)
      .then(() => setListed(false))
      .catch(() => alert("Failed to delete post."))
      
    }
    const addComment = newComment =>{
     setComments([newComment, ...comments])
    }
    
    return listed ? (
      <div className={'post__wrapper'}>
        <div className='post__title'>Title: {data.title}</div>
        <div className='post__content'>{data.content}</div>
        <Button onClick={deletePost} title={'Delete post'}/>
        <CommentCreator addComment={addComment} postId={data.id}  user={user}/>
        <div className='comment__list'>
        { comments ?
          comments
          .map(commentData => <Comment key={commentData.id} data={commentData}/>)
        : "Loading..." }
        </div>
      </div>
    )
    :
    null
  }

  class CommentCreator extends React.Component{
    constructor (props) {
      super(props);
      this.handleContentChange = this.handleContentChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.state = {
        content: ""
      }
    }
  
    handleSubmit(event){
      event.preventDefault();
      const comment = {
        content: this.state.content,
        author: this.props.user.id,
        post: this.props.postId
      }
  
      axios.post(`http://server.domain.net/restapi/comment/`, comment)
      .then((response) => {
        this.props.addComment(response.data)
      })
      .catch(() => alert("Failed to post"))
    }
  
    handleContentChange(event){
      this.setState({content: event.target.value})
    }
    render () {
      return <div className="wrapper">
        <form className="" onSubmit={this.handleSubmit}>
          <label htmlFor="comment" className="text-small">Add Comment: </label>
          <input type="text" id="comment" onChange={this.handleContentChange}></input>
          <br/>
          <Button onClick={this.createComment} title={'Comment'}/>
        </form>
      </div>
    }
  }

  export default Post;