import React from 'react';
import ScheduleForm from '../components/ScheduleForm';
import * as Teacher from '../firebase/teachers';
import { message } from 'antd';
import { translateMessage } from '../helpers/translateMessage';

const handleSubmit = async( teacher ) => {
  try {
    await Teacher.createTeacher( teacher );
    message.success( 'Horario de profesor registrado!' );
  } catch( error ) {
    console.log( 'error', error );
    message.error( translateMessage( error.code ) );
  }
};

const AddSchedulePage = () => (
  <div className='add-schedules-page'>
    <h1 className='add-schedules-page__title'>Añadir horario de profesor</h1>
    <ScheduleForm submitAction={ handleSubmit } />
  </div>
);

export default AddSchedulePage;