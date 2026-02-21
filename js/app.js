// AULA VIRTUAL - app.js v2.0
console.log('app.js cargado - version 2.0');

const DB={
    init:function(){
        console.log('DB.init ejecutado');
        if(!localStorage.getItem('aulaUsers')){
            const defaultUsers=[
                {id:1,username:'admin',password:'admin123',email:'admin@aula.com',role:'admin',active:true,createdAt:new Date().toISOString()},
                {id:2,username:'estudiante',password:'estudiante123',email:'estudiante@aula.com',role:'user',active:true,createdAt:new Date().toISOString()}
            ];
            localStorage.setItem('aulaUsers',JSON.stringify(defaultUsers));
            console.log('Usuarios por defecto creados');
        }
        if(!localStorage.getItem('aulaCourses')){
            const defaultCourses=[
                {id:1,name:'JavaScript Moderno',description:'Aprende ES6+, async/await, modulos y mas',category:'programacion',icon:'🚀',link:'https://drive.google.com',createdAt:new Date().toISOString()},
                {id:2,name:'Diseño UI/UX',description:'Principios de diseño',category:'diseño',icon:'🎨',link:'https://drive.google.com',createdAt:new Date().toISOString()},
                {id:3,name:'Marketing Digital',description:'Estrategias de marketing',category:'marketing',icon:'📈',link:'https://drive.google.com',createdAt:new Date().toISOString()}
            ];
            localStorage.setItem('aulaCourses',JSON.stringify(defaultCourses));
            console.log('Cursos por defecto creados');
        }
        if(!localStorage.getItem('aulaActivity')){
            localStorage.setItem('aulaActivity',JSON.stringify([]));
        }
        if(!localStorage.getItem('aulaEnrollments')){
            localStorage.setItem('aulaEnrollments',JSON.stringify([]));
        }
    },
    getUsers:function(){return JSON.parse(localStorage.getItem('aulaUsers')||'[]')},
    setUsers:function(u){localStorage.setItem('aulaUsers',JSON.stringify(u))},
    getCourses:function(){return JSON.parse(localStorage.getItem('aulaCourses')||'[]')},
    setCourses:function(c){localStorage.setItem('aulaCourses',JSON.stringify(c))},
    getActivity:function(){return JSON.parse(localStorage.getItem('aulaActivity')||'[]')},
    addActivity:function(a){
        var act=this.getActivity();
        act.unshift({action:a,date:new Date().toISOString()});
        if(act.length>20)act.pop();
        localStorage.setItem('aulaActivity',JSON.stringify(act));
    },
    getEnrollments:function(){return JSON.parse(localStorage.getItem('aulaEnrollments')||'[]')},
    setEnrollments:function(e){localStorage.setItem('aulaEnrollments',JSON.stringify(e))}
};
function getSession(){return JSON.parse(localStorage.getItem('aulaSession')||'null')}
function setSession(u){localStorage.setItem('aulaSession',JSON.stringify(u))}
function clearSession(){localStorage.removeItem('aulaSession')}
function checkIfLoggedIn(){DB.init();const s=getSession();if(s)window.location.href='dashboard.html';document.getElementById('loginForm').addEventListener('submit',function(e){e.preventDefault();const u=document.getElementById('username').value.trim();const p=document.getElementById('password').value;const m=document.getElementById('loginMessage');const users=DB.getUsers();const user=users.find(x=>x.username===u&&x.password===p);if(user){setSession({id:user.id,username:user.username,role:user.role,email:user.email,createdAt:user.createdAt});DB.addActivity(user.username+' inicio sesion');window.location.href='dashboard.html'}else{m.textContent='Usuario o contraseña incorrectos';m.className='message error'}})}
function logout(){const s=getSession();if(s)DB.addActivity(s.username+' cerro sesion');clearSession();window.location.href='index.html'}
function togglePassword(id){const i=document.getElementById(id);const b=i.parentElement.querySelector('.toggle-password');if(i.type==='password'){i.type='text';b.classList.add('active')}else{i.type='password';b.classList.remove('active')}}
function getCategoryName(c){const cats={programacion:'Programación',diseño:'Diseño',marketing:'Marketing',negocios:'Negocios',idiomas:'Idiomas',otros:'Otros'};return cats[c]||c}
function initDashboard(){const s=getSession();if(!s){window.location.href='index.html';return}DB.init();const users=DB.getUsers();const currentUser=users.find(function(u){return u.id===s.id});if(!currentUser){clearSession();window.location.href='index.html';return}if(currentUser.active===false){clearSession();alert('Tu cuenta ha sido desactivada. Contacta al administrador.');window.location.href='index.html';return}document.getElementById('welcomeUser').textContent=s.username;document.getElementById('profileName').textContent=s.username;document.getElementById('profileRole').textContent=s.role==='admin'?'Administrador':'Estudiante';document.getElementById('profileUsername').value=s.username;document.getElementById('profileEmail').value=s.email||'Sin email';document.getElementById('profileDate').value=new Date(s.createdAt).toLocaleDateString('es-ES');document.getElementById('avatarInitial').textContent=s.username.charAt(0).toUpperCase();if(s.role==='admin')document.getElementById('adminBtn').style.display='flex';const allCourses=DB.getCourses();const myEnrollments=DB.getEnrollments().filter(function(e){return e.studentId===s.id&&e.status==='active'});const myCourseIds=myEnrollments.map(function(e){return e.courseId});const myCourses=allCourses.filter(function(c){return myCourseIds.indexOf(c.id)!==-1});document.getElementById('totalCourses').textContent=myCourses.length;document.getElementById('myCourses').textContent=myCourses.length;document.getElementById('enrolledCount').textContent=myCourses.length;renderCourses(myCourses);renderRecentCourses(myCourses.slice(0,3));renderMyEnrolledCourses(myEnrollments);setupNavigation()}
function renderCourses(courses){const g=document.getElementById('coursesGrid');if(courses.length===0){g.innerHTML='<div class="empty-state"><div class="empty-icon">📚</div><p>No hay cursos disponibles</p></div>';return}g.innerHTML=courses.map(c=>'<div class="course-card" onclick="openCourseDetail('+c.id+')"><div class="course-icon">'+(c.icon||'📚')+'</div><div class="course-info"><h3>'+c.name+'</h3><p>'+(c.description||'Sin descripción')+'</p><div class="course-meta"><span>'+getCategoryName(c.category)+'</span><span>'+new Date(c.createdAt).toLocaleDateString('es-ES')+'</span></div></div></div>').join('')}
function renderRecentCourses(courses){const c=document.getElementById('recentCourses');if(courses.length===0){c.innerHTML='<div class="empty-state"><div class="empty-icon">📭</div><p>No hay cursos disponibles aún</p></div>';return}c.innerHTML=courses.map(x=>'<div class="course-card" onclick="openCourseDetail('+x.id+')"><div class="course-icon">'+(x.icon||'📚')+'</div><div class="course-info"><h3>'+x.name+'</h3><p>'+(x.description||'Sin descripción')+'</p></div></div>').join('')}

