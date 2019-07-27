import { Icon, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogoutButton from './LogoutButton';
import '../styles/navigation.css';
import { ABOUT, ADD_SCHEDULE, EDIT_SCHEDULE } from '../constants/routes';

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

          <SubMenu key='manage' title={ <span><Icon type='control' /><span>Administrar horarios</span></span> }>
            <Menu.Item key='new'>
              <Link to={ ADD_SCHEDULE }><Icon type='user-add' style={ { fontSize: 20 } } />
                <span>Añadir</span></Link>
            </Menu.Item>

            <Menu.Item key='edit'>
              <Link to={ EDIT_SCHEDULE }><Icon type='edit' style={ { fontSize: 20 } } />
                <span>Editar</span></Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key='about'>
            <Link to={ ABOUT }><span><Icon type='question-circle' /><span>Acerca de...</span></span></Link>
          </Menu.Item>

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