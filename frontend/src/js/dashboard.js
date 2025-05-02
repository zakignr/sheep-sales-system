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
    loadDashboardData(currentUser);

    // عرض/إخفاء عناصر القائمة حسب نوع المستخدم
    updateMenuVisibility(currentUser.role);
});

function loadDashboardData(currentUser) {
    // بيانات نقاط البيع
    const salesPointsData = {
        points: [
            {
                id: 1,
                name: 'نقطة البيع 1',
                stock: 45,
                lastUpdate: '2025-05-02 06:30:00',
                status: 'active'
            },
            {
                id: 2,
                name: 'نقطة البيع 2',
                stock: 32,
                lastUpdate: '2025-05-02 06:15:00',
                status: 'active'
            },
            {
                id: 3,
                name: 'نقطة البيع 3',
                stock: 28,
                lastUpdate: '2025-05-02 05:45:00',
                status: 'warning'
            },
            {
                id: 4,
                name: 'نقطة البيع 4',
                stock: 50,
                lastUpdate: '2025-05-02 06:20:00',
                status: 'active'
            },
            {
                id: 5,
                name: 'نقطة البيع 5',
                stock: 15,
                lastUpdate: '2025-05-02 03:30:00',
                status: 'critical'
            },
            {
                id: 6,
                name: 'نقطة البيع 6',
                stock: 40,
                lastUpdate: '2025-05-02 06:00:00',
                status: 'active'
            },
            {
                id: 7,
                name: 'نقطة البيع 7',
                stock: 25,
                lastUpdate: '2025-05-02 05:00:00',
                status: 'warning'
            },
            {
                id: 8,
                name: 'نقطة البيع 8',
                stock: 35,
                lastUpdate: '2025-05-02 06:25:00',
                status: 'active'
            }
        ]
    };

    // تحديث الإحصائيات
    const totalStock = salesPointsData.points.reduce((sum, point) => sum + point.stock, 0);
    const pendingUpdates = salesPointsData.points.filter(point => 
        isUpdateRequired(point.lastUpdate)
    ).length;

    document.getElementById('totalSalesPoints').textContent = '8'; // العدد الثابت
    document.getElementById('totalStock').textContent = totalStock;
    document.getElementById('pendingUpdates').textContent = pendingUpdates;

    // تحديث جدول نقاط البيع
    updateSalesPointsTable(salesPointsData.points, currentUser);
}

function isUpdateRequired(lastUpdate) {
    const lastUpdateTime = new Date(lastUpdate);
    const currentTime = new Date('2025-05-02 06:34:29'); // الوقت الحالي المحدد
    const hoursDiff = (currentTime - lastUpdateTime) / (1000 * 60 * 60);
    return hoursDiff >= 1;
}

function updateSalesPointsTable(points, currentUser) {
    const tableBody = document.getElementById('salesPointsTable');
    
    // تحديد نقاط البيع التي سيتم عرضها
    let displayPoints = points;
    if (currentUser.role === 'salespoint') {
        // إذا كان المستخدم نقطة بيع، اعرض فقط بياناته
        displayPoints = points.filter(point => 
            point.name === currentUser.name
        );
    }

    tableBody.innerHTML = displayPoints.map(point => `
        <tr>
            <td>${point.name}</td>
            <td>${point.stock}</td>
            <td>${formatDateTime(point.lastUpdate)}</td>
            <td><span class="status status-${point.status}">
                ${getStatusText(point.status)}
            </span></td>
            <td>
                ${getActionButtons(point, currentUser)}
            </td>
        </tr>
    `).join('');
}

function getActionButtons(point, currentUser) {
    if (currentUser.role === 'admin') {
        return `
            <button class="btn-action" onclick="editStock(${point.id})">تعديل المخزون</button>
            <button class="btn-action" onclick="viewHistory(${point.id})">سجل التحديثات</button>
        `;
    } else if (currentUser.role === 'supervisor') {
        return `
            <button class="btn-action" onclick="viewHistory(${point.id})">سجل التحديثات</button>
        `;
    } else {
        return `
            <button class="btn-action" onclick="updateStock(${point.id})">تحديث المخزون</button>
        `;
    }
}

function formatDateTime(dateTime) {
    return new Date(dateTime).toLocaleString('ar-DZ');
}

function getStatusText(status) {
    const statusMap = {
        active: 'نشط',
        warning: 'تحذير',
        critical: 'حرج'
    };
    return statusMap[status] || status;
}

function updateMenuVisibility(role) {
    // إظهار/إخفاء عناصر القائمة حسب الدور
    const adminOnly = document.querySelectorAll('.admin-only');
    const supervisorOnly = document.querySelectorAll('.supervisor-only');
    const salespointOnly = document.querySelectorAll('.salespoint-only');

    adminOnly.forEach(el => el.style.display = role === 'admin' ? 'block' : 'none');
    supervisorOnly.forEach(el => el.style.display = role === 'supervisor' ? 'block' : 'none');
    salespointOnly.forEach(el => el.style.display = role === 'salespoint' ? 'block' : 'none');
}

// وظائف الأحداث
function editStock(pointId) {
    console.log('تعديل المخزون لنقطة البيع:', pointId);
    // سيتم تنفيذها لاحقاً
}

function viewHistory(pointId) {
    console.log('عرض سجل التحديثات لنقطة البيع:', pointId);
    // سيتم تنفيذها لاحقاً
}

function updateStock(pointId) {
    console.log('تحديث المخزون لنقطة البيع:', pointId);
    // سيتم تنفيذها لاحقاً
}
