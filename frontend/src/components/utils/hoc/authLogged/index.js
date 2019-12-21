import React, { Component } from 'react'
import axios from 'axios'


function withAuthLogged(WrappedComponent) {
  return class index extends Component {
    constructor(props) {
      super(props);
      this.state = {
        logged: false
      }
    }
    componentDidMount() {
        if(!JSON.parse(localStorage.getItem('user')) || !localStorage.getItem('token')){
          this.setState({
            logged: false
          })
        } else {
          this.setState({
            logged: true
          })
        }
    }
    render() {
      return this.state.logged && <WrappedComponent {...this.props} />
    }
  }
}


export default withAuthLogged
