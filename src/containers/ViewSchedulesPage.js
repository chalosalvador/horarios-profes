import React, { Component } from 'react';
import * as Teacher from '../firebase/teachers';
import { Alert, Col, Divider, Row, Select, Table } from 'antd';

const { Option } = Select;

class ViewSchedulesPage extends Component {

  teachersSchedules = {};
  teachersNamesOptions = [];
  state = {
    schedulesData: [],
    loadingTeachers: true
  };

  async componentDidMount() {
    this.setState( { loadingTeachers: true } );

    const teachersSnap = await Teacher.getTeachers();

    teachersSnap.docs.forEach( ( teacherSnap ) => {
      const teacherData = teacherSnap.data();
      const teacherId = teacherSnap.id;
      this.teachersSchedules[ teacherId ] = {
        name: `${ teacherData.lastName } ${ teacherData.firstName }`,
        ...teacherData.schedule
      };

      this.teachersNamesOptions.push(
        <Option key={ teacherId }>{ `${ teacherData.lastName } ${ teacherData.firstName }` }</Option> );
    } );
    this.setState( { loadingTeachers: false } );

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
            console.log( 'daysByHour[ day ]', daysByHour[ day ] );
            daysByHour[ day ] = daysByHour[ day ] !== undefined
              ?
              daysByHour[ day ] && this.teachersSchedules[ teacherId ][ day ][ hour ]
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
          style: { background: '#52c41a' }
        }
      }
      : {
        props: {
          style: { background: '#fafafa' }
        }
      };

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
        render: cellColorRender,
        width: 200
      },
      {
        title: 'Martes',
        dataIndex: 'tuesday',
        key: 'tuesday',
        render: cellColorRender,
        width: 200
      },
      {
        title: 'Miércoles',
        dataIndex: 'wednesday',
        key: 'wednesday',
        render: cellColorRender,
        width: 200
      },
      {
        title: 'Jueves',
        dataIndex: 'thursday',
        key: 'thursday',
        render: cellColorRender,
        width: 200
      },
      {
        title: 'Viernes',
        dataIndex: 'friday',
        key: 'friday',
        render: cellColorRender,
        width: 200
      }
    ];


    return (
      <div className='view-schedules-page'>

        <Row type='flex' justify='center'>
          <Col span={ 20 }>
            <h1>Seleccione los profesores:</h1>
          </Col>
        </Row>

        <Row type='flex' justify='center'>
          <Col span={ 12 } offset={ 1 }>
            <Select
              mode='multiple'
              style={ { width: '100%' } }
              size={ 'large' }
              onChange={ this.handleChange }
              loading={ this.state.loadingTeachers }
              placeholder={ 'Seleccione o escriba los nombres de los profesores' }
              showArrow={ true }
              filterOption={ ( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
            >
              { this.teachersNamesOptions }
            </Select>
          </Col>
        </Row>

        <Divider />

        <Row type='flex' justify='center'>
          <Col span={ 12 }>
            <Alert
              message='Horas en que todos los profesores seleccionados están disponibles'
              type='info'
              showIcon
              banner
            />
          </Col>
        </Row>

        <Row type='flex' justify='center'>
          <Col span={ 20 }>
            <Table pagination={ false }
                   columns={ columns }
                   dataSource={ this.state.schedulesData }
                   size={ 'middle' }
                   bordered />
          </Col>
        </Row>

      </div>
    );
  }
}

export default ViewSchedulesPage;