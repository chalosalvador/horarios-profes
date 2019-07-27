import React, { Component } from 'react';
import ScheduleForm from '../components/ScheduleForm';
import { Col, Divider, message, Row, Select } from 'antd';
import * as Teacher from '../firebase/teachers';
import { translateMessage } from '../helpers/translateMessage';

const { Option } = Select;

class EditSchedulePage extends Component {

  teachersSchedules = {};
  teachersNamesOptions = [];

  state = {
    loadingTeachers: true,
    selectedTeacher: undefined,
    teacherId: undefined
  };

  async componentDidMount() {
    this.setState( { loadingTeachers: true } );

    this.unsubscribeTeachersObserver = await Teacher.getTeachersObserver( ( teachersSnap ) => {
      this.teachersNamesOptions = [];
      teachersSnap.docs.forEach( ( teacherSnap ) => {
        const teacherData = teacherSnap.data();
        const teacherId = teacherSnap.id;
        this.teachersSchedules[ teacherId ] = {
          name: `${ teacherData.lastName } ${ teacherData.firstName }`,
          ...teacherData
        };

        this.teachersNamesOptions.push(
          <Option key={ teacherId }>{ `${ teacherData.lastName } ${ teacherData.firstName }` }</Option> );
      } );
      this.setState( {
        loadingTeachers: false,
        selectedTeacher: this.state.teacherId
          ? this.teachersSchedules[ this.state.teacherId ]
          : null
      } );
      console.log( '########selectedTeacher', this.state.selectedTeacher );
    } );

    console.log( 'teachers', this.teachersSchedules );
  }

  componentWillUnmount() {
    this.unsubscribeTeachersObserver();
  }

  handleSubmit = async( teacher ) => {
    return Teacher.updateTeacher( this.state.teacherId, teacher )
      .then( () => {
        message.success( 'Horario de profesor editado correctamente!' );
      } )
      .catch( error => {
        console.log( 'error', error );
        message.error( translateMessage( error.code ) );
      } );
  };

  onChange = ( value ) => {
    console.log( `selected ${ value }` );
    this.setState( {
      teacherId: value,
      selectedTeacher: this.teachersSchedules[ value ]
    } );
  };

  render() {
    return (
      <div className='edit-schedules-page'>
        <Row type='flex' justify='center'>
          <Col>
            <h1 className='edit-schedules-page__title'>Editar horario de profesor: </h1>
          </Col>

          <Col offset={ 1 }>
            <Select
              id={ 'select-teacher' }
              placeholder='Seleccione un profesor para editarlo...'
              size={ 'large' }
              value={ this.state.teacherId }
              showSearch
              style={ { width: 500 } }
              optionFilterProp='children'
              onChange={ this.onChange }
              filterOption={ ( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              loading={ this.state.loadingTeachers }
            >
              { this.teachersNamesOptions }
            </Select>
          </Col>
        </Row>

        <Divider />

        { this.state.selectedTeacher &&
        <ScheduleForm submitAction={ this.handleSubmit } teacher={ this.state.selectedTeacher } /> }
      </div>
    );
  }
}

export default EditSchedulePage;