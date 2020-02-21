import React, { Component } from 'react'

function withAuthLogged(WrappedComponent) {
  return class index extends Component {
    constructor(props) {
      super(props)
      this.state = {
        logged: false
      }
    }
    componentDidMount() {
        if(!localStorage.getItem('Authorization')){
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
