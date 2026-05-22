const SUPABASE_URL ="https://akodraeqesulsofaanna.supabase.co";
const SUPABASE_KEY ="sb_publishable_q6jaRXcDuGa6qXCU4FZrfA_OObM1r2C";
const client =supabase.createClient(SUPABASE_URL,SUPABASE_KEY );

// Global Toast Notifications replacing native alert()
window.showToast = function(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    if (type === 'success') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else if (type === 'warning') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
    
    toast.innerHTML = `<div class="toast-icon">${icon}</div><div>${message}</div>`;
    container.appendChild(toast);
    
    // trigger reflow
    void toast.offsetWidth;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

window.alert = function(message) {
    let type = 'info';
    const msg = message.toLowerCase();
    if (msg.includes('success') || msg.includes('added') || msg.includes('deleted') || msg.includes('updated')) {
        type = 'success';
    } else if (msg.includes('error') || msg.includes('failed') || msg.includes('invalid') || msg.includes('incorrect') || msg.includes('not found')) {
        type = 'error';
    } else if (msg.includes('please fill') || msg.includes('exists')) {
        type = 'warning';
    }
    window.showToast(message, type);
};

// Global Confirm Modal replacing native confirm()
window.showConfirm = function(message) {
    return new Promise((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="confirm-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
            <h3 class="confirm-title">Are you sure?</h3>
            <p class="confirm-message">${message}</p>
            <div class="confirm-actions">
                <button class="confirm-btn confirm-cancel">Cancel</button>
                <button class="confirm-btn confirm-delete">Delete</button>
            </div>
        `;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // trigger reflow for animation
        void overlay.offsetWidth;
        overlay.classList.add('show');
        
        const cleanup = (result) => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 250);
            resolve(result);
        };
        
        modal.querySelector('.confirm-cancel').addEventListener('click', () => cleanup(false));
        modal.querySelector('.confirm-delete').addEventListener('click', () => cleanup(true));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(false); });
    });
};

window.onload = function () 
{
    loadCoursesDropdown();
    loadUsers();
    loadCoursesTable();
    loadVideosTable();
    loadQuizDropdown();
    loadQuizTable();
    loadCollegeTable();
};

window.showPage = function(pageId,element)
 {

    document.querySelectorAll(".page").forEach(page => {page.classList.remove("active");});
    document.querySelectorAll(".menu-item").forEach(item => {item.classList.remove("active");});

    document
        .getElementById(pageId)
        .classList.add("active");

    element.classList.add("active");
};

/* SEARCH TABLE */

window.searchTable = function (input,tableId) 
{
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach(row => {
        const text =row.innerText.toLowerCase();
        row.style.display = text.includes(filter)? "": "none";
    });
};


window.selectRole = function (element, role) 
{

    document.querySelectorAll(".role-option").forEach(card => {card.classList.remove("active");});
    element.classList.add("active");
    document.getElementById("role").value = role;
};

window.doLogin = async function () 
{

    const username =document.getElementById("username").value;
    const password =document.getElementById("password").value;
    const role =document.getElementById("role").value;
    await login(username,password,role);
};

async function login(username,password,role)
{

    const { data, error } = await client.from("login").select("*").eq("username", username).eq("password", password).eq("role",role);
    if (error) 
    {
        document.getElementById("msg").innerHTML =error.message;
        return;
    }

    if (data.length === 0) 
    {
        document.getElementById("msg").innerHTML = "Invalid Username or Password";
        return;
    }

    const user = data[0];
    localStorage.setItem("user",username);
    localStorage.setItem("role",user.role);

    /* ROLE BASED REDIRECT */

    if (user.role === "Admin")
    {
        window.location ="admin.html";
    }
    else 
    {
        window.location ="dashboard.html";
    }
}

/* CREATE USER */

window.createUser = async function () 
{
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    const role = document.getElementById("newRole").value;
    
    if (!username || !password || !role) {
        alert("Please fill all required fields");
        return;
    }
    
    const { data: existingUser, error: checkError } = await client
        .from("login")
        .select("id")
        .eq("username", username);
        
    if (checkError) {
        alert("An error occurred while checking username.");
        return;
    }
    
    if (existingUser && existingUser.length > 0) {
        alert("Username already exists. Please choose a different username.");
        return;
    }

    const { error } =
        await client
            .from("login")
            .insert([
                {
                    username,
                    password,
                    role
                }
            ]);

    if (error) 
    {
        if (error.code === '23505') {
            alert("Username already exists. Please choose a different username.");
        } else {
            alert("An error occurred while creating user.");
        }
        return;
    }

    /* CLEAR FIELDS */

    document.getElementById("newUsername").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("newRole").selectedIndex = 0;
    alert("User Created Successfully");
    loadUsers();
};

/* LOAD USERS */

async function loadUsers() 
{
    const { data, error } =await client.from("login").select("*");
    if (error)
    {
        console.log(error);
        return;
    }
    const body =document.getElementById("usersBody");
    body.innerHTML = "";
    data.forEach(user => {
        body.innerHTML += `
            <tr>
                <td data-label="Username">
                    ${user.username}
                </td>
                <td data-label="Password">
                    ${user.password}
                </td>
                <td data-label="Role">
                    ${user.role}
                </td>
                <td data-label="Action">
                    <button
                        class="action-btn edit-btn"
                        onclick="editUser('${user.id}')">
                        Edit
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteUser('${user.id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

/* OPEN EDIT POPUP */

async function editUser(id) 
{
    console.log("Edit Clicked");
    const { data, error } =await client.from("login").select("*").eq("id", id).single();
    if (error)
    {
        alert(error.message);
        return;
    }

    document.getElementById("editUserId").value = data.id;
    document.getElementById("editUsername").value = data.username;
    document.getElementById("editPassword").value = data.password;
    document.getElementById("editRole").value = data.role;
    document.getElementById("editUserModal").style.display = "flex";
}

/* CLOSE POPUP */

function closeEditModal() 
{
    document.getElementById("editUserModal").style.display = "none";
}

/* UPDATE USER */

async function updateUser() 
{
    const id = document.getElementById("editUserId").value;
    const username = document.getElementById("editUsername").value.trim();
    const password = document.getElementById("editPassword").value.trim();
    const role = document.getElementById("editRole").value;

    if (!username || !password || !role) {
        alert("Please fill all required fields");
        return;
    }
    
    const { data: existingUser, error: checkError } = await client
        .from("login")
        .select("id")
        .eq("username", username)
        .neq("id", id);
        
    if (checkError) {
        alert("An error occurred while checking username.");
        return;
    }
    
    if (existingUser && existingUser.length > 0) {
        alert("Username already exists. Please choose a different username.");
        return;
    }

    const { error } =
        await client
            .from("login")
            .update({
                username,
                password,
                role
            })
            .eq("id", id);

    if (error) 
    {
        if (error.code === '23505') {
            alert("Username already exists. Please choose a different username.");
        } else {
            alert("An error occurred while updating user.");
        }
        return;
    }
    alert("User Updated Successfully");
    closeEditModal();
    loadUsers();
}

/* DELETE USER */

async function deleteUser(id) 
{
    const ok = await showConfirm("This user will be permanently removed. This action cannot be undone.");
    if (!ok) 
    {
        return;
    }
    const { error } =await client.from("login").delete().eq("id", id);
    if (error) 
    {
        alert(error.message);
        return;
    }
    alert("User Deleted");
    loadUsers();
}

/* GLOBAL FUNCTIONS */

window.editUser = editUser;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
window.closeEditModal = closeEditModal;

/* LOAD COURSES IN DROPDOWN */

async function loadCoursesDropdown() 
{
    const { data, error } = await client.from("courses").select("*");
    if (error)
    {
        return;
    }
    const dropdown =document.getElementById("videoCourse");
    dropdown.innerHTML = "";
    data.forEach(course => {
        dropdown.innerHTML += `
            <option value="${course.id}">
                ${course.title}
            </option>
        `;
    });
}

/* ADD COURSE */

window.addCourse = async function ()
{
    const title = document.getElementById("courseTitle").value.trim();
    const description = document.getElementById("courseDescription").value.trim();
    const file = document.getElementById("courseThumbnail").files[0];
    
    if (!title || !description || !file)
    {
        alert("Please fill all required fields");
        return;
    }

    /* UNIQUE FILE NAME */

    const fileName =Date.now() +"_" +file.name;

    /* UPLOAD IMAGE */
    const { error: uploadError } =await client.storage.from("thumbnails").upload(fileName,file);

    if (uploadError) 
    {
        alert("An error occurred while uploading thumbnail.");
        return;
    }

    /* GET PUBLIC URL */
    const { data } =client.storage.from("thumbnails").getPublicUrl(fileName);
    const thumbnail = data.publicUrl;

    /* SAVE COURSE */

    const { error } =
        await client
            .from("courses")
            .insert([
                {
                    title,
                    description,
                    thumbnail
                }
            ]);

    if (error) 
    {
        alert("An error occurred while adding course.");
        return;
    }
    
    alert("Course Added Successfully");

    /* CLEAR FIELDS */

    document.getElementById("courseTitle").value = "";
    document.getElementById("courseDescription").value = "";
    document.getElementById("courseThumbnail").value = "";
    loadCoursesTable();
    loadCoursesDropdown();
};

/* LOAD COURSES */

async function loadCoursesTable()
{
    const { data, error } = await client.from("courses").select("*");
    if (error)
    {
        console.log(error);
        return;
    }
    const body =document.getElementById("coursesBody");
    body.innerHTML = "";
    data.forEach(course =>
    {
        body.innerHTML += `
            <tr>
                <td data-label="Course">
                    ${course.title}
                </td>
                <td data-label="Description">
                    ${course.description}
                </td>
                <td data-label="Thumbnail">
                    <img
                        src="${course.thumbnail}"
                        width="80"
                        style="
                            border-radius:10px;
                            object-fit:cover;
                        ">
                </td>
                <td data-label="Action">
                    <button
                        class="action-btn edit-btn"
                        onclick="openEditCourseModal('${course.id}')">
                        Edit
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteCourse('${course.id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

/* OPEN EDIT COURSE MODAL */

window.openEditCourseModal =async function (id)
{
    const { data, error } = await client.from("courses").select("*").eq("id", id).single();

    if (error)
    {
        alert(error.message);
        return;
    }

    document.getElementById("editCourseId").value = data.id;
    document.getElementById("editCourseName").value = data.title;
    document.getElementById("editCourseDescription").value = data.description;
    document.getElementById("previewThumbnail").src = data.thumbnail;
    document.getElementById("editCourseModal").style.display = "flex";
};

/* UPDATE COURSE */

window.updateCourse = async function ()
{
    const id = document.getElementById("editCourseId").value;
    const title = document.getElementById("editCourseName").value.trim();
    const description = document.getElementById("editCourseDescription").value.trim();
    const file = document.getElementById("editCourseThumbnail").files[0];
    let thumbnail = document.getElementById("previewThumbnail").src;

    if (!title || !description) {
        alert("Please fill all required fields");
        return;
    }

    /* UPLOAD NEW IMAGE */

    if (file)
    {
        const fileName = Date.now() + "_" + file.name;
        const { error: uploadError } = await client.storage.from("thumbnails").upload(fileName, file);

        if (uploadError)
        {
            alert("An error occurred while uploading thumbnail.");
            return;
        }
        const { data } = client.storage.from("thumbnails").getPublicUrl(fileName);
        thumbnail = data.publicUrl;
    }

    /* UPDATE DATABASE */
    const { error } = await client.from("courses").update({title, description, thumbnail}).eq("id", id);
    if (error)
    {
        alert("An error occurred while updating course.");
        return;
    }
    alert("Course Updated Successfully");
    closeCourseModal();
    loadCoursesTable();
};

/* DELETE COURSE */

window.deleteCourse =async function (id) 
{
    const ok = await showConfirm("This course and its associated content will be permanently removed.");
    if (!ok) 
    {
        return;
    }
    const { error } =await client.from("courses").delete().eq("id", id);
    if (error) 
    {
        alert(error.message);
        return;
    }
    loadCoursesTable();
    alert("Course Deleted");
};

/* CLOSE MODAL */

window.closeCourseModal =function ()
{
    document.getElementById("editCourseModal").style.display = "none";
};

/* ADD VIDEO */

window.addVideo = async function () {
    const course_id = document.getElementById("videoCourse").value;
    const module_name = document.getElementById("moduleName").value.trim();
    const video_title = document.getElementById("videoTitle").value.trim();
    const quiz_id = document.getElementById("quizId").value.trim();
    const file = document.getElementById("videoFile").files[0];

    if (!course_id || !module_name || !video_title || !quiz_id || !file) 
    {
        alert("Please fill all required fields and select a file");
        return;
    }

    const fileName =`${Date.now()}_${file.name}`;
    // Upload to Supabase Storage
    const { error: uploadError } = await client.storage.from("videos").upload(fileName, file);

    if (uploadError) 
    {
        alert("An error occurred while uploading video.");
        return;
    }

    // Get Public URL
    const { data } = client.storage.from("videos").getPublicUrl(fileName);
    const video_url = data.publicUrl;

    // Save in Database
    const { error } =
        await client
            .from("videos")
            .insert([
                {
                    course_id,
                    module_name,
                    video_title,
                    video_url,
                    quiz_id
                }
            ]);

    if (error) 
    {
        if (error.code === "23505")
        {
            alert("Module already exists");
        } else {
            alert("An error occurred while adding video.");
        }
        return;
    }
    
    alert("Video Added Successfully");
    
    /* CLEAR FIELDS */
    document.getElementById("videoCourse").selectedIndex = 0;
    document.getElementById("moduleName").value = "";
    document.getElementById("videoTitle").value = "";
    document.getElementById("videoFile").value = "";
    document.getElementById("quizId").value = "";
};

async function loadVideosTable()
{
    // Get videos

    const { data: videos } =
        await client
            .from("videos")
            .select("*");

    // Get courses
    const { data: courses } =
        await client
            .from("courses")
            .select("*");

    const body =document.getElementById("videosBody");
    body.innerHTML = "";
    videos.forEach(video => {
        // Find course name using course_id
        const course =courses.find(c => c.id == video.course_id);
        const courseName =course? course.title: "";
        body.innerHTML += `
            <tr>
                <td data-label="Course">
                    ${courseName}
                </td>
                <td data-label="Module">
                    ${video.module_name}
                </td>
                <td data-label="Title">
                    ${video.video_title}
                </td>
                <td data-label="Action">
                    <button
                        class="action-btn edit-btn"
                        onclick="openEditVideoModal('${video.id}')">
                        Edit
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteVideo('${video.id}')">
                        Delete
                    </button>
                </td>
           </tr>
        `;
    });
}

window.openEditVideoModal = async function (id)
{
    // Get selected video

    const { data, error } = await client.from("videos").select("*").eq("id", id).single();

    if (error)
    {
        alert(error.message);
        return;
    }

    // Load all courses

    const { data: courses } = await client.from("courses").select("*");
    const courseDropdown =document.getElementById("editVideoCourse");
    courseDropdown.innerHTML = "";

    // Fill dropdown

    courses.forEach(course =>
    {
        courseDropdown.innerHTML += `
            <option value="${course.id}">
                ${course.title}
            </option>
        `;
    });

    // Set selected course
    courseDropdown.value=data.course_id;
    // Set other fields
    document.getElementById("editVideoId").value = data.id;
    document.getElementById("editModuleName").value = data.module_name;
    document.getElementById("editVideoTitle").value = data.video_title;
    document.getElementById("editvideoURL").value = data.video_url;
    // Open modal
    document.getElementById("editVideoModal").style.display = "flex";
};

async function updateVideo()
{
    const id = document.getElementById("editVideoId").value;
    const course_id = document.getElementById("editVideoCourse").value;
    const module_name = document.getElementById("editModuleName").value.trim();
    const video_title = document.getElementById("editVideoTitle").value.trim();
    
    if (!course_id || !module_name || !video_title) {
        alert("Please fill all required fields");
        return;
    }

    // Generate Quiz ID
    const courseDropdown = document.getElementById("editVideoCourse");
    const course = courseDropdown.options[courseDropdown.selectedIndex].text.trim().replace(/\s+/g, "_");
    const module = module_name.trim().replace(/\s+/g, "_");
    let quiz_id = "";
    if (course && module)
    {
        quiz_id = `${course}_${module}`;
    }
    let updateData = {course_id, module_name, video_title, quiz_id};

    const file = document.getElementById("editVideoFile").files[0];
    // Upload new file if selected
    if (file)
    {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await client.storage.from("videos").upload(fileName, file);
        if (uploadError) {
            alert("An error occurred while uploading video.");
            return;
        }
        const { data } = client.storage.from("videos").getPublicUrl(fileName);
        updateData.video_url = data.publicUrl;
    }
    const { error } = await client.from("videos").update(updateData).eq("id", id);
    if (error)
    {
        if (error.code === '23505') {
            alert("Module already exists");
        } else {
            alert("An error occurred while updating video.");
        }
        return;
    }
    alert("Video Updated Successfully");
    closeVideoModal();
    loadVideosTable();
}

async function deleteVideo(id)
{
    const confirmDelete = await showConfirm("This video will be permanently deleted from storage. This action cannot be undone.");
    if (!confirmDelete)
    {
        return;
    }
    // Get video details
    const { data } =
        await client
            .from("videos")
            .select("*")
            .eq("id", id)
            .single();

    // Delete file from storage
    if (data?.video_url)
    {
        const fileName = data.video_url.split("/").pop();
        await client.storage.from("videos").remove([fileName]);
    }

    // Delete DB record
    const { error } =await client.from("videos").delete().eq("id", id);
    if (error)
    {
       alert(error.message);
       return;
    }
    alert("Video Deleted Successfully");
    loadVideosTable();
}

function closeVideoModal()
{
    document.getElementById("editVideoModal").style.display = "none";
}

/* ADD QUIZ QUESTION */

window.addQuizQuestion = async function ()
 {
    const quiz_id = document.getElementById("quizIdDropDown").value;
    const question = document.getElementById("question").value.trim();
    const option1 = document.getElementById("option1").value.trim();
    const option2 = document.getElementById("option2").value.trim();
    const option3 = document.getElementById("option3").value.trim();
    const option4 = document.getElementById("option4").value.trim();
    const correct_answer = document.getElementById("correctAnswer").value.trim();

    if (!quiz_id || !question || !option1 || !option2 || !option3 || !option4 || !correct_answer) {
        alert("Please fill all required fields");
        return;
    }

    const { error } =
        await client
            .from("quizzes")
            .insert([
                {
                    quiz_id,
                    question,
                    option1,
                    option2,
                    option3,
                    option4,
                    correct_answer
                }
            ]);

    if (error) 
    {
        alert("An error occurred while adding quiz question.");            
        return;
    }

    alert("Quiz Question Added Successfully");

    /* CLEAR FIELDS */

    document.getElementById("quizIdDropDown").selectedIndex=0;
    document.getElementById("question").value="";
    document.getElementById("option1").value="";
    document.getElementById("option2").value="";
    document.getElementById("option3").value="";
    document.getElementById("option4").value="";
    document.getElementById("correctAnswer").value="";
};

async function loadQuizDropdown()
{
    const dropdown =document.getElementById("quizIdDropDown");
    dropdown.innerHTML = "";
    const { data, error } = await client.from("videos").select("quiz_id");
    if (error)
    {
        alert(error.message);
        return;
    }

    dropdown.innerHTML =`<option value="">Select Quiz Id</option>`;
    data.forEach(video =>
    {
        if (video.quiz_id)
        {
            dropdown.innerHTML += `
                <option
                    value="${video.quiz_id}">
                    ${video.quiz_id}
                </option>
            `;
        }
    });
}

/* LOAD QUIZ */

async function loadQuizTable() 
{
    const { data } =await client.from("quizzes").select("*");
    const body = document.getElementById("quizBody");
    body.innerHTML = "";
    data.forEach(q => {
        body.innerHTML += `
            <tr>
                <td data-label="Quiz ID">
                    ${q.quiz_id}
                </td>
                <td data-label="Question">
                    ${q.question}
                </td>
                <td data-label="Action">
                    <button
                        class="action-btn edit-btn"
                        onclick="openEditQuizModal('${q.id}')">
                        Edit
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteQuiz('${q.id}')">
                        Delete
                    </button>
                </td>

            </tr>
        `;
    });
}

window.openEditQuizModal = async function (id)
{
    const { data, error } = await client.from("quizzes").select("*").eq("id", id).single();
    if (error)
    {
        alert(error.message);
        return;
    }

    const { data: videos } = await client.from("videos").select("*");
    const dropdown =document.getElementById("editQuizId");
    dropdown.innerHTML = "";

    videos.forEach(video =>
    {
        if (video.quiz_id)
        {
            dropdown.innerHTML += `
                <option
                    value="${video.quiz_id}">
                    ${video.quiz_id}
                </option>
            `;
        }
    });


    // Set selected item
    dropdown.value=data.quiz_id;
    // Set other fields
    document.getElementById("editId").value = data.id;
    document.getElementById("editQuizId").value = data.quiz_id;
    document.getElementById("editQuestion").value = data.question;
    document.getElementById("editOption1").value = data.option1;
    document.getElementById("editOption2").value = data.option2;
    document.getElementById("editOption3").value = data.option3;
    document.getElementById("editOption4").value = data.option4;
    document.getElementById("editAnswer").value = data.correct_answer;
    
    // Open modal
    document.getElementById("editQuizModal").classList.add("show");
    //document.getElementById("editQuizModal").style.display = "flex";
};


/* EDIT QUIZ */

window.updateQuiz = async function (id) 
{
    const quiz_id = document.getElementById("editQuizId").value;
    const question = document.getElementById("editQuestion").value.trim();
    const option1 = document.getElementById("editOption1").value.trim();
    const option2 = document.getElementById("editOption2").value.trim();
    const option3 = document.getElementById("editOption3").value.trim();
    const option4 = document.getElementById("editOption4").value.trim();
    const correct_answer = document.getElementById("editAnswer").value.trim();
    
    if (!quiz_id || !question || !option1 || !option2 || !option3 || !option4 || !correct_answer) {
        alert("Please fill all required fields");
        return;
    }
    
    let updateData = {quiz_id, question, option1, option2, option3, option4, correct_answer};
    const { error } = await client.from("quizzes").update(updateData).eq("id", id);
    if (error)
    {
        alert("An error occurred while updating quiz question.");
        return;
    }
    alert("Quiz Updated Successfully");
    closeQuizModal();
    loadQuizTable();
};

function closeQuizModal()
{
    //document.getElementById("editQuizModal").style.display = "none";
    document
        .getElementById("editQuizModal")
        .classList.remove("show");
}


async function deleteQuiz(id)
{
    const confirmDelete = await showConfirm("This quiz question will be permanently deleted.");
    if (!confirmDelete)
    {
        return;
    }
    
    // Delete DB record
    const { error } =await client.from("quizzes").delete().eq("id", id);
    if (error)
    {
       alert(error.message);
       return;
    }
    alert("Quiz Questions Deleted Successfully");
    loadQuizTable();
}

/* ADD COLLEGE */

window.addCollege = async function ()
{
    const college_name = document.getElementById("college_name").value.trim();
    const place = document.getElementById("place").value.trim();

    if (!college_name || !place) {
        alert("Please fill all required fields");
        return;
    }
    
    // Check if college already exists
    const { data: existingCollege, error: checkError } = await client
        .from("colleges")
        .select("id")
        .eq("college_name", college_name)
        .eq("place", place);
        
    if (checkError) {
        alert("An error occurred while checking college.");
        return;
    }
    
    if (existingCollege && existingCollege.length > 0) {
        alert("This college already exists.");
        return;
    }

    const { error } =
        await client
            .from("colleges")
            .insert([
                {
                    college_name,
                    place
                }
            ]);

    if (error) 
    {
        if (error.code === '23505') {
            alert("This college already exists.");
        } else {
            alert("An error occurred while adding college.");            
        }
        return;
    }

    alert("College has been Added Successfully");

    /* CLEAR FIELDS */
    document.getElementById("college_name").value = "";
    document.getElementById("place").value = "";
    loadCollegeTable();
};

async function loadCollegeDropdown()
{
    const dropdown =document.getElementById("collegeDropDown");
    dropdown.innerHTML = "";
    const { data, error } = await client.from("colleges").select("college_name");
    if (error)
    {
        alert(error.message);
        return;
    }

    dropdown.innerHTML =`<option value="">Select College</option>`;
    data.forEach(colleges =>
    {
        if (colleges.college_name)
        {
            dropdown.innerHTML += `
                <option
                    value="${colleges.college_name}">
                    ${colleges.college_name}
                </option>
            `;
        }
    });
}

/* LOAD QUIZ */

async function loadCollegeTable() 
{
    const { data } =await client.from("colleges").select("*");
    const body = document.getElementById("collegeBody");
    body.innerHTML = "";
    data.forEach(q => {
        body.innerHTML += `
            <tr>
                <td data-label="College">
                    ${q.college_name}
                </td>
                <td data-label="Place">
                    ${q.place}
                </td>
                <td data-label="Action">
                    <button
                        class="action-btn edit-btn"
                        onclick="openEditCollegeModal('${q.id}')">
                        Edit
                    </button>
                    <button
                        class="action-btn delete-btn"
                        onclick="deleteCollege('${q.id}')">
                        Delete
                    </button>
                </td>

            </tr>
        `;
    });
}

window.openEditCollegeModal = async function (id)
{
    const { data, error } = await client.from("colleges").select("*").eq("id", id).single();
    if (error)
    {
        alert(error.message);
        return;
    }

    const { data: colleges } = await client.from("colleges").select("*");
    
    document.getElementById("editCollegeId").value = data.id;
    document.getElementById("editCollegeName").value = data.college_name;
    document.getElementById("editPlace").value = data.place;
    
    // Open modal
    document.getElementById("editCollegeModal").classList.add("show");
    //document.getElementById("editQuizModal").style.display = "flex";
};


/* EDIT QUIZ */

window.updateCollege = async function (id) 
{
    const collegeid = document.getElementById("editCollegeId").value;
    const college_name = document.getElementById("editCollegeName").value.trim();
    const place = document.getElementById("editPlace").value.trim();
    
    if (!college_name || !place) {
        alert("Please fill all required fields");
        return;
    }
    
    // Check if college already exists
    const { data: existingCollege, error: checkError } = await client
        .from("colleges")
        .select("id")
        .eq("college_name", college_name)
        .eq("place", place)
        .neq("id", collegeid);
        
    if (checkError) {
        alert("An error occurred while checking college.");
        return;
    }
    
    if (existingCollege && existingCollege.length > 0) {
        alert("This college already exists.");
        return;
    }
    
    let updateData = {college_name, place};
    const { error } = await client.from("colleges").update(updateData).eq("id", collegeid);
    if (error)
    {
        if (error.code === '23505') {
            alert("This college already exists.");
        } else {
            alert("An error occurred while updating college.");
        }
        return;
    }
    alert("College Updated Successfully");
    closeCollegeModal();
    loadCollegeTable();
};

function closeCollegeModal()
{
    //document.getElementById("editQuizModal").style.display = "none";
    document
        .getElementById("editCollegeModal")
        .classList.remove("show");
}


async function deleteCollege(id)
{
    const confirmDelete = await showConfirm("This college will be permanently removed from the system.");
    if (!confirmDelete)
    {
        return;
    }
    
    // Delete DB record
    const { error } =await client.from("colleges").delete().eq("id", id);
    if (error)
    {
       alert(error.message);
       return;
    }
    alert("College Deleted Successfully");
    loadCollegeTable();
}


















//no need

async function loadCourses() 
{

    const { data, error } = await client.from("courses").select("*");

    if (error) 
    {
        console.log(error);
        return;
    }

    const list = document.getElementById("courseList");

    list.innerHTML = "";

    data.forEach(course => {

        list.innerHTML += `
            <div class="course-card"
                 onclick="openCourse('${course.id}')">

                <img src="${course.thumbnail}">

                <div class="course-content">

                    <h2>${course.title}</h2>

                    <p>${course.description}</p>

                </div>

            </div>
        `;
    });
}

function openCourse(courseId) 
{
    localStorage.setItem("courseId",courseId);
    window.location ="course-details.html";
}

function enableQuiz()
{
    document.getElementById("quizBtn").disabled = false;
}

async function openQuiz() 
{
    const courseId =localStorage.getItem("courseId");
    const { data, error } = await client.from("quizzes").select("*").eq("course_id", courseId).single();
    if (error || !data) 
    {
        alert("Quiz not found");
        return;
    }
    localStorage.setItem("quizId",data.id);
    window.location ="quiz.html";
}

let questions = [];

window.loadQuiz = async function()
{
    const quizId = localStorage.getItem("quizId");
    const { data, error } = await client.from("quizzes").select("*").eq("quiz_id", quizId);
    questions = data || [];
    const form = document.getElementById("quizForm");
    form.innerHTML = "";
    
    if (questions.length === 0) {
        form.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px 0;">No questions found for this quiz.</p>`;
        return;
    }

    questions.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "quiz-question-card";
        questionDiv.style = "border-bottom: 2px solid var(--border-color); padding-bottom: 28px; margin-bottom: 28px;";
        
        questionDiv.innerHTML = `
            <h3 style="font-size: 1.25rem; color: var(--secondary); margin-bottom: 18px; font-family: 'Plus Jakarta Sans', sans-serif; text-transform: none; font-weight: 700; display: flex; align-items: flex-start; gap: 8px;">
                <span style="background: var(--primary); color: white; padding: 2px 10px; font-family: 'Barlow Condensed'; font-size: 14px; flex-shrink: 0;">Q${index + 1}</span> 
                <span>${q.question}</span>
            </h3>
            <div class="quiz-options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
                <label class="quiz-option-label" style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; border: 2px solid var(--border-color); background: var(--bg-light); cursor: pointer; transition: var(--transition); border-radius: 2px;">
                    <input type="radio" name="q${index}" value="${q.option1}" style="accent-color: var(--primary); width: 18px; height: 18px; cursor: pointer;">
                    <span style="font-size: 14px; font-weight: 600; color: var(--secondary);">${q.option1}</span>
                </label>
                <label class="quiz-option-label" style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; border: 2px solid var(--border-color); background: var(--bg-light); cursor: pointer; transition: var(--transition); border-radius: 2px;">
                    <input type="radio" name="q${index}" value="${q.option2}" style="accent-color: var(--primary); width: 18px; height: 18px; cursor: pointer;">
                    <span style="font-size: 14px; font-weight: 600; color: var(--secondary);">${q.option2}</span>
                </label>
                <label class="quiz-option-label" style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; border: 2px solid var(--border-color); background: var(--bg-light); cursor: pointer; transition: var(--transition); border-radius: 2px;">
                    <input type="radio" name="q${index}" value="${q.option3}" style="accent-color: var(--primary); width: 18px; height: 18px; cursor: pointer;">
                    <span style="font-size: 14px; font-weight: 600; color: var(--secondary);">${q.option3}</span>
                </label>
                <label class="quiz-option-label" style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; border: 2px solid var(--border-color); background: var(--bg-light); cursor: pointer; transition: var(--transition); border-radius: 2px;">
                    <input type="radio" name="q${index}" value="${q.option4}" style="accent-color: var(--primary); width: 18px; height: 18px; cursor: pointer;">
                    <span style="font-size: 14px; font-weight: 600; color: var(--secondary);">${q.option4}</span>
                </label>
            </div>
        `;
        form.appendChild(questionDiv);
    });

    // Add interactivity to label elements
    document.querySelectorAll('.quiz-option-label input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const name = this.getAttribute('name');
            document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                r.parentElement.style.borderColor = 'var(--border-color)';
                r.parentElement.style.background = 'var(--bg-light)';
            });
            if (this.checked) {
                this.parentElement.style.borderColor = 'var(--primary)';
                this.parentElement.style.background = '#FFF3EB';
            }
        });
    });
}