function renderMyEnrolledCourses(enrollments){const c=document.getElementById('myEnrolledCourses');if(!c)return;if(enrollments.length===0){c.innerHTML='<div class="empty-state"><div class="empty-icon">🎓</div><p>No estás matriculado en ningún curso</p></div>';return}const courses=DB.getCourses();let html='';for(let i=0;i<enrollments.length;i++){const e=enrollments[i];const course=courses.find(function(cr){return cr.id===e.courseId});const icon=course?course.icon:'📚';html+='<div class="course-card" onclick="openCourseDetail('+e.courseId+')"><div class="course-icon">'+icon+'</div><div class="course-info"><h3>'+e.courseName+'</h3><p>Inicio: '+new Date(e.startDate).toLocaleDateString('es-ES')+'</p><div class="course-meta"><span class="status-badge status-active">Matriculado</span></div></div></div>'}c.innerHTML=html}
function openCourseDetail(id){const courses=DB.getCourses();const c=courses.find(x=>x.id===id);if(!c)return;document.getElementById('modalIcon').textContent=c.icon||'📚';document.getElementById('modalTitle').textContent=c.name;document.getElementById('modalDescription').textContent=c.description||'Sin descripción disponible';document.getElementById('modalCategory').textContent=getCategoryName(c.category);document.getElementById('modalDate').textContent=new Date(c.createdAt).toLocaleDateString('es-ES');document.getElementById('modalLink').href=c.link;document.getElementById('courseModal').classList.add('active')}
function closeModal(id){document.getElementById(id).classList.remove('active')}
function filterCourses(){const s=document.getElementById('searchCourses').value.toLowerCase();const c=document.getElementById('categoryFilter').value;let courses=DB.getCourses();if(s)courses=courses.filter(x=>x.name.toLowerCase().includes(s)||(x.description&&x.description.toLowerCase().includes(s)));if(c!=='all')courses=courses.filter(x=>x.category===c);renderCourses(courses)}
function setupNavigation(){const links=document.querySelectorAll('.nav-link');links.forEach(l=>{l.addEventListener('click',function(e){if(this.getAttribute('href')&&this.getAttribute('href').startsWith('#')){e.preventDefault();const t=this.getAttribute('href').substring(1);showSection(t);links.forEach(x=>x.classList.remove('active'));this.classList.add('active')}})});document.getElementById('navToggle')&&document.getElementById('navToggle').addEventListener('click',function(){document.getElementById('navMenu').classList.toggle('active')})}
function showSection(id){document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));document.getElementById(id)&&document.getElementById(id).classList.add('active')}
function scrollToSection(id){showSection(id);const links=document.querySelectorAll('.nav-link');links.forEach(l=>{l.classList.remove('active');if(l.getAttribute('href')==='#'+id)l.classList.add('active')})}
function changeUserPassword(e){e.preventDefault();const s=getSession();const curr=document.getElementById('currentPassword').value;const npass=document.getElementById('newPassword').value;const cpass=document.getElementById('confirmNewPassword').value;const m=document.getElementById('passwordMessage');const users=DB.getUsers();const idx=users.findIndex(x=>x.id===s.id);if(idx===-1){m.textContent='Error: usuario no encontrado';m.className='message error';return}if(users[idx].password!==curr){m.textContent='La contraseña actual es incorrecta';m.className='message error';return}if(npass!==cpass){m.textContent='Las contraseñas no coinciden';m.className='message error';return}if(npass.length<4){m.textContent='La contraseña debe tener al menos 4 caracteres';m.className='message error';return}users[idx].password=npass;DB.setUsers(users);m.textContent='Contraseña cambiada exitosamente';m.className='message success';document.getElementById('changePasswordForm').reset();DB.addActivity(s.username+' cambio su contraseña');setTimeout(()=>{m.className='message'},3000)}
function initAdmin(){console.log('=== INIT ADMIN ===');const s=getSession();if(!s||s.role!=='admin'){window.location.href='dashboard.html';return}DB.init();console.log('DB inicializado');setupAdminTabs();renderUsersTable();renderAdminCourses();updateStats();renderActivityTimeline();loadEnrollmentSelects();renderEnrollments();const btnEnroll=document.getElementById('btnEnrollStudent');if(btnEnroll){btnEnroll.addEventListener('click',function(){console.log('BOTON CLICKEADO');enrollStudent()})}document.getElementById('navToggle')&&document.getElementById('navToggle').addEventListener('click',function(){document.getElementById('navMenu').classList.toggle('active')});const today=new Date().toISOString().split('T')[0];const startDateInput=document.getElementById('enrollStartDate');if(startDateInput){startDateInput.value=today}console.log('=== INIT ADMIN COMPLETE ===')}
function setupAdminTabs(){const tabs=document.querySelectorAll('.tab-btn');tabs.forEach(t=>{t.addEventListener('click',function(){const id=this.dataset.tab;tabs.forEach(x=>x.classList.remove('active'));this.classList.add('active');document.querySelectorAll('.tab-content').forEach(x=>x.classList.remove('active'));document.getElementById(id+'-tab').classList.add('active');if(id==='enrollments'){loadEnrollmentSelects();renderEnrollments()}})})}
function renderUsersTable(){const users=DB.getUsers();const tbody=document.getElementById('usersTableBody');let html='';for(let i=0;i<users.length;i++){const u=users[i];const isActive=u.active!==false;const statusClass=isActive?'status-active':'status-inactive';const statusText=isActive?'Activo':'Inactivo';const toggleBtn=isActive?'<button class="btn-sm btn-cancel" onclick="toggleUserStatus('+u.id+',false)">🔒 Bloquear</button>':'<button class="btn-sm btn-view" onclick="toggleUserStatus('+u.id+',true)">🔓 Activar</button>';html+='<tr><td><strong>'+u.username+'</strong></td><td>'+(u.email||'-')+'</td><td><span style="color:'+(u.role==='admin'?'var(--accent)':'var(--success)')+'">'+(u.role==='admin'?'Admin':'Estudiante')+'</span></td><td><span class="status-badge '+statusClass+'">'+statusText+'</span></td><td>'+new Date(u.createdAt).toLocaleDateString('es-ES')+'</td><td><div class="action-buttons"><button class="btn-edit" onclick="editUser('+u.id+')">Editar</button>'+(u.id!==1?toggleBtn:'')+(u.id!==1?'<button class="btn-delete" onclick="deleteUser('+u.id+')">Eliminar</button>':'')+'</div></td></tr>'}tbody.innerHTML=html}
function filterUsers(){const search=document.getElementById('searchUsers').value.toLowerCase();const users=DB.getUsers();const filtered=users.filter(function(u){return u.username.toLowerCase().includes(search)||(u.email&&u.email.toLowerCase().includes(search))});const tbody=document.getElementById('usersTableBody');let html='';for(let i=0;i<filtered.length;i++){const u=filtered[i];const isActive=u.active!==false;const statusClass=isActive?'status-active':'status-inactive';const statusText=isActive?'Activo':'Inactivo';const toggleBtn=isActive?'<button class="btn-sm btn-cancel" onclick="toggleUserStatus('+u.id+',false)">🔒 Bloquear</button>':'<button class="btn-sm btn-view" onclick="toggleUserStatus('+u.id+',true)">🔓 Activar</button>';html+='<tr><td><strong>'+u.username+'</strong></td><td>'+(u.email||'-')+'</td><td><span style="color:'+(u.role==='admin'?'var(--accent)':'var(--success)')+'">'+(u.role==='admin'?'Admin':'Estudiante')+'</span></td><td><span class="status-badge '+statusClass+'">'+statusText+'</span></td><td>'+new Date(u.createdAt).toLocaleDateString('es-ES')+'</td><td><div class="action-buttons"><button class="btn-edit" onclick="editUser('+u.id+')">Editar</button>'+(u.id!==1?toggleBtn:'')+(u.id!==1?'<button class="btn-delete" onclick="deleteUser('+u.id+')">Eliminar</button>':'')+'</div></td></tr>'}tbody.innerHTML=html}
function openUserModal(editId=null){document.getElementById('userModalTitle').textContent=editId?'Editar Usuario':'Nuevo Usuario';document.getElementById('editUserId').value=editId||'';document.getElementById('userForm').reset();if(editId){const users=DB.getUsers();const u=users.find(x=>x.id===editId);if(u){document.getElementById('newUsername').value=u.username;document.getElementById('newEmail').value=u.email||'';document.getElementById('newRole').value=u.role;document.getElementById('passwordGroup').style.display='none'}}else{document.getElementById('passwordGroup').style.display='block'}document.getElementById('userModal').classList.add('active')}
function editUser(id){openUserModal(id)}
function saveUser(e){e.preventDefault();const editId=document.getElementById('editUserId').value;const username=document.getElementById('newUsername').value.trim();const email=document.getElementById('newEmail').value.trim();const password=document.getElementById('newUserPassword').value;const role=document.getElementById('newRole').value;const users=DB.getUsers();if(editId){const idx=users.findIndex(x=>x.id===parseInt(editId));if(idx!==-1){const exists=users.find(x=>x.username===username&&x.id!==parseInt(editId));if(exists){showToast('El nombre de usuario ya existe','error');return}users[idx].username=username;users[idx].email=email;users[idx].role=role;DB.setUsers(users);DB.addActivity('Usuario '+username+' actualizado');showToast('Usuario actualizado correctamente')}}else{if(users.find(x=>x.username===username)){showToast('El nombre de usuario ya existe','error');return}if(!password){showToast('La contraseña es requerida','error');return}const newUser={id:Date.now(),username:username,email:email,password:password,role:role,active:true,createdAt:new Date().toISOString()};users.push(newUser);DB.setUsers(users);DB.addActivity('Nuevo usuario creado: '+username);showToast('Usuario creado correctamente')}closeModal('userModal');renderUsersTable();updateStats();loadEnrollmentSelects()}

