document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // بيانات المستخدمين
    const users = {
        // الأدمن الرئيسي
        'admin': {
            password: 'admin123',
            role: 'admin',
            name: 'المدير الرئيسي',
            id: 1
        },
        // المراقبين الأربعة
        'supervisor1': {
            password: 'super123',
            role: 'supervisor',
            name: 'المراقب الأول',
            id: 2
        },
        'supervisor2': {
            password: 'super123',
            role: 'supervisor',
            name: 'المراقب الثاني',
            id: 3
        },
        'supervisor3': {
            password: 'super123',
            role: 'supervisor',
            name: 'المراقب الثالث',
            id: 4
        },
        'supervisor4': {
            password: 'super123',
            role: 'supervisor',
            name: 'المراقب الرابع',
            id: 5
        },
        // نقاط البيع الثمانية
        'sale1': {
            password: 'sale123',
            role: 'salespoint',
            name: 'نقطة البيع 1',
            id: 6
        },
        'sale2': {
            password: 'sale123',
            role: 'salespoint',
            name: 'نقطة البيع 2',
            id: 7
        },
        'sale3': {
            password: 'sale123',
            role: 'salespoint',
            name: 'نقطة البيع 3',
            id: 8
        },
        'sale4': {
            password: 'sale123',
            role: 'salespoint',
            name: 'نقطة البيع 4',
            id: 9
        },
        'sale5': {
            password: 'sale123',
            role: 'salespoint',
            name: 'نقطة البيع 5',
            id: 10
        },
        'sale6': {
            password: 'sale123',
            role: 'salespoint',
            name: 'نقطة البيع 6',
            id: 11
        },
        'sale7': {
            password: 'sale123',
            role: 'salespoint',
            name: 'نقطة البيع 7',
            id: 12
        },
        'sale8': {
            password: 'sale123',
            role: 'salespoint',
            name: 'نقطة البيع 8',
            id: 13
        }
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = users[username];
        if (user && user.password === password) {
            // تخزين بيانات المستخدم
            localStorage.setItem('currentUser', JSON.stringify({
                username,
                role: user.role,
                name: user.name,
                id: user.id,
                loginTime: new Date().toISOString()
            }));
            
            // توجيه المستخدم إلى اللوحة المناسبة
            switch(user.role) {
                case 'admin':
                    window.location.href = 'admin-dashboard.html';
                    break;
                case 'supervisor':
                    window.location.href = 'supervisor-dashboard.html';
                    break;
                case 'salespoint':
                    window.location.href = 'salespoint-dashboard.html';
                    break;
            }
        } else {
            errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        }
    });
});