async function submitQuiz()
{
    if (questions.length === 0) 
    {
        alert("No Questions Found");
        return;
    }

    let score = 0;
    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && selected.value === q.correct_answer) 
        {

            score++;
        }
    });

    alert("Your Score: " + score);

    await client.from("results").insert([
            {
                user_email:localStorage.getItem("user"),
                quiz_id:questions[0].quiz_id,
                score: score
            }
        ]);

    if (score >= 2)
     {
        window.location ="certificate.html";
    }
    else
   {

        alert("Quiz Failed");
    }
}

function logout() {

    localStorage.removeItem("user");

    window.location =
        "login.html";
}









function showMessage(msg) {

    document.getElementById(
        "adminMsg"
    ).innerHTML = msg;
}

/* LOAD COURSE DROPDOWN FOR QUIZ */

async function loadQuizCourses() {

    const { data, error } =

        await client
            .from("courses")
            .select("*");

    if (error) {

        return;
    }

    const dropdown =

        document.getElementById(
            "quizCourse"
        );

    dropdown.innerHTML = `

        <option>

            Select Course

        </option>
    `;

    data.forEach(course => {

        dropdown.innerHTML += `

            <option value="${course.id}">

                ${course.title}

            </option>
        `;
    });
}

// Student Course Details & Progress Tracker Implementation
let courseVideos = [];
let activeVideo = null;

