import axios from 'axios';

const teacherList = document.querySelector('#teachers');
const unassignedList = document.querySelector('#unassigned');
const content = document.querySelector('#content');

const data = {
  teachers: [],
  unassigned: []
};

const fetchTeachers = async()=> {
  data.teachers = (await axios.get('/api/users/teachers')).data;
}

const fetchUnassigned = async()=> {
  data.unassigned = (await axios.get('/api/users/unassigned')).data;
}

const renderTeachers = ()=> {
  const html = data.teachers.map( teacher => {
    return `
      <li>
        ${ teacher.name }
        <button data-action='delete-teacher' data-id='${teacher.id}'>x</button>
        <button data-action='make-teacher-a-student' data-id='${teacher.id}'>Make Student</button>
        <ul>
          ${ renderMentees(teacher.mentees)}
        </ul>
      </li>
    `;
  }).join(''); 
  teacherList.innerHTML = html;
};

const renderMentees = (mentees)=> {
  const html = mentees.map( mentee => {
    return `
      <li>
        ${ mentee.name }
        <button data-action='delete-mentee' data-id='${mentee.id}'>x</button>
        <button data-action='unassign-mentee' data-id='${mentee.id}'>Unassigne Mentee</button>
        <button data-action='make-mentee-a-teacher' data-id='${mentee.id}'>Make Teacher</button>
      </li>
    `;
  }).join(''); 
  return html;
}

const renderUnassigned = ()=> {
  const html = data.unassigned.map( student => {
    return `
      <li>
        ${ student.name }
        <select data-id='${student.id}' data-action='assign-mentor'>
          <option>--- assign to mentor ---</option>
          ${
            data.teachers.map( teacher => `
              <option value='${student.id}' data-teacher-id='${teacher.id}'>${teacher.name}</option>
            `).join('')
          }
        </select>
        <button data-action='delete-unassigned' data-id='${student.id}'>x</button>
        <button data-action='make-unassigned-a-teacher' data-id='${student.id}'>Make Teacher</button>
      </li>
    `;
  }).join(''); 
  unassignedList.innerHTML = html;
}

const start = async()=> {
  await Promise.all([
    fetchTeachers(),
    fetchUnassigned()
  ]);
  renderTeachers();
  renderUnassigned();
};

content.addEventListener('click', (ev)=> {
  const action = ev.target.getAttribute('data-action');
  const id = ev.target.getAttribute('data-id');
  if(action === 'delete-teacher'){
    console.log(action, id);
  }
  else if(action === 'delete-mentee'){
    console.log(action, id);
  }
  else if(action === 'delete-unassigned'){
    console.log(action, id);
  }
  else if(action === 'make-teacher-a-student'){
    console.log(action, id);
  }
  else if(action === 'make-mentee-a-teacher'){
    console.log(action, id);
  }
  else if(action === 'make-unassigned-a-teacher'){
    console.log(action, id);
  }
  else if(action === 'unassign-mentee'){
    console.log(action, id);
  }
});

content.addEventListener('change', (ev)=> {
  const action = ev.target.getAttribute('data-action');
  const id = ev.target.getAttribute('data-id');
  if(action === 'assign-mentor'){
    console.log(action, id);
  }
});

start();
