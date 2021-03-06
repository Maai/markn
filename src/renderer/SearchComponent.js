import React from 'react'
import searchStore from './SearchStore'
import dispatcher from './Dispatcher'
import classNames from 'classnames'

export default class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      total: 0,
      isShown: false,
      disabled: false
    };

    this.action = new ActionCreator();
    this.store = searchStore;
    this.store.on('openFind', this.show.bind(this));
    this.store.on('closeFind', this.hide.bind(this));
    this.store.on('updateDisable', this.updateDisable.bind(this));
    this.store.on('focus-mark', this.onFocusMark.bind(this));
  }

  show() {
    this.setState({isShown: true});
    let input = React.findDOMNode(this.refs.search);
    input.focus();
    input.select();
  }

  hide() {
    this.setState({isShown: false});
  }

  updateDisable(disabled) {
    this.setState({disabled});
  }

  onInput() {
    let text = React.findDOMNode(this.refs.search).value;
    this.action.search(text);
  }

  onKeyDown(e) {
    if (e.key != 'Enter') return;
    this.action.next();
  }

  onFocusMark(_, current, total) {
    this.setState({current, total});
  }

  render() {
    return (
      <div className={classNames('search-box', {'is-shown': this.state.isShown})}>
        <div className='search'>
          <input type='text' ref='search' onInput={this.onInput.bind(this)} onKeyDown={this.onKeyDown.bind(this)}/>
          <span className='index'>{this.state.total === 0 ? '' : `${this.state.current + 1}/${this.state.total}`}</span>
        </div>
        <button className='fa fa-chevron-up button-up' disabled={this.state.disabled}/>
        <button className='fa fa-chevron-down button-down' disabled={this.state.disabled}/>
        <button className='fa fa-times button-close' onClick={this.onClickClose.bind(this)}/>
      </div>
    );
  }

  onClickClose() {
    this.action.close();
  }
}

class ActionCreator {
  close() {
    dispatcher.emit('closeFind');
  }

  search(text) {
    dispatcher.emit('search', text);
  }

  next() {
    dispatcher.emit('next-mark');
  }
}