window.initCourseDetails = async function() {
    const courseId = localStorage.getItem("courseId");
    if (!courseId) {
        window.location = "dashboard.html";
        return;
    }

    try {
        // Load course details
        const { data: course, error } = await client.from("courses").select("*").eq("id", courseId).single();
        if (error || !course) {
            alert("Course details could not be loaded.");
            return;
        }

        document.getElementById("courseTitle").innerText = course.title;
        document.getElementById("courseDesc").innerText = course.description;

        await window.loadCourseVideos(courseId);
    } catch (e) {
        console.error("Error in initCourseDetails:", e);
    }
};

window.loadCourseVideos = async function(courseId) {
    try {
        const { data: videos, error } = await client.from("videos").select("*").eq("course_id", courseId);
        if (error) {
            alert("Videos could not be loaded.");
            return;
        }

        courseVideos = videos || [];
        const container = document.getElementById("modulesContainer");
        container.innerHTML = "";

        if (courseVideos.length === 0) {
            container.innerHTML = `<p style="color: var(--text-muted); font-size: 14px;">No videos uploaded for this course yet.</p>`;
            updateProgress();
            return;
        }

        // Group videos by module_name
        const modules = {};
        courseVideos.forEach(video => {
            const modName = video.module_name || "Introductory Material";
            if (!modules[modName]) {
                modules[modName] = [];
            }
            modules[modName].push(video);
        });

        // Get watched list
        const user = localStorage.getItem("user") || "anonymous";
        const watchedKey = `watched_videos_${user}_${courseId}`;
        let watchedList = [];
        try {
            watchedList = JSON.parse(localStorage.getItem(watchedKey)) || [];
        } catch (e) {
            watchedList = [];
        }

        // Render modules
        for (const [moduleName, vList] of Object.entries(modules)) {
            const modDiv = document.createElement("div");
            modDiv.className = "module-group";
            
            const titleH = document.createElement("h4");
            titleH.className = "module-group-title";
            titleH.innerText = moduleName;
            modDiv.appendChild(titleH);

            vList.forEach(video => {
                const isWatched = watchedList.includes(video.id);
                const itemDiv = document.createElement("div");
                itemDiv.className = `video-item ${isWatched ? 'watched' : ''}`;
                itemDiv.id = `video-item-${video.id}`;
                itemDiv.onclick = () => window.playVideo(video.id);

                itemDiv.innerHTML = `
                    <div class="video-item-left">
                        <span class="video-item-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-circle"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                        </span>
                        <span class="video-item-title">${video.video_title}</span>
                    </div>
                    <div class="video-item-check">✓</div>
                `;
                modDiv.appendChild(itemDiv);
            });

            container.appendChild(modDiv);
        }

        // Play the first video initially
        window.playVideo(courseVideos[0].id);
        updateProgress();
    } catch (e) {
        console.error("Error loading course videos:", e);
    }
};

