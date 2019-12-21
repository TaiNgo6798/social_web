import React, { Component } from 'react'
import axios from 'axios'


function withAuthUser(WrappedComponent) {
  return class index extends Component {
    constructor(props) {
      super(props);
      this.state = {
        authed: false
      }
    }
    componentDidMount() {
      if(this.props.params)
      {
      let token = localStorage.getItem('token') ? localStorage.getItem('token') : 'shittoken'
      axios({
        method: 'POST',
        url: `http://localhost:8080/reviewbook/current?token=${token}`
      }).then((res) => {
          if(this.props.params.userID === Object.keys(res.data)[0]){
            this.setState({
              authed: true
            })
         } else{
           this.setState({
             authed: false
           })
         }
      })
    } else{
      this.setState({
        authed: true
      })
    }
    }
    render() {
      return this.state.authed && <WrappedComponent {...this.props} />
    }
  }
}


export default withAuthUser

