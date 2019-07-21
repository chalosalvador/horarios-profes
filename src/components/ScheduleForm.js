import React, { Component } from 'react';
import { Button, Checkbox, Form, Icon, Input, message, Table } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';
import * as Teacher from '../firebase/teachers';
import '../styles/login.css';

// const hasErrors = ( fieldsError ) => {
//   console.log( 'fieldsError', fieldsError );
//   return Object.keys( fieldsError ).some( field => fieldsError[ field ] );
// };

class ScheduleForm extends Component {

  initialState = {
    // firstName: '',
    // lastName: '',
    // schedule: ''
  };

  constructor( props ) {
    super( props );
    this.state = this.initialState;
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = ( e ) => {
    e.preventDefault();

    this.props.form.validateFields( async( err, values ) => {
      if( !err ) {
        console.log( 'Received values of form: ', values );
        const { firstName, lastName, monday, tuesday, wednesday, thursday, friday } = values;

        const teacher = {
          firstName,
          lastName,
          schedule: {
            monday: { ...monday },
            tuesday: { ...tuesday },
            wednesday: { ...wednesday },
            thursday: { ...thursday },
            friday: { ...friday }
          }
        };
        console.log( 'teacher', teacher );
        try {
          await Teacher.createTeacher( teacher );
          message.success( 'Horario de profesor registrado!' );
          this.props.form.resetFields();
        } catch( error ) {
          console.log( 'error', error );
          message.error( translateMessage( error.code ) );
        }
      }
    } );
  };

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const firstNameError = isFieldTouched( 'firstName' ) && getFieldError( 'firstName' );
    const lastNameError = isFieldTouched( 'lastName' ) && getFieldError( 'lastName' );
    const disableSubmit = !isFieldTouched( 'firstName' ) || getFieldError( 'firstName' ) || !isFieldTouched( 'lastName' ) || getFieldError( 'lastName' );

    const columns = [
      {
        title: 'Hora',
        dataIndex: 'hour',
        key: 'hour'
      },
      {
        title: 'Lunes',
        dataIndex: 'monday',
        key: 'monday'
      },
      {
        title: 'Martes',
        dataIndex: 'tuesday',
        key: 'tuesday'
      },
      {
        title: 'Miércoles',
        dataIndex: 'wednesday',
        key: 'wednesday'
      },
      {
        title: 'Jueves',
        dataIndex: 'thursday',
        key: 'thursday'
      },
      {
        title: 'Viernes',
        dataIndex: 'friday',
        key: 'friday'
      }
    ];

    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday'
    ];

    const data = [];
    for( let i = 7; i < 20; i++ ) {
      let daysByHour = {};
      days.forEach( ( day ) => {
        daysByHour[ day ] = getFieldDecorator( `${ day }.${ i }`, { initialValue: false, valuePropName: 'checked' } )(
          <Checkbox />
        );
      } );
      data.push( {
        key: i,
        hour: `${ i }h00 - ${ i + 1 }h00`,
        ...daysByHour
      } );
    }

    console.log( 'data', data );

    return (
      <Form layout='inline' onSubmit={ this.handleSubmit } className='schedule-form'>
        <Form.Item label='Nombres' validateStatus={ firstNameError
          ? 'error'
          : '' }
                   help={ firstNameError || '' }>
          { getFieldDecorator( 'firstName', {
            rules: [
              {
                required: true,
                message: 'Ingresa el nombre del profesor'
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                   autoComplete='firstName'
            />
          ) }
        </Form.Item>

        <Form.Item label='Apellidos' validateStatus={ lastNameError
          ? 'error'
          : '' }
                   help={ lastNameError || '' }>
          { getFieldDecorator( 'lastName', {
            rules: [
              {
                required: true,
                message: 'Ingresa el apellido del profesor'
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                   autoComplete='lastName'
            />
          ) }
        </Form.Item>

        <Form.Item>
          <Button type='primary'
                  htmlType='submit'
                  className='schedule-form__button'
                  disabled={ disableSubmit }
          >
            Guardar
          </Button>
        </Form.Item>

        <Table pagination={ false } columns={ columns } dataSource={ data } bordered />

        <Form.Item>
          <Button type='primary'
                  htmlType='submit'
                  className='schedule-form__button'
                  disabled={ disableSubmit }
          >
            Guardar
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startSetLoginState: ( uid ) => dispatch( startSetLoginState( uid ) )
});

export default compose(
  withRouter,
  Form.create( { name: 'schedule-form' } ),
  connect( null, mapDispatchToProps )
)( ScheduleForm );