function toggleUserStatus(userId,activate){const users=DB.getUsers();const idx=users.findIndex(function(u){return u.id===userId});if(idx===-1)return;const user=users[idx];users[idx].active=activate;DB.setUsers(users);DB.addActivity((activate?'Usuario activado: ':'Usuario bloqueado: ')+user.username);showToast(activate?'Usuario activado':'Usuario bloqueado');renderUsersTable()}
function deleteUser(id){document.getElementById('confirmMessage').textContent='¿Estás seguro de eliminar este usuario?';document.getElementById('confirmBtn').onclick=function(){const users=DB.getUsers();const u=users.find(x=>x.id===id);const f=users.filter(x=>x.id!==id);DB.setUsers(f);DB.addActivity('Usuario eliminado: '+(u?u.username:''));closeModal('confirmModal');renderUsersTable();updateStats();loadEnrollmentSelects();showToast('Usuario eliminado correctamente')};document.getElementById('confirmModal').classList.add('active')}
function renderAdminCourses(){const courses=DB.getCourses();const g=document.getElementById('coursesAdminGrid');if(courses.length===0){g.innerHTML='<div class="empty-state"><div class="empty-icon">📚</div><p>No hay cursos creados</p></div>';return}g.innerHTML=courses.map(c=>'<div class="course-admin-card"><div class="course-admin-header"><div class="course-admin-icon">'+(c.icon||'📚')+'</div><div class="course-admin-title"><h3>'+c.name+'</h3><span>'+getCategoryName(c.category)+'</span></div></div><div class="course-admin-body"><p>'+(c.description||'Sin descripción')+'</p><div class="course-admin-actions"><button class="btn-edit" onclick="editCourse('+c.id+')">Editar</button><button class="btn-delete" onclick="deleteCourse('+c.id+')">Eliminar</button></div></div></div>').join('')}
function filterAdminCourses(){const s=document.getElementById('searchAdminCourses').value.toLowerCase();const courses=DB.getCourses();const f=courses.filter(x=>x.name.toLowerCase().includes(s)||(x.description&&x.description.toLowerCase().includes(s)));const g=document.getElementById('coursesAdminGrid');if(f.length===0){g.innerHTML='<div class="empty-state"><div class="empty-icon">🔍</div><p>No se encontraron cursos</p></div>';return}g.innerHTML=f.map(c=>'<div class="course-admin-card"><div class="course-admin-header"><div class="course-admin-icon">'+(c.icon||'📚')+'</div><div class="course-admin-title"><h3>'+c.name+'</h3><span>'+getCategoryName(c.category)+'</span></div></div><div class="course-admin-body"><p>'+(c.description||'Sin descripción')+'</p><div class="course-admin-actions"><button class="btn-edit" onclick="editCourse('+c.id+')">Editar</button><button class="btn-delete" onclick="deleteCourse('+c.id+')">Eliminar</button></div></div></div>').join('')}
function openCourseModal(editId=null){document.getElementById('courseModalTitle').textContent=editId?'Editar Curso':'Nuevo Curso';document.getElementById('editCourseId').value=editId||'';document.getElementById('courseForm').reset();if(editId){const courses=DB.getCourses();const c=courses.find(x=>x.id===editId);if(c){document.getElementById('courseName').value=c.name;document.getElementById('courseDescription').value=c.description||'';document.getElementById('courseCategory').value=c.category;document.getElementById('courseIcon').value=c.icon||'';document.getElementById('courseLink').value=c.link}}document.getElementById('courseFormModal').classList.add('active')}
function editCourse(id){openCourseModal(id)}
function saveCourse(e){e.preventDefault();const editId=document.getElementById('editCourseId').value;const name=document.getElementById('courseName').value.trim();const description=document.getElementById('courseDescription').value.trim();const category=document.getElementById('courseCategory').value;const icon=document.getElementById('courseIcon').value.trim()||'📚';const link=document.getElementById('courseLink').value.trim();const courses=DB.getCourses();if(editId){const idx=courses.findIndex(x=>x.id===parseInt(editId));if(idx!==-1){courses[idx]={...courses[idx],name,description,category,icon,link};DB.setCourses(courses);DB.addActivity('Curso actualizado: '+name);showToast('Curso actualizado correctamente')}}else{const newCourse={id:Date.now(),name,description,category,icon,link,createdAt:new Date().toISOString()};courses.push(newCourse);DB.setCourses(courses);DB.addActivity('Nuevo curso creado: '+name);showToast('Curso creado correctamente')}closeModal('courseFormModal');renderAdminCourses();updateStats();loadEnrollmentSelects()}
function deleteCourse(id){document.getElementById('confirmMessage').textContent='¿Estás seguro de eliminar este curso?';document.getElementById('confirmBtn').onclick=function(){const courses=DB.getCourses();const c=courses.find(x=>x.id===id);const f=courses.filter(x=>x.id!==id);DB.setCourses(f);DB.addActivity('Curso eliminado: '+(c?c.name:''));closeModal('confirmModal');renderAdminCourses();updateStats();loadEnrollmentSelects();showToast('Curso eliminado correctamente')};document.getElementById('confirmModal').classList.add('active')}
function updateStats(){const users=DB.getUsers();const courses=DB.getCourses();const enrollments=DB.getEnrollments();const admins=users.filter(x=>x.role==='admin');const cats=[...new Set(courses.map(x=>x.category))];document.getElementById('statUsers').textContent=users.length;document.getElementById('statCourses').textContent=courses.length;document.getElementById('statAdmins').textContent=admins.length;document.getElementById('statCategories').textContent=cats.length;const statEnrollments=document.getElementById('statEnrollments');if(statEnrollments)statEnrollments.textContent=enrollments.length}
function renderActivityTimeline(){const act=DB.getActivity();const tl=document.getElementById('activityTimeline');if(act.length===0){tl.innerHTML='<div class="empty-state"><p>No hay actividad reciente</p></div>';return}tl.innerHTML=act.slice(0,10).map(a=>'<div class="activity-item"><div class="activity-icon">📌</div><div class="activity-info"><span class="activity-title">'+a.action+'</span><span class="activity-value">'+formatDate(a.date)+'</span></div></div>').join('')}
function formatDate(d){const date=new Date(d);const now=new Date();const diff=now-date;const mins=Math.floor(diff/60000);const hrs=Math.floor(diff/3600000);const days=Math.floor(diff/86400000);if(mins<1)return'Ahora';if(mins<60)return'Hace '+mins+' min';if(hrs<24)return'Hace '+hrs+' h';return'Hace '+days+' días'}
function showToast(msg,type='success'){const t=document.getElementById('toast');t.textContent=msg;t.className='toast '+type+' show';setTimeout(()=>{t.classList.remove('show')},3000)}
window.addEventListener('click',function(e){if(e.target.classList.contains('modal'))e.target.classList.remove('active')});

