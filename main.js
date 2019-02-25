import React from 'https://dev.jspm.io/react';
import ReactDOM from 'https://dev.jspm.io/react-dom';
import ReactRedux from 'https://dev.jspm.io/react-redux';
import Redux from 'https://dev.jspm.io/redux';
import htm from 'https://dev.jspm.io/htm';

const { connect, Provider } = ReactRedux;
const { createStore, combineReducers, applyMiddleware, compose } = Redux;

const { Component, Fragment } = React;
const { render } = ReactDOM;
const jsx = htm.bind(React.createElement);

class UserNameEditor extends Component {
  render() {
    const { userName, changeUserName, avatar, greeting } = this.props;
    return jsx`
      <form>
        <h1>Enter Your User Name</h1>
        <input
          type="text"
          value=${userName}
          onChange=${(event) => changeUserName(event.target.value)}
        />
        ${userName && jsx`<p>${greeting}</>`}
        ${userName && jsx`<img src=${avatar} />`}
      </form>
    `;
  }
}

const getUserName = state => state.userName;
const getGreeting = state => {
  const userName = getUserName(state);
  return `Hello ${userName}`;
};
const getAvatar = state => {
  const greeting = getGreeting(state);
  return `https://cataas.com/cat/says/${greeting}`
};

const mapStateToProps = (state) => ({
  userName: getUserName(state),
  avatar: getAvatar(state),
  greeting: getGreeting(state),
});

const CHANGE_USER_NAME = 'CHANGE_USER_NAME';

const changeUserName = (newUserName) => ({
  type: CHANGE_USER_NAME,
  newUserName,
});

const mapDispatchToProps = (dispatch) => ({
  changeUserName: (newUserName) => dispatch(changeUserName(newUserName)),
});

const ConnectedUserNameEditor = connect(mapStateToProps, mapDispatchToProps)(UserNameEditor);

const DEFAULT_STATE = {
  userName: '',
};

const reducer = (state = DEFAULT_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case CHANGE_USER_NAME:
      return {
        ...state,
        userName: action.newUserName,
      };
    default:
      return state;
  }
}

class App extends Component {
  store = createStore(reducer);

  render() {
    return jsx`
      <div>
        <${Provider} store=${this.store}>
          <${ConnectedUserNameEditor} />
        <//>
      </div>
    `;
  }
}

render(jsx`<${App} />`, document.body.appendChild(document.createElement('main')));
