import React, { Component } from 'react';
import axios from 'axios';

class App extends Component{
  constructor(){
    super();
    this.state = {
      teachers: [],
      unassigned: []
    };
    this.destroy = this.destroy.bind(this);
    this.toggleUserType = this.toggleUserType.bind(this);
    this.assignMentor = this.assignMentor.bind(this);
    this.unassignMentor = this.unassignMentor.bind(this);
  }
  async assignMentor(user, mentor){
    //remove from unassigned and at to teachers mentees
    console.log('assign mentor', user, mentor);
  }
  async unassignMentor(user){
    //remove from teachers mentees and add to unassigned
    console.log('unassign mentor', user);
  }

  async toggleUserType(user){
    //move to correct list
    //becoming student - go to unassigned
    //becoming a teacher - go to teachers
    console.log('toggle user type', user);
  }
  async destroy(user){
    await axios.delete(`/api/users/${user.id}`);
    //TODO buggy
    if(user.userType === 'TEACHER'){
      const teachers = this.state.teachers.filter(teacher => teacher.id !== user.id);
      this.setState({ teachers });
    }
    if(user.userType === 'STUDENT'){
      if(!user.mentorId){
        const unassigned = this.state.unassigned.filter(student => student.id !== user.id);
        this.setState({ unassigned });
      }
    }
  }
  async componentDidMount(){
    const { data: teachers} = await axios.get('/api/users/teachers');
    const { data: unassigned} = await axios.get('/api/users/unassigned');
    this.setState({ teachers, unassigned });
  }
  render(){
    const { teachers, unassigned } = this.state;
    const { destroy, toggleUserType, assignMentor, unassignMentor } = this;
    return (
      <div>
        <h1>Acme Mentorship</h1>
        <h2>Teachers and Their Mentees</h2>
        <ul>
        {
          teachers.map( teacher => {
            return (
              <li key={ teacher.id }>
                { teacher.name }
                <button onClick={ ()=> destroy(teacher)}>x</button>
                <button onClick={()=> toggleUserType(teacher)}>Make Student</button>
                <ul>
                  {
                    teacher.mentees.map( student => {
                      return (
                        <li key={ student.id }>
                          { student.name }
                        <button onClick={ ()=> destroy(student)}>x</button>
                        <button onClick={ ()=> unassignMentor(student)}>Unassign Mentor</button>
                        </li>
                      );
                    })
                  }
                </ul>
              </li>
            );
          })
        }
        </ul>
        <h2>Unassigned Students</h2>
        <ul>
        {
          unassigned.map( student => {
            return (
              <li key={ student.id }>

                { student.name }
                <button onClick={ ()=> destroy(student)}>x</button>
                <button onClick={ ()=> toggleUserType(student)}>Make Teacher</button>
                <select onChange={ ev => assignMentor(student, ev.target.value)}>
                  <option>--- assign to ---</option>
                  {
                    teachers.map( teacher => {
                      return (
                        <option key={ teacher.id }>{ teacher.name }</option>
                      );
                    })
                  }
                </select>
              </li>
            );
          })
        }
        </ul>
      </div>
    );
  }
};

export default App;
