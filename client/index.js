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
        <button data-teacher-id='${mentee.mentorId}' data-action='delete-mentee' data-id='${mentee.id}'>x</button>
        <button data-teacher-id='${mentee.mentorId}' data-action='unassign-mentee' data-id='${mentee.id}'>Unassigne Mentee</button>
        <button data-teacher-id='${mentee.mentorId}' data-action='make-mentee-a-teacher' data-id='${mentee.id}'>Make Teacher</button>
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
              <option value='${teacher.id}'>${teacher.name}</option>
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

const getTeacherById = (id)=> {
  return data.teachers.find( teacher => teacher.id === id);
};

const getMenteeById = (teacherId, id)=> {
  return getTeacherById(teacherId).mentees.find( mentee => mentee.id === id);
};

const getUnassignedById = (id)=> {
  return data.unassigned.find( student => student.id === id);
}

content.addEventListener('click', (ev)=> {
  const action = ev.target.getAttribute('data-action');
  const id = ev.target.getAttribute('data-id');
  if(action === 'delete-teacher'){
    console.log(action, id);
    console.log(getTeacherById(id));
    //TODO - make change on server and remove teacher
  }
  else if(action === 'delete-mentee'){
    console.log('TODO - delete this mentee', id);
    const teacherId = ev.target.getAttribute('data-teacher-id');
    console.log(getMenteeById(teacherId, id));
    //TODO - make change on server and remove mentee from teacher 
  }
  else if(action === 'delete-unassigned'){
    console.log('TODO - delete this unassigned student', id);
    console.log(getUnassignedById(id));
    //TODO - make change on server and remove unassigned 
  }
  else if(action === 'make-teacher-a-student'){
    console.log('TODO - make this teacher a student', id);
    console.log(getTeacherById(id));
    //TODO - remove teacher from teachers
    //TODO - add teacher to unassigned
  }
  else if(action === 'make-mentee-a-teacher'){
    console.log('TODO - make this mentee a teacher', id);
    const teacherId = ev.target.getAttribute('data-teacher-id');
    console.log(getMenteeById(teacherId, id));
    //TODO - remove mentee from current mentor 
    //TODO - add mentee to teachers
  }
  else if(action === 'make-unassigned-a-teacher'){
    console.log('TODO - make this student a teacher', id);
    console.log(getUnassignedById(id));
    //TODO - remove student from unassigned
    //TODO - add student to teachers
  }
  else if(action === 'unassign-mentee'){
    console.log('TODO - unassign this mentee', id);
    const teacherId = ev.target.getAttribute('data-teacher-id');
    console.log(getMenteeById(teacherId, id));
    //TODO - remove mentee from current mentor 
    //TODO - add mentee to unassigned 
  }
});

content.addEventListener('change', (ev)=> {
  const action = ev.target.getAttribute('data-action');
  const id = ev.target.getAttribute('data-id');
  if(action === 'assign-mentor'){
    console.log('TODO - assign this user to this teacher', id, ev.target.value);
    console.log(getTeacherById(ev.target.value));
    console.log(getUnassignedById(id));
    //TODO - remove student from unassigned 
    //TODO - add student to teacher 
  }
});

start();