window.playVideo = function(videoId) {
    const video = courseVideos.find(v => v.id === videoId);
    if (!video) return;

    activeVideo = video;

    // Highlight active in UI
    document.querySelectorAll(".video-item").forEach(item => {
        item.classList.remove("active");
    });
    const el = document.getElementById(`video-item-${videoId}`);
    if (el) {
        el.classList.add("active");
    }

    // Set video player src and play
    const player = document.getElementById("mainVideoPlayer");
    player.src = video.video_url;
    player.load();
    player.play().catch(err => console.log("Auto-play prevented: ", err));

    document.getElementById("activeVideoTitle").innerText = video.video_title;
    document.getElementById("activeVideoModule").innerText = video.module_name || "";

    // Enable mark completed button if not already completed
    const user = localStorage.getItem("user") || "anonymous";
    const courseId = localStorage.getItem("courseId");
    const watchedKey = `watched_videos_${user}_${courseId}`;
    let watchedList = [];
    try {
        watchedList = JSON.parse(localStorage.getItem(watchedKey)) || [];
    } catch (e) {}

    const markBtn = document.getElementById("markCompletedBtn");
    if (watchedList.includes(videoId)) {
        markBtn.disabled = true;
        markBtn.innerText = "Completed";
    } else {
        markBtn.disabled = false;
        markBtn.innerText = "Mark as Completed";
    }
};

