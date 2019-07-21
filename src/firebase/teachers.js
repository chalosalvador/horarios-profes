/**
 * Created by chalosalvador on 2019-01-31
 */

import { db } from '../firebase';

export const getTeacher = id => db.collection( `teachers` ).doc( id );

export const getTeachersObserver = ( observer ) => db.collection( 'teachers' )
  .orderBy( 'lastName', 'asc' )
  .orderBy( 'firstName', 'asc' )
  .onSnapshot( observer );

export const getTeachers = () => db.collection( 'teachers' )
  .orderBy( 'lastName', 'asc' )
  .orderBy( 'firstName', 'asc' )
  .get();

export const getTeachersByStatus = ( status ) => db.collection( 'teachers' )
  .orderBy( 'lastName', 'asc' )
  .orderBy( 'firstName', 'asc' )
  .where( 'status', '==', status )
  .get();

export const createTeacher = ( teacher ) => db.collection( 'teachers' ).add( teacher );

export const updateTeacher = ( id, data ) => db.collection( 'teachers' ).doc( id ).update( data );