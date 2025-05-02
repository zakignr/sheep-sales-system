// المتغيرات العامة
let currentUser = {
    id: null,
    username: '',
    role: '', // 'admin', 'supervisor', 'salespoint'
    name: ''
};

let notifications = [];

document.addEventListener('DOMContentLoaded', () => {
    // التحقق من تسجيل الدخول
    checkAuthentication();
    
    // تهيئة الأحداث
    initializeEventListeners();
    
    // تحديث الوقت كل ثانية
    setInterval(updateCurrentTime, 1000);
    
    // تحقق من التحديثات كل ساعة
    setInterval(checkForUpdates, 3600000);
    
    // تحميل البيانات الأولية
    loadInitialData();
});

function checkAuthentication() {
    // التحقق من وجود token في localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    // تحميل بيانات المستخدم
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('userName').textContent = currentUser.name;
    
    // عرض/إخفاء عناصر القائمة حسب نوع المستخدم
    updateMenuVisibility();
}

function updateMenuVisibility() {
    const adminElements = document.querySelectorAll('.admin-only');
    const supervisorElements = document.querySelectorAll('.supervisor-only');
    const salespointElements = document.querySelectorAll('.salespoint-only');
    
    adminElements.forEach(el => {
        el.style.display = currentUser.role === 'admin' ? 'block' : 'none';
    });
    
    supervisorElements.forEach(el => {
        el.style.display = currentUser.role === 'supervisor' ? 'block' : 'none';
    });
    
    salespointElements.forEach(el => {
        el.style.display = currentUser.role === 'salespoint' ? 'block' : 'none';
    });
}

function initializeEventListeners() {
    // زر تسجيل الخروج
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // زر التنبيهات
    document.getElementById('notificationBtn').addEventListener('click', toggleNotifications);
    
    // زر تحديث البيانات
    document.querySelector('.refresh-btn').addEventListener('click', refreshData);
    
    // إغلاق النافذة المنبثقة للتنبيهات
    document.querySelector('.modal .close').addEventListener('click', () => {
        document.getElementById('notificationModal').style.display = 'none';
    });
}

function updateCurrentTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    
    document.getElementById('currentTime').textContent = now.toLocaleString('ar-DZ', options);
}

function checkForUpdates() {
    const salesPoints = getSalesPoints();
    const now = new Date();
    
    salesPoints.forEach(point => {
        const lastUpdate = new Date(point.lastUpdate);
        const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
        
        // تحديث كل ساعة
        if (hoursSinceUpdate >= 1) {
            createNotification({
                type: 'reminder',
                title: 'تذكير بالتحديث',
                message: `يرجى تحديث بيانات نقطة البيع: ${point.name}`,
                salesPoint: point.id,
                severity: 'low'
            });
        }
        
        // تأخر التحديث لمدة ساعتين
        if (hoursSinceUpdate >= 2) {
            createNotification({
                type: 'warning',
                title: 'تأخر التحديث',
                message: `لم يتم تحديث بيانات نقطة البيع: ${point.name} منذ ساعتين`,
                salesPoint: point.id,
                severity: 'medium'
            });
        }
        
        // تأخر التحديث لمدة 3 ساعات
        if (hoursSinceUpdate >= 3) {
            createNotification({
                type: 'alert',
                title: 'تنبيه عاجل',
                message: `تأخر حرج في تحديث بيانات نقطة البيع: ${point.name}`,
                salesPoint: point.id,
                severity: 'high'
            });
        }
    });
}

function createNotification(notificationData) {
    const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...notificationData,
        read: false
    };
    
    notifications.unshift(notification);
    updateNotificationBadge();
    showToast(notification);
    
    // إرسال التنبيه للمستخدمين المعنيين
    sendNotificationToUsers(notification);
}

function showToast(notification) {
    const backgroundColor = {
        low: '#7AB547',
        medium: '#FFA500',
        high: '#EF3340'
    }[notification.severity];
    
    Toastify({
        text: notification.message,
        duration: 5000,
        gravity: "top",
        position: 'right',
        backgroundColor,
        onClick: () => showNotificationDetails(notification)
    }).showToast();
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.querySelector('.notification-badge');
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'block' : 'none';
}

function toggleNotifications() {
    const modal = document.getElementById('notificationModal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        updateNotificationsList();
        modal.style.display = 'block';
    }
}

function updateNotificationsList() {
    const container = document.getElementById('notificationsList');
    container.innerHTML = notifications
        .map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" 
                 data-id="${notification.id}">
                <div class="notification-header">
                    <span class="notification-title">${notification.title}</span>
                    <span class="notification-time">
                        ${new Date(notification.timestamp).toLocaleString('ar-DZ')}
                    </span>
                </div>
                <div class="notification-message">${notification.message}</div>
            </div>
        `)
        .join('');
}

function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function refreshData() {
    loadSalesPointsData();
    loadStockData();
    showToast({
        message: 'تم تحديث البيانات بنجاح',
        severity: 'low'
    });
}

// وظائف مساعدة للتعامل مع البيانات
function getSalesPoints() {
    // في الإصدار النهائي، هذه الوظيفة ستجلب البيانات من الخادم
    return JSON.parse(localStorage.getItem('salesPoints')) || [];
}

function loadInitialData() {
    loadSalesPointsData();
    loadStockData();
    loadNotifications();
}

function loadSalesPointsData() {
    const salesPoints = getSalesPoints();
    const tableBody = document.getElementById('salesPointsTable');
    
    tableBody.innerHTML = salesPoints
        .map(point => `
            <tr>
                <td>${point.name}</td>
                <td>${point.currentStock}</td>
                <td>${new Date(point.lastUpdate).toLocaleString('ar-DZ')}</td>
                <td>
                    <span class="status-badge ${point.status}">
                        ${getStatusText(point.status)}
                    </span>
                </td>
                <td>
                    <button onclick="viewDetails(${point.id})" class="action-btn">
                        عرض التفاصيل
                    </button>
                </td>
            </tr>
        `)
        .join('');
}

function getStatusText(status) {
    const statusMap = {
        active: 'نشط',
        warning: 'تحذير',
        critical: 'حرج'
    };
    return statusMap[status] || status;
}

function loadStockData() {
    const salesPoints = getSalesPoints();
    document.getElementById('totalSalesPoints').textContent = salesPoints.length;
    document.getElementById('totalStock').textContent = salesPoints.reduce((sum, point) => sum + point.currentStock, 0);
    document.getElementById('pendingUpdates').textContent = salesPoints.filter(point => {
        const lastUpdate = new Date(point.lastUpdate);
        const now = new Date();
        return (now - lastUpdate) / (1000 * 60 * 60) >= 1;
    }).length;
}

function viewDetails(pointId) {
    // سيتم تنفيذها لاحقاً
    console.log('عرض تفاصيل نقطة البيع:', pointId);
}

// تهيئة النظام عند بدء التشغيل
function initializeDashboard() {
    checkAuthentication();
    loadInitialData();
    updateCurrentTime();
}
