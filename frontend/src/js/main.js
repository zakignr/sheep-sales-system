document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // هنا سنضيف لاحقاً التحقق من المستخدم مع الخادم
        console.log('محاولة تسجيل الدخول:', { username, password });
        
        // مثال مؤقت للتحقق
        if (username === 'admin' && password === 'admin123') {
            errorMessage.textContent = '';
            window.location.href = '/dashboard.html';
        } else {
            errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        }
    });
});
