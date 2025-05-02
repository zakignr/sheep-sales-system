document.addEventListener('DOMContentLoaded', () => {
    // التحقق من تسجيل الدخول
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // تحديث اسم المستخدم
    document.getElementById('userName').textContent = currentUser.name;

    // تهيئة الأحداث
    initializeEvents();
    
    // تحديث الوقت
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    // تحميل البيانات الأولية
    loadDashboardData();

    // عرض/إخفاء عناصر القائمة حسب نوع المستخدم
    updateMenuVisibility(currentUser.role);
});

function initializeEvents() {
    // زر تسجيل الخروج
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // زر تحديث البيانات
    document.querySelector('.refresh-btn').addEventListener('click', () => {
        loadDashboardData();
    });
}

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-DZ');
    const dateString = now.toLocaleDateString('ar-DZ');
    document.getElementById('currentTime').textContent = `${dateString} ${timeString}`;
}

function updateMenuVisibility(role) {
    const adminElements = document.querySelectorAll('#adminMenu, #adminStockMenu');
    adminElements.forEach(el => {
        el.style.display = role === 'admin' ? 'block' : 'none';
    });
}

function loadDashboardData() {
    // بيانات تجريبية
    const mockData = {
        totalSalesPoints: 5,
        totalStock: 150,
        pendingUpdates: 2,
        salesPoints: [
            {
                name: 'نقطة البيع 1',
                stock: 30,
                lastUpdate: '2025-05-02 05:30:00',
                status: 'active'
            },
            {
                name: 'نقطة البيع 2',
                stock: 25,
                lastUpdate: '2025-05-02 04:15:00',
                status: 'warning'
            }
        ]
    };

    // تحديث الإحصائيات
    document.getElementById('totalSalesPoints').textContent = mockData.totalSalesPoints;
    document.getElementById('totalStock').textContent = mockData.totalStock;
    document.getElementById('pendingUpdates').textContent = mockData.pendingUpdates;

    // تحديث جدول نقاط البيع
    const tableBody = document.getElementById('salesPointsTable');
    tableBody.innerHTML = mockData.salesPoints.map(point => `
        <tr>
            <td>${point.name}</td>
            <td>${point.stock}</td>
            <td>${point.lastUpdate}</td>
            <td><span class="status status-${point.status}">
                ${getStatusText(point.status)}
            </span></td>
            <td>
                <button class="btn-action">عرض التفاصيل</button>
            </td>
        </tr>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        active: 'نشط',
        warning: 'تحذير',
        critical: 'حرج'
    };
    return statusMap[status] || status;
}