let currentEnrollmentId=null;

function loadEnrollmentSelects(){const users=DB.getUsers().filter(function(u){return u.role==='user'});const courses=DB.getCourses();console.log('Estudiantes encontrados:',users.length);console.log('Cursos encontrados:',courses.length);const studentSelect=document.getElementById('enrollStudent');const courseSelect=document.getElementById('enrollCourse');if(!studentSelect||!courseSelect){console.log('ERROR: No se encontraron los selects');return}if(users.length===0){studentSelect.innerHTML='<option value="">No hay estudiantes registrados</option>'}else{let options='<option value="">-- Seleccionar estudiante --</option>';for(let i=0;i<users.length;i++){options+='<option value="'+users[i].id+'">'+users[i].username+(users[i].email?' ('+users[i].email+')':'')+'</option>'}studentSelect.innerHTML=options}if(courses.length===0){courseSelect.innerHTML='<option value="">No hay cursos disponibles</option>'}else{let options='<option value="">-- Seleccionar curso --</option>';for(let i=0;i<courses.length;i++){options+='<option value="'+courses[i].id+'">'+(courses[i].icon||'📚')+' '+courses[i].name+'</option>'}courseSelect.innerHTML=options}console.log('Selects cargados correctamente')}

function enrollStudent(){
    console.log('=== enrollStudent() EJECUTADO ===');
    alert('FUNCION enrollStudent EJECUTADA!');
    
    var studentSelect=document.getElementById('enrollStudent');
    var courseSelect=document.getElementById('enrollCourse');
    var startDateInput=document.getElementById('enrollStartDate');
    var notesInput=document.getElementById('enrollNotes');
    
    if(!studentSelect){
        alert('ERROR: No se encuentra el select de estudiante');
        return;
    }
    if(!courseSelect){
        alert('ERROR: No se encuentra el select de curso');
        return;
    }
    
    var studentId=parseInt(studentSelect.value);
    var courseId=parseInt(courseSelect.value);
    var startDate=startDateInput?startDateInput.value:'';
    var notes=notesInput?notesInput.value.trim():'';
    
    console.log('studentId='+studentId+', courseId='+courseId+', startDate='+startDate);
    
    if(!studentId||isNaN(studentId)||studentId===0){
        alert('Por favor selecciona un estudiante');
        return;
    }
    if(!courseId||isNaN(courseId)||courseId===0){
        alert('Por favor selecciona un curso');
        return;
    }
    if(!startDate){
        alert('Por favor ingresa una fecha de inicio');
        return;
    }
    
    var enrollments=DB.getEnrollments();
    var existing=enrollments.find(function(en){
        return en.studentId===studentId&&en.courseId===courseId&&en.status!=='cancelled';
    });
    
    if(existing){
        alert('Este estudiante ya está matriculado en este curso');
        return;
    }
    
    var users=DB.getUsers();
    var courses=DB.getCourses();
    var student=users.find(function(u){return u.id===studentId});
    var course=courses.find(function(c){return c.id===courseId});
    
    if(!student){
        alert('Error: Estudiante no encontrado');
        return;
    }
    if(!course){
        alert('Error: Curso no encontrado');
        return;
    }
    
    var newEnrollment={
        id:Date.now(),
        studentId:studentId,
        courseId:courseId,
        studentName:student.username,
        studentEmail:student.email||'',
        courseName:course.name,
        courseCategory:course.category,
        startDate:startDate,
        enrollmentDate:new Date().toISOString(),
        notes:notes,
        status:'active'
    };
    
    enrollments.push(newEnrollment);
    DB.setEnrollments(enrollments);
    DB.addActivity(student.username+' matriculado en '+course.name);
    
    alert('¡Estudiante '+student.username+' matriculado exitosamente en '+course.name+'!');
    
    var today=new Date().toISOString().split('T')[0];
    if(startDateInput)startDateInput.value=today;
    if(studentSelect)studentSelect.value='';
    if(courseSelect)courseSelect.value='';
    if(notesInput)notesInput.value='';
    
    renderEnrollments();
    updateStats();
}

