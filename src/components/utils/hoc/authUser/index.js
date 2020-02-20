import React, { Component } from 'react'



function withAuthUser(WrappedComponent) {
  return class index extends Component {
    constructor(props) {
      super(props)
      this.state = {
        authed: false
      }
    }
    componentDidMount() {
      if(this.props.params)
      {
      let token = localStorage.getItem('token') ? localStorage.getItem('token') : 'shittoken'

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

