import React, { Component } from 'react';
import * as Teacher from '../firebase/teachers';
import { Select, Table } from 'antd';

const { Option } = Select;

class ViewSchedulesPage extends Component {

  teachersSchedules = {};
  teachersNamesOptions = [];
  state = {
    schedulesData: []
  };

  async componentDidMount() {
    this.setState( { loadingClassRequests: true } );

    const teachersSnap = await Teacher.getTeachers();

    teachersSnap.docs.forEach( ( teacherSnap ) => {
      const teacherData = teacherSnap.data();
      const teacherId = teacherSnap.id;
      this.teachersSchedules[ teacherId ] = {
        name: `${teacherData.lastName} ${teacherData.firstName}`,
        ...teacherData.schedule
      };

      this.teachersNamesOptions.push( <Option key={ teacherId }>{ `${teacherData.lastName} ${teacherData.firstName}` }</Option> );
    } );
    console.log( 'teachers', this.teachersSchedules );
  }

  handleChange = ( selectedTeachers ) => {
    console.log( 'selectedTeachers', selectedTeachers );
    console.log( 'this.teachersSchedules[ selectedTeachers ]', this.teachersSchedules[ selectedTeachers ] );

    const d = [];

    if( selectedTeachers.length > 0 ) {
      for( let hour = 7; hour < 20; hour++ ) {
        const days = [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday'
        ];

        let daysByHour = {};
        days.forEach( ( day ) => {
          selectedTeachers.forEach( ( teacherId ) => {

            daysByHour[ day ] = daysByHour[ day ]
              ? true
              : this.teachersSchedules[ teacherId ][ day ][ hour ];
          } );

        } );

        d.push( {
          key: hour,
          hour: `${ hour }h00 - ${ hour + 1 }h00`,
          ...daysByHour
        } );
      }
    }
    this.setState( { schedulesData: d } );

    console.log( 'data', this.state.schedulesData );
  };

  render() {
    const cellColorRender = ( data ) => data === true
      ? {
        props: {
          style: { background: '#ff7875' }
        }
      }
      : {
        props: {
          style: { background: '#ffffff' }
        }
      };

    const columns = [
      {
        title: 'Hora',
        dataIndex: 'hour',
        key: 'hour'
      },
      {
        title: 'Lunes',
        dataIndex: 'monday',
        key: 'monday',
        render: cellColorRender
      },
      {
        title: 'Martes',
        dataIndex: 'tuesday',
        key: 'tuesday',
        render: cellColorRender
      },
      {
        title: 'Miércoles',
        dataIndex: 'wednesday',
        key: 'wednesday',
        render: cellColorRender
      },
      {
        title: 'Jueves',
        dataIndex: 'thursday',
        key: 'thursday',
        render: cellColorRender
      },
      {
        title: 'Viernes',
        dataIndex: 'friday',
        key: 'friday',
        render: cellColorRender
      }
    ];


    return (
      <div className='view-schedules-page'>
        <h1 className='view-schedules-page__title'>Ver horarios</h1>

        <Select mode='multiple' style={ { width: '100%' } } placeholder='Please select' onChange={ this.handleChange }>
          { this.teachersNamesOptions }
        </Select>

        <Table pagination={ false } columns={ columns } dataSource={ this.state.schedulesData } size={ 'small' } bordered />

      </div>
    );
  }
}

export default ViewSchedulesPage;