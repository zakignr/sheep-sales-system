// الثوابت العامة
const CONFIG = {
    REFRESH_INTERVAL: 60000, // تحديث كل دقيقة
    UPDATE_REMINDER: 3600000, // تذكير كل ساعة
    API_ENDPOINTS: {
        SALES_POINTS: '/api/sales-points',
        NOTIFICATIONS: '/api/notifications',
        STOCK: '/api/stock',
        USERS: '/api/users'
    }
};

// حالة التطبيق
const APP_STATE = {
    currentUser: null,
    notifications: [],
    salesPoints: [],
    lastUpdate: null
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // تحقق من تسجيل الدخول
        await checkAuthentication();
        
        // تهيئة المكونات
        initializeComponents();
        
        // تحميل البيانات الأولية
        await loadInitialData();
        
        // بدء المؤقتات
        startTimers();
        
    } catch (error) {
        console.error('خطأ في تهيئة التطبيق:', error);
        window.location.href = '/index.html';
    }
}

function initializeComponents() {
    // تهيئة الأحداث
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('notificationBtn').addEventListener('click', toggleNotifications);
    document.querySelector('.refresh-btn').addEventListener('click', refreshData);
    
    // تهيئة النوافذ المنبثقة
    initializeModals();
    
    // تحديث معلومات المستخدم
    updateUserInfo();
}

function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

async function loadInitialData() {
    try {
        // تحميل نقاط البيع
        const salesPointsData = await fetchSalesPoints();
        updateSalesPointsTable(salesPointsData);
        
        // تحميل الإحصائيات
        const statsData = await fetchStatistics();
        updateDashboardStats(statsData);
        
        // تحميل التنبيهات
        const notificationsData = await fetchNotifications();
        updateNotifications(notificationsData);
        
    } catch (error) {
        showToast('حدث خطأ في تحميل البيانات', 'error');
    }
}

function startTimers() {
    // تحديث الوقت
    setInterval(updateCurrentTime, 1000);
    
    // تحديث البيانات
    setInterval(refreshData, CONFIG.REFRESH_INTERVAL);
    
    // فحص التحديثات
    setInterval(checkForUpdates, CONFIG.UPDATE_REMINDER);
}

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-DZ', { hour12: false });
    const dateString = now.toLocaleDateString('ar-DZ');
    document.getElementById('currentTime').textContent = `${dateString} ${timeString}`;
}

function updateUserInfo() {
    const userNameElement = document.getElementById('userName');
    userNameElement.textContent = APP_STATE.currentUser?.name || 'مستخدم';
    
    // إظهار/إخفاء عناصر القائمة حسب الصلاحيات
    const isAdmin = APP_STATE.currentUser?.role === 'admin';
    document.getElementById('adminMenu').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('adminStockMenu').style.display = isAdmin ? 'block' : 'none';
}

async function checkForUpdates() {
    const now = new Date();
    APP_STATE.salesPoints.forEach(point => {
        const lastUpdate = new Date(point.lastUpdate);
        const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
        
        if (hoursDiff >= 1) {
            // تذكير نقطة البيع
            createNotification({
                type: 'reminder',
                target: point.id,
                message: `يرجى تحديث بيانات نقطة البيع ${point.name}`
            });
            
            if (hoursDiff >= 2) {
                // إخطار المراقب
                createNotification({
                    type: 'warning',
                    target: point.supervisorId,
                    message: `نقطة البيع ${point.name} لم تحدث بياناتها منذ ${Math.floor(hoursDiff)} ساعة`
                });
                
                if (hoursDiff >= 3) {
                    // إخطار الأدمن
                    createNotification({
                        type: 'urgent',
                        target: 'admin',
                        message: `تحذير: نقطة البيع ${point.name} متوقفة عن التحديث`
                    });
                }
            }
        }
    });
}

async function createNotification(notificationData) {
    try {
        const response = await fetch(CONFIG.API_ENDPOINTS.NOTIFICATIONS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notificationData)
        });
        
        if (response.ok) {
            const notification = await response.json();
            APP_STATE.notifications.push(notification);
            updateNotificationBadge();
            showToast(notification.message, notification.type);
        }
    } catch (error) {
        console.error('خطأ في إنشاء التنبيه:', error);
    }
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    const count = APP_STATE.notifications.filter(n => !n.read).length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
}

function showToast(message, type = 'info') {
    const colors = {
        info: '#7AB547',
        warning: '#FFA500',
        error: '#EF3340',
        reminder: '#0066B3'
    };
    
    Toastify({
        text: message,
        duration: 5000,
        gravity: "top",
        position: 'right',
        backgroundColor: colors[type] || colors.info,
        className: `toast-${type}`
    }).showToast();
}

async function handleLogout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/index.html';
        }
    } catch (error) {
        showToast('حدث خطأ في تسجيل الخروج', 'error');
    }
}

// وظائف تحديث واجهة المستخدم
function updateSalesPointsTable(data) {
    const tbody = document.getElementById('salesPointsTable');
    tbody.innerHTML = '';
    
    data.forEach(point => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${point.name}</td>
            <td>${point.currentStock}</td>
            <td>${new Date(point.lastUpdate).toLocaleString('ar-DZ')}</td>
            <td>
                <span class="status-badge ${point.status}">${getStatusText(point.status)}</span>
            </td>
            <td>
                <button onclick="viewDetails(${point.id})" class="btn-action">
                    <i class="fas fa-eye"></i>
                </button>
                ${APP_STATE.currentUser?.role === 'admin' ? `
                    <button onclick="editPoint(${point.id})" class="btn-action">
                        <i class="fas fa-edit"></i>
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function getStatusText(status) {
    const statuses = {
        active: 'نشط',
        warning: 'تحذير',
        inactive: 'غير نشط'
    };
    return statuses[status] || status;
}

function updateDashboardStats(stats) {
    document.getElementById('totalSalesPoints').textContent = stats.totalPoints;
    document.getElementById('totalStock').textContent = stats.totalStock;
    document.getElementById('pendingUpdates').textContent = stats.pendingUpdates;
}

// وظائف جلب البيانات
async function fetchSalesPoints() {
    const response = await fetch(CONFIG.API_ENDPOINTS.SALES_POINTS);
    if (!response.ok) throw new Error('فشل جلب بيانات نقاط البيع');
    return await response.json();
}

async function fetchStatistics() {
    const response = await fetch('/api/statistics');
    if (!response.ok) throw new Error('فشل جلب الإحصائيات');
    return await response.json();
}

async function fetchNotifications() {
    const response = await fetch(CONFIG.API_ENDPOINTS.NOTIFICATIONS);
    if (!response.ok) throw new Error('فشل جلب التنبيهات');
    return await response.json();
}

async function refreshData() {
    try {
        await loadInitialData();
        showToast('تم تحديث البيانات بنجاح', 'info');
    } catch (error) {
        showToast('فشل تحديث البيانات', 'error');
    }
}

// تصدير الوظائف للاستخدام العام
window.viewDetails = viewDetails;
window.editPoint = editPoint;
window.toggleNotifications = toggleNotifications;
