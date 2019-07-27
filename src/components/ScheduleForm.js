import React, { Component } from 'react';
import { Alert, Button, Checkbox, Col, Form, Icon, Input, message, Row, Switch, Table } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';
import * as Teacher from '../firebase/teachers';
import '../styles/schedule-form.css';

// const hasErrors = ( fieldsError ) => {
//   console.log( 'fieldsError', fieldsError );
//   return Object.keys( fieldsError ).some( field => fieldsError[ field ] );
// };

class ScheduleForm extends Component {

  state = {
    hoursSelected: 0,
    firstName: null,
    lastName: null,
    scheduleEdited: false,
    saving: false
  };


  days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday'
  ];

  constructor( props ) {
    super( props );
    if( this.props.teacher ) {
      this.state = {
        firstName: this.props.teacher.firstName,
        lastName: this.props.teacher.lastName,
        hoursSelected: 0
      };
    }
  }

  componentDidMount() {
    for( let i = 7; i < 20; i++ ) {
      // let daysByHour = {};
      this.days.forEach( ( day ) => {
        if( this.props.teacher && this.props.teacher.schedule[ day ][ i ] ) {
          this.setState( ( prevState ) => ({ hoursSelected: prevState.hoursSelected + 1 }) );
        }
      } );

    }
    console.log( 'this.state.hoursSelected', this.state.hoursSelected );

    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  componentDidUpdate( prevProps, prevState, snapshot ) {

    console.log( 'this.state.hoursSelected', this.state.hoursSelected );
    if( this.props.teacher !== prevProps.teacher ) {
      this.setState( {
        hoursSelected: 0,
        scheduleEdited: false
      } );

      for( let i = 7; i < 20; i++ ) {
        // let daysByHour = {};
        this.days.forEach( ( day ) => {
          if( this.props.teacher && this.props.teacher.schedule[ day ][ i ] ) {
            this.setState( ( prevState ) => ({ hoursSelected: prevState.hoursSelected + 1 }) );
          }
        } );

      }
    }
  }


  handleScheduleChange = checked => {
    this.setState( { scheduleEdited: true } );
    if( checked ) {
      this.setState( { hoursSelected: this.state.hoursSelected + 1 } );
    } else {
      this.setState( { hoursSelected: this.state.hoursSelected - 1 } );
    }
  };

  handleSubmit = ( e ) => {
    e.preventDefault();
    console.log( 'this.state.hoursSelected', this.state.hoursSelected );
    this.props.form.validateFields( async( err, values ) => {
      if( !err && this.state.hoursSelected > 0 ) {
        console.log( 'Received values of form: ', values );
        const { firstName, lastName, monday, tuesday, wednesday, thursday, friday } = values;
        this.setState( { saving: true } );
        const teacher = {
          firstName: firstName.toUpperCase(),
          lastName: lastName.toUpperCase(),
          schedule: {
            monday: { ...monday },
            tuesday: { ...tuesday },
            wednesday: { ...wednesday },
            thursday: { ...thursday },
            friday: { ...friday }
          }
        };
        console.log( 'teacher', teacher );
        await this.props.submitAction( teacher );
        this.setState( { saving: false } );

        if( !this.props.teacher ) { // if it is a new teacher
          this.props.form.resetFields();
          this.setState( { hoursSelected: 0 } );
        }
      }
    } );
  };

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const firstNameError = isFieldTouched( 'firstName' ) && getFieldError( 'firstName' );
    const lastNameError = isFieldTouched( 'lastName' ) && getFieldError( 'lastName' );
    const disableSubmit = (!isFieldTouched( 'firstName' ) && !isFieldTouched( 'lastName' ) && !this.state.scheduleEdited) ||
      getFieldError( 'firstName' ) ||
      getFieldError( 'lastName' ) ||
      this.state.hoursSelected < 1
    ;

    const columns = [
      {
        title: 'Hora',
        dataIndex: 'hour',
        key: 'hour',
        width: 150
      },
      {
        title: 'Lunes',
        dataIndex: 'monday',
        key: 'monday',
        width: 200
      },
      {
        title: 'Martes',
        dataIndex: 'tuesday',
        key: 'tuesday',
        width: 200
      },
      {
        title: 'Miércoles',
        dataIndex: 'wednesday',
        key: 'wednesday',
        width: 200
      },
      {
        title: 'Jueves',
        dataIndex: 'thursday',
        key: 'thursday',
        width: 200
      },
      {
        title: 'Viernes',
        dataIndex: 'friday',
        key: 'friday',
        width: 200
      }
    ];

    const data = [];
    for( let i = 7; i < 20; i++ ) {
      let daysByHour = {};
      this.days.forEach( ( day ) => {

        // if( this.props.teacher && this.props.teacher.schedule[ day ][ i ] ) {
        //   this.setState( { hoursSelected: this.state.hoursSelected + 1 } );
        // }

        daysByHour[ day ] = getFieldDecorator( `${ day }.${ i }`, {
          initialValue: this.props.teacher
            ? this.props.teacher.schedule[ day ][ i ]
            : false,
          valuePropName: 'checked'
        } )(
          <Switch className={ 'schedule-form__switch' } onChange={ this.handleScheduleChange } />
        );
      } );

      data.push( {
        key: i,
        hour: `${ i }h00 - ${ i + 1 }h00`,
        ...daysByHour
      } );

    }

    console.log( 'data', data );
    console.log( 'this.props.teacher', this.props.teacher );

    return (
      <Form layout='inline' onSubmit={ this.handleSubmit } className='schedule-form'>
        <Row type='flex' justify='center'>
          <Col span={ 12 }>
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
                      loading={ this.state.saving }
              >
                { !this.state.saving
                  ? 'Guardar'
                  : 'Guardando...' }
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row type='flex' justify='center'>
          <Col span={ 20 }>
            <Table pagination={ false }
                   columns={ columns }
                   className={ 'schedule-form__table' }
                   dataSource={ data }
                   size={ 'middle' }
                   bordered
                   title={ () => this.state.hoursSelected < 1
                     ? <Alert message='Selecciona las horas en las que el profesor está disponible' banner type='error' />
                     : <Alert message='Asegúrate de que el horario esté ingresado correctamente'
                              banner
                              type='info' /> } />
          </Col>
        </Row>

        <Row type='flex' justify='center'>
          <Col style={ { textAlign: 'center' } }>
            <Form.Item>
              <Button type='primary'
                      htmlType='submit'
                      className='schedule-form__button'
                      disabled={ disableSubmit }
                      loading={ this.state.saving }
              >
                { !this.state.saving
                  ? 'Guardar'
                  : 'Guardando...' }

              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const mapPropsToFields = ( props ) => {
  if( props.teacher ) {
    return {
      firstName: Form.createFormField( {
        value: props.teacher.firstName
      } ),
      lastName: Form.createFormField( {
        value: props.teacher.lastName
      } )
    };
  }
};

const mapDispatchToProps = dispatch => ({
  startSetLoginState: ( uid ) => dispatch( startSetLoginState( uid ) )
});

export default compose(
  withRouter,
  Form.create( {
    name: 'schedule-form',
    mapPropsToFields
  } ),
  connect( null, mapDispatchToProps )
)( ScheduleForm );