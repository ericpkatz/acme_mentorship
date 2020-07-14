import React, { Component } from 'react';
import axios from 'axios';

class App extends Component{
  constructor(){
    super();
    this.state = {
      teachers: [],
      unassigned: []
    };
  }
  async componentDidMount(){
    const { data: teachers} = await axios.get('/api/users/teachers');
    const { data: unassigned} = await axios.get('/api/users/unassigned');
    this.setState({ teachers, unassigned });
  }
  render(){
    const { teachers, unassigned } = this.state;
    return (
      <div>
        <h1>Acme Mentorship</h1>
        <ul>
        {
          teachers.map( teacher => {
            return (
              <li key={ teacher.id }>
                { teacher.name }
                <ul>
                  {
                    teacher.mentees.map( student => {
                      return (
                        <li key={ student.id }>
                          { student.name }
                        </li>
                      );
                    })
                  }
                </ul>
              </li>
            );
          })
        }
        {
          unassigned.map( student => {
            return (
              <li key={ student.id }>
                { student.name }
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
