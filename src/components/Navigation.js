import { Icon, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogoutButton from './LogoutButton';
import '../styles/navigation.css';
import { ABOUT, MANAGE_SCHEDULES } from '../constants/routes';

const SubMenu = Menu.SubMenu;

class Navigation extends React.Component {
  rootSubmenuKeys = [ 'sub1', 'sub2' ];

  state = {
    current: 'home',
    collapsed: false,
    openKeys: []
  };

  onOpenChange = ( openKeys ) => {
    const latestOpenKey = openKeys.find( key => this.state.openKeys.indexOf( key ) === -1 );
    if( this.rootSubmenuKeys.indexOf( latestOpenKey ) === -1 ) {
      this.setState( { openKeys } );
    } else {
      this.setState( {
        openKeys: latestOpenKey
          ? [ latestOpenKey ]
          : []
      } );
    }
  };

  handleClick = ( e ) => {
    console.log( 'click ', e );
    this.setState( {
      current: e.key
    } );
  };

  render() {
    return (
      this.props.isAuthenticated
        ?
        <Menu
          theme='dark'
          mode='horizontal'
          onClick={ this.handleClick }
          openKeys={ this.state.openKeys }
          onOpenChange={ this.onOpenChange }
          className='menu'
        >
          <Menu.Item key='home'>
            <Link to='/'><Icon type='calendar' /> <span>Ver horarios</span></Link>
          </Menu.Item>

          <Menu.Item key='manage'>
            <Link to={ MANAGE_SCHEDULES }><Icon type='control' /> <span>Administrar horarios</span></Link>
          </Menu.Item>

          {/*<SubMenu key='sub1' title={ <span><Icon type='mail' /><span>Navigation One</span></span> }>*/ }
          {/*  <Menu.Item key='2'>Option 2</Menu.Item>*/ }
          {/*  <Menu.Item key='3'>Option 3</Menu.Item>*/ }
          {/*  <Menu.Item key='4'>Option 4</Menu.Item>*/ }
          {/*</SubMenu>*/ }

          {/*<SubMenu key='sub2' title={ <span><Icon type='appstore' /><span>Navigation Two</span></span> }>*/ }
          {/*  <Menu.Item key='5'>Option 5</Menu.Item>*/ }
          {/*  <Menu.Item key='6'>Option 6</Menu.Item>*/ }
          {/*  <SubMenu key='sub3' title='Submenu'>*/ }
          {/*    <Menu.Item key='7'>Option 7</Menu.Item>*/ }
          {/*    <Menu.Item key='8'>Option 8</Menu.Item>*/ }
          {/*  </SubMenu>*/ }
          {/*</SubMenu>*/ }

          {/*<Menu.Item key='about'>*/ }
          {/*  <span><Icon type='question-circle' /><span><Link to={ ABOUT }>Acerca de...</Link></span></span>*/ }
          {/*</Menu.Item>*/ }

          <Menu.Item key='logout'>
            <LogoutButton />
          </Menu.Item>
        </Menu>
        : null
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.uid
});

export default connect( mapStateToProps )( Navigation );