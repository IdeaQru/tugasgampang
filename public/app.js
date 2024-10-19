document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#students-table tbody');
    const addStudentForm = document.getElementById('add-student-form');
    const addCourseForm = document.getElementById('add-course-form');
    const courseSelect = document.getElementById('student-course');
  
    // Fetch and populate the courses in the dropdown
    function fetchCourses() {
      fetch('/courses')
        .then(response => response.json())
        .then(courses => {
          // Clear any existing options
          courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
          
          courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.course_name;
            courseSelect.appendChild(option);
          });
        })
        .catch(error => console.error('Error fetching courses:', error));
    }
  
    // Fetch data from the API and populate the table
    function fetchStudents() {
      fetch('/students-courses')
        .then(response => response.json())
        .then(data => {
          tableBody.innerHTML = '';  // Clear existing rows
          data.forEach(student => {
            const row = document.createElement('tr');
  
            // Create table cells
            const idCell = document.createElement('td');
            idCell.textContent = student.id;
            row.appendChild(idCell);
  
            const nameCell = document.createElement('td');
            nameCell.textContent = student.name;
            row.appendChild(nameCell);
  
            const courseCell = document.createElement('td');
            courseCell.textContent = student.course_name;
            row.appendChild(courseCell);
  
            // Actions (Edit & Delete)
            const actionsCell = document.createElement('td');
  
            // Edit button
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
              editStudent(student.id, student.name, student.course_id);
            });
            actionsCell.appendChild(editBtn);
  
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
              deleteStudent(student.id);
            });
            actionsCell.appendChild(deleteBtn);
  
            row.appendChild(actionsCell);
  
            // Add the row to the table
            tableBody.appendChild(row);
          });
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  
    // Fetch the initial data to populate the table
    fetchStudents();
    fetchCourses(); // Populate course dropdown
  
    // Add Student Form Submission
    addStudentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('student-name').value;
      const courseId = document.getElementById('student-course').value;
  
      fetch('/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, course_id: courseId }),
      })
        .then(response => response.json())
        .then(() => {
          fetchStudents(); // Refresh the table
          addStudentForm.reset();
        })
        .catch(error => console.error('Error adding student:', error));
    });
  
    // Add Course Form Submission
    addCourseForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const courseName = document.getElementById('course-name').value;
  
      fetch('/add-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course_name: courseName }),
      })
        .then(response => response.json())
        .then(() => {
          addCourseForm.reset();
          fetchCourses(); // Refresh the course dropdown
        })
        .catch(error => console.error('Error adding course:', error));
    });
  
    // Delete student
    function deleteStudent(studentId) {
      fetch(`/delete-student/${studentId}`, {
        method: 'DELETE',
      })
        .then(() => {
          fetchStudents();  // Refresh the table
        })
        .catch(error => console.error('Error deleting student:', error));
    }
  
    // Edit student
    function editStudent(studentId, currentName, currentCourseId) {
      const newName = prompt('Enter new name:', currentName);
      const newCourseId = prompt('Enter new course ID:', currentCourseId);
  
      fetch(`/edit-student/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, course_id: newCourseId }),
      })
        .then(() => {
          fetchStudents();  // Refresh the table
        })
        .catch(error => console.error('Error editing student:', error));
    }
  });
  