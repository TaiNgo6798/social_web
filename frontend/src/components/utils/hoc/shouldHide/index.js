import React, { Component } from 'react'

function withShouldHide(WrappedComponent) {
  return class index extends Component {
    constructor(props) {
      super(props);
      this.state = {
        authed: false
      }
    }
    componentDidMount() {
      if(window.location.pathname === '/'  || window.location.pathname === '/login' )
      {
        this.setState({
          authed: false
        })
    } else{
      this.setState({
        authed: true
      })
    }

    }
    render() {
      return this.state.authed ? <WrappedComponent {...this.props} /> : <div></div>
    }
  }
}


export default withShouldHide