function renderEnrollments(){console.log('=== RENDER ENROLLMENTS ===');const allEnrollments=DB.getEnrollments();console.log('Todas las matriculaciones:',allEnrollments);const enrollments=allEnrollments.filter(function(e){return e.status!=='cancelled'});console.log('Matriculaciones no canceladas:',enrollments);const grid=document.getElementById('enrollmentsGrid');if(!grid){console.log('ERROR: Grid element no encontrado');return}if(enrollments.length===0){console.log('No hay matriculaciones, mostrando estado vacío');grid.innerHTML='<div class="empty-state"><div class="empty-icon">📭</div><p>No hay matriculaciones registradas</p></div>';return}const courses=DB.getCourses();console.log('Cursos disponibles:',courses);let html='';for(let i=0;i<enrollments.length;i++){const e=enrollments[i];const course=courses.find(function(c){return c.id===e.courseId});const icon=course?course.icon:'📚';const isActive=e.status==='active';const statusClass=isActive?'status-active':'status-suspended';const statusText=isActive?'Activo':'Suspendido';const toggleBtn=isActive?'<button class="btn-sm btn-cancel" onclick="toggleEnrollmentAccess('+e.id+',false)">🚫 Quitar Acceso</button>':'<button class="btn-sm btn-view" onclick="toggleEnrollmentAccess('+e.id+',true)">✅ Dar Acceso</button>';html+='<div class="enrollment-card"><div class="enrollment-card-header"><div class="enrollment-avatar">'+e.studentName.charAt(0).toUpperCase()+'</div><div class="enrollment-card-info"><h4>'+e.studentName+'</h4><span>'+(e.studentEmail||'Sin email')+'</span></div></div><div class="enrollment-card-body"><p><strong>Curso:</strong> '+icon+' '+e.courseName+'</p><p><strong>Inicio:</strong> '+new Date(e.startDate).toLocaleDateString('es-ES')+'</p><p><strong>Estado:</strong> <span class="status-badge '+statusClass+'">'+statusText+'</span></p></div><div class="enrollment-card-footer"><button class="btn-sm btn-view" onclick="viewEnrollment('+e.id+')">👁️ Ver</button>'+toggleBtn+'<button class="btn-sm btn-cancel" onclick="cancelEnrollment('+e.id+')">✖️ Eliminar</button></div></div>'}grid.innerHTML=html;console.log('Renderizadas',enrollments.length,'matriculaciones')}

function toggleEnrollmentAccess(enrollmentId,grantAccess){const enrollments=DB.getEnrollments();const idx=enrollments.findIndex(function(e){return e.id===enrollmentId});if(idx===-1)return;const enrollment=enrollments[idx];enrollments[idx].status=grantAccess?'active':'suspended';DB.setEnrollments(enrollments);DB.addActivity((grantAccess?'Acceso concedido a ':'Acceso revocado a ')+enrollment.studentName+' en '+enrollment.courseName);showToast(grantAccess?'Acceso al curso concedido':'Acceso al curso revocado');renderEnrollments()}

function filterEnrollments(){const search=document.getElementById('searchEnrollments').value.toLowerCase();let enrollments=DB.getEnrollments().filter(function(e){return e.status==='active'});if(search){enrollments=enrollments.filter(function(e){return e.studentName.toLowerCase().includes(search)||e.courseName.toLowerCase().includes(search)})}const grid=document.getElementById('enrollmentsGrid');if(!grid)return;if(enrollments.length===0){grid.innerHTML='<div class="empty-state"><div class="empty-icon">🔍</div><p>No se encontraron matriculaciones</p></div>';return}const courses=DB.getCourses();let html='';for(let i=0;i<enrollments.length;i++){const e=enrollments[i];const course=courses.find(function(c){return c.id===e.courseId});const icon=course?course.icon:'📚';html+='<div class="enrollment-card"><div class="enrollment-card-header"><div class="enrollment-avatar">'+e.studentName.charAt(0).toUpperCase()+'</div><div class="enrollment-card-info"><h4>'+e.studentName+'</h4><span>'+(e.studentEmail||'Sin email')+'</span></div></div><div class="enrollment-card-body"><p><strong>Curso:</strong> '+icon+' '+e.courseName+'</p><p><strong>Inicio:</strong> '+new Date(e.startDate).toLocaleDateString('es-ES')+'</p></div><div class="enrollment-card-footer"><button class="btn-sm btn-view" onclick="viewEnrollment('+e.id+')">👁️ Ver</button><button class="btn-sm btn-cancel" onclick="cancelEnrollment('+e.id+')">✖️ Cancelar</button></div></div>'}grid.innerHTML=html}

