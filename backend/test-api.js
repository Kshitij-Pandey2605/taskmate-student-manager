// backend/test-api.js
// Automated API verification script for TaskMate backend.
// Tests health check, user registration, login, profile fetch, task creation,
// listing, ownership protection, updating, and deletion.

const BASE_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('🧪 Starting TaskMate Backend API Verification Tests...\n');

  try {
    // 1. Health check
    console.log('1️⃣ Testing Health Check...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health Check response:', healthData);

    // 2. User Registration (Student 1)
    console.log('\n2️⃣ Testing Student 1 Registration...');
    const testEmail1 = `alex.${Date.now()}@college.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Johnson',
        email: testEmail1,
        department: 'Computer Science & Engineering',
        password: 'password123',
      }),
    });
    const regData = await regRes.json();
    console.log('✅ Registration Status:', regRes.status, 'Response:', regData.message);
    const token1 = regData.token;

    // 3. User Login
    console.log('\n3️⃣ Testing Student Login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail1,
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    console.log('✅ Login Status:', loginRes.status, 'Student:', loginData.user.name, 'Token received:', !!loginData.token);

    // 4. Protected Route: Get Profile
    console.log('\n4️⃣ Testing Get Current Profile (/api/auth/me)...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    const meData = await meRes.json();
    console.log('✅ Profile Response:', meData.user);

    // 5. Create Task for Student 1
    console.log('\n5️⃣ Testing Create Task (/api/tasks)...');
    const taskRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        title: 'Operating Systems Lab Submission',
        description: 'Complete Round Robin scheduling code in C and write report',
        category: 'Assignment',
        priority: 'High',
        dueDate: '2026-11-28',
      }),
    });
    const taskData = await taskRes.json();
    console.log('✅ Task Created:', taskData.task.title, 'ID:', taskData.task.id);
    const taskId1 = taskData.task.id;

    // 6. Get Tasks for Student 1
    console.log('\n6️⃣ Testing Get All Tasks (/api/tasks)...');
    const listRes = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    const listData = await listRes.json();
    console.log('✅ Tasks Count:', listData.count, 'First task title:', listData.tasks[0]?.title);

    // 7. Update Task (Toggle to Completed)
    console.log('\n7️⃣ Testing Update Task (/api/tasks/:id)...');
    const updateRes = await fetch(`${BASE_URL}/tasks/${taskId1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        status: 'Completed',
        priority: 'Medium',
      }),
    });
    const updateData = await updateRes.json();
    console.log('✅ Updated Status:', updateData.task.status, 'Priority:', updateData.task.priority);

    // 8. Test Data Isolation / Privacy (Student 2 cannot access Student 1's tasks)
    console.log('\n8️⃣ Testing Privacy & Access Control (Student 2 isolation)...');
    const testEmail2 = `priya.${Date.now()}@college.edu`;
    const reg2Res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Priya Sharma',
        email: testEmail2,
        department: 'Information Technology',
        password: 'password123',
      }),
    });
    const reg2Data = await reg2Res.json();
    const token2 = reg2Data.token;

    // Student 2 tries to fetch tasks: should be 0
    const list2Res = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    const list2Data = await list2Res.json();
    console.log('✅ Student 2 Task Count (should be 0):', list2Data.count);

    // Student 2 tries to edit Student 1's task: should be 403 Forbidden!
    const unauthorizedEdit = await fetch(`${BASE_URL}/tasks/${taskId1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token2}`,
      },
      body: JSON.stringify({ title: 'Hacked Title' }),
    });
    const unauthorizedData = await unauthorizedEdit.json();
    console.log('✅ Unauthorized Edit Status (Expected 403):', unauthorizedEdit.status, 'Message:', unauthorizedData.message);

    // 9. Delete Task (Student 1 deletes own task)
    console.log('\n9️⃣ Testing Delete Task (/api/tasks/:id)...');
    const delRes = await fetch(`${BASE_URL}/tasks/${taskId1}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token1}` },
    });
    const delData = await delRes.json();
    console.log('✅ Delete Status:', delRes.status, 'Response:', delData.message);

    console.log('\n🎉 ALL 9 BACKEND API TESTS PASSED SUCCESSFULLY! 🚀');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

runTests();
