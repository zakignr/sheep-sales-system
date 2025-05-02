document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const userTypeGroup = document.getElementById('userTypeGroup');
    const userNumber = document.getElementById('userNumber');
    const numberLabel = document.getElementById('numberLabel');
    const tabButtons = document.querySelectorAll('.tab-btn');
    let currentRole = 'admin';

    // تكوين قائمة المستخدمين
    const users = {
        admin: {
            password: 'admin123',
            role: 'admin',
            name: 'المدير الرئيسي'
        },
        supervisors: {
            1: { password: 'super123', name: 'المراقب الأول' },
            2: { password: 'super123', name: 'المراقب الثاني' },
            3: { password: 'super123', name: 'المراقب الثالث' },
            4: { password: 'super123', name: 'المراقب الرابع' }
        },
        salespoints: {
            1: { password: 'sale123', name: 'نقطة البيع 1' },
            2: { password: 'sale123', name: 'نقطة البيع 2' },
            3: { password: 'sale123', name: 'نقطة البيع 3' },
            4: { password: 'sale123', name: 'نقطة البيع 4' },
            5: { password: 'sale123', name: 'نقطة البيع 5' },
            6: { password: 'sale123', name: 'نقطة البيع 6' },
            7: { password: 'sale123', name: 'نقطة البيع 7' },
            8: { password: 'sale123', name: 'نقطة البيع 8' }
        }
    };

    // إدارة النقر على التبويبات
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRole = btn.dataset.role;
            updateUserNumberSelect(currentRole);
        });
    });

    function updateUserNumberSelect(role) {
        userTypeGroup.style.display = role === 'admin' ? 'none' : 'block';
        userNumber.innerHTML = '';

        if (role === 'supervisor') {
            numberLabel.textContent = 'رقم المراقب';
            for (let i = 1; i <= 4; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `المراقب ${i}`;
                userNumber.appendChild(option);
            }
        } else if (role === 'salespoint') {
            numberLabel.textContent = 'رقم نقطة البيع';
            for (let i = 1; i <= 8; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `نقطة البيع ${i}`;
                userNumber.appendChild(option);
            }
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        let user;
        let redirectPage;

        if (currentRole === 'admin') {
            user = users.admin;
            if (user.password === password) {
                redirectPage = 'admin-dashboard.html';
            }
        } else if (currentRole === 'supervisor') {
            const supervisorNumber = userNumber.value;
            user = users.supervisors[supervisorNumber];
            if (user && user.password === password) {
                redirectPage = 'supervisor-dashboard.html';
            }
        } else if (currentRole === 'salespoint') {
            const pointNumber = userNumber.value;
            user = users.salespoints[pointNumber];
            if (user && user.password === password) {
                redirectPage = 'salespoint-dashboard.html';
            }
        }

        if (redirectPage) {
            localStorage.setItem('currentUser', JSON.stringify({
                role: currentRole,
                number: currentRole === 'admin' ? null : userNumber.value,
                name: user.name,
                loginTime: new Date().toISOString()
            }));
            window.location.href = redirectPage;
        } else {
            errorMessage.textContent = 'كلمة المرور غير صحيحة';
        }
    });

    // تحديد التبويب الافتراضي
    updateUserNumberSelect('admin');
});