function viewEnrollment(id){const enrollments=DB.getEnrollments();const enrollment=enrollments.find(function(e){return e.id===id});if(!enrollment)return;currentEnrollmentId=id;const courses=DB.getCourses();const course=courses.find(function(c){return c.id===enrollment.courseId});const icon=course?course.icon:'📚';const modalBody=document.getElementById('enrollmentModalBody');if(!modalBody)return;let notesHtml='';if(enrollment.notes){notesHtml='<div class="enrollment-detail-row"><span class="enrollment-detail-label">Notas</span><span class="enrollment-detail-value">'+enrollment.notes+'</span></div>'}modalBody.innerHTML='<div class="enrollment-detail"><div class="enrollment-detail-row"><span class="enrollment-detail-label">Estudiante</span><span class="enrollment-detail-value">'+enrollment.studentName+'</span></div><div class="enrollment-detail-row"><span class="enrollment-detail-label">Email</span><span class="enrollment-detail-value">'+(enrollment.studentEmail||'-')+'</span></div><div class="enrollment-detail-row"><span class="enrollment-detail-label">Curso</span><span class="enrollment-detail-value">'+icon+' '+enrollment.courseName+'</span></div><div class="enrollment-detail-row"><span class="enrollment-detail-label">Categoría</span><span class="enrollment-detail-value">'+getCategoryName(enrollment.courseCategory)+'</span></div><div class="enrollment-detail-row"><span class="enrollment-detail-label">Fecha de Inicio</span><span class="enrollment-detail-value">'+new Date(enrollment.startDate).toLocaleDateString('es-ES')+'</span></div><div class="enrollment-detail-row"><span class="enrollment-detail-label">Fecha de Matriculación</span><span class="enrollment-detail-value">'+new Date(enrollment.enrollmentDate).toLocaleDateString('es-ES')+'</span></div><div class="enrollment-detail-row"><span class="enrollment-detail-label">Estado</span><span class="enrollment-detail-value"><span class="status-badge status-active">Activo</span></span></div><div class="enrollment-detail-row"><span class="enrollment-detail-label">ID de Matriculación</span><span class="enrollment-detail-value">#'+enrollment.id+'</span></div>'+notesHtml+'</div>';document.getElementById('enrollmentModal').classList.add('active')}