window.markActiveVideoCompleted = function() {
    if (!activeVideo) return;
    
    const user = localStorage.getItem("user") || "anonymous";
    const courseId = localStorage.getItem("courseId");
    const watchedKey = `watched_videos_${user}_${courseId}`;
    
    let watchedList = [];
    try {
        watchedList = JSON.parse(localStorage.getItem(watchedKey)) || [];
    } catch (e) {}

    if (!watchedList.includes(activeVideo.id)) {
        watchedList.push(activeVideo.id);
        localStorage.setItem(watchedKey, JSON.stringify(watchedList));
    }

    // Update UI
    const el = document.getElementById(`video-item-${activeVideo.id}`);
    if (el) {
        el.classList.add("watched");
    }

    const markBtn = document.getElementById("markCompletedBtn");
    markBtn.disabled = true;
    markBtn.innerText = "Completed";

    alert(`'${activeVideo.video_title}' completed!`);
    updateProgress();
};

window.onVideoEnded = function() {
    if (activeVideo) {
        window.markActiveVideoCompleted();
    }
};

function updateProgress() {
    const courseId = localStorage.getItem("courseId");
    const user = localStorage.getItem("user") || "anonymous";
    const watchedKey = `watched_videos_${user}_${courseId}`;
    
    let watchedList = [];
    try {
        watchedList = JSON.parse(localStorage.getItem(watchedKey)) || [];
    } catch (e) {}

    const total = courseVideos.length;
    const completed = courseVideos.filter(v => watchedList.includes(v.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById("progressPercentage").innerText = `${percentage}%`;
    document.getElementById("progressBarFill").style.width = `${percentage}%`;
    document.getElementById("progressText").innerText = `${completed} of ${total} videos completed`;

    const quizBtn = document.getElementById("quizBtn");
    if (total > 0 && completed === total) {
        quizBtn.disabled = false;
    } else {
        quizBtn.disabled = true;
    }
}

window.goQuiz = function() {
    // Find quiz ID from course videos
    let quizId = null;
    for (let v of courseVideos) {
        if (v.quiz_id) {
            quizId = v.quiz_id;
            break;
        }
    }

    if (!quizId) {
        alert("No quiz is currently configured for this course. Please contact the administrator.");
        return;
    }

    localStorage.setItem("quizId", quizId);
    window.location = "quiz.html";
};



















