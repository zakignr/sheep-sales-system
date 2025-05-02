document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // بيانات مؤقتة للتجربة
    const tempUsers = {
        'admin': {
            password: 'admin123',
            role: 'admin',
            name: 'المدير'
        },
        'supervisor': {
            password: 'super123',
            role: 'supervisor',
            name: 'المراقب'
        },
        'salespoint': {
            password: 'sales123',
            role: 'salespoint',
            name: 'نقطة البيع'
        }
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // التحقق من المستخدم (مؤقتاً)
        const user = tempUsers[username];
        if (user && user.password === password) {
            // تخزين بيانات المستخدم
            localStorage.setItem('currentUser', JSON.stringify({
                username,
                role: user.role,
                name: user.name
            }));
            
            // توجيه المستخدم إلى لوحة التحكم
            window.location.href = 'dashboard.html';
        } else {
            errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        }
    });
});