function cancelEnrollment(id){document.getElementById('confirmMessage').textContent='¿Estás seguro de cancelar esta matriculación?';document.getElementById('confirmBtn').onclick=function(){const enrollments=DB.getEnrollments();const idx=enrollments.findIndex(e=>e.id===id);if(idx!==-1){enrollments[idx].status='cancelled';DB.setEnrollments(enrollments);DB.addActivity('Matriculación cancelada: '+enrollments[idx].studentName+' - '+enrollments[idx].courseName);closeModal('confirmModal');renderEnrollments();updateStats();showToast('Matriculación cancelada')}};document.getElementById('confirmModal').classList.add('active')}

function printEnrollmentSheet(){if(!currentEnrollmentId)return;const enrollments=DB.getEnrollments();const enrollment=enrollments.find(function(e){return e.id===currentEnrollmentId});if(!enrollment)return;const courses=DB.getCourses();const course=courses.find(function(c){return c.id===enrollment.courseId});const icon=course?course.icon:'📚';const sheetInfo=document.getElementById('sheetInfo');if(!sheetInfo)return;let notesRow='';if(enrollment.notes){notesRow='<div class="sheet-row"><div class="sheet-label">Observaciones</div><div class="sheet-value">'+enrollment.notes+'</div></div>'}sheetInfo.innerHTML='<div class="sheet-row"><div class="sheet-label">Nº de Matriculación</div><div class="sheet-value">#'+enrollment.id+'</div></div><div class="sheet-row"><div class="sheet-label">Fecha de Matriculación</div><div class="sheet-value">'+new Date(enrollment.enrollmentDate).toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'})+'</div></div><div class="sheet-row"><div class="sheet-label">Nombre del Estudiante</div><div class="sheet-value">'+enrollment.studentName.toUpperCase()+'</div></div><div class="sheet-row"><div class="sheet-label">Email</div><div class="sheet-value">'+(enrollment.studentEmail||'-')+'</div></div><div class="sheet-row"><div class="sheet-label">Curso</div><div class="sheet-value">'+icon+' '+enrollment.courseName+'</div></div><div class="sheet-row"><div class="sheet-label">Categoría</div><div class="sheet-value">'+getCategoryName(enrollment.courseCategory)+'</div></div><div class="sheet-row"><div class="sheet-label">Fecha de Inicio</div><div class="sheet-value">'+new Date(enrollment.startDate).toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'})+'</div></div><div class="sheet-row"><div class="sheet-label">Estado</div><div class="sheet-value">ACTIVO</div></div>'+notesRow;const printSheet=document.getElementById('printSheet');if(printSheet){printSheet.classList.add('active');window.print();setTimeout(function(){printSheet.classList.remove('active')},100)}}

function sendEnrollmentEmail(){if(!currentEnrollmentId)return;const enrollments=DB.getEnrollments();const enrollment=enrollments.find(function(e){return e.id===currentEnrollmentId});if(!enrollment)return;if(!enrollment.studentEmail){showToast('El estudiante no tiene email registrado','error');return}const courses=DB.getCourses();const course=courses.find(function(c){return c.id===enrollment.courseId});const icon=course?course.icon:'📚';const subject=encodeURIComponent('Confirmación de Matriculación - Aula Virtual');const body=encodeURIComponent('¡Hola '+enrollment.studentName+'!\n\nTe confirmamos tu matriculación en el curso:\n\n📚 Curso: '+icon+' '+enrollment.courseName+'\n📅 Fecha de inicio: '+new Date(enrollment.startDate).toLocaleDateString('es-ES')+'\n🆔 Nº de matriculación: #'+enrollment.id+'\n\nPuedes acceder al curso desde tu panel de estudiante.\n\n¡Bienvenido/a!\n\nEquipo de Aula Virtual');window.open('mailto:'+enrollment.studentEmail+'?subject='+subject+'&body='+body);DB.addActivity('Ficha de inscripción enviada a '+enrollment.studentName);showToast('Cliente de correo abierto')}
