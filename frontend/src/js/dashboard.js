document.addEventListener('DOMContentLoaded', () => {
    // تحديث الوقت كل ثانية
    setInterval(updateCurrentTime, 1000);
    
    // تحقق من التحديثات كل ساعة
    setInterval(checkForUpdates, 3600000); // 3600000 ms = 1 hour
    
    // التحقق من نوع المستخدم وعرض/إخفاء العناصر المناسبة
    checkUserRole();
    
    // تهيئة النظام
    initializeDashboard();
});

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-DZ');
    const dateString = now.toLocaleDateString('ar-DZ');
    document.getElementById('currentTime').textContent = `${dateString} ${timeString}`;
}

function checkForUpdates() {
    // تحقق من وقت آخر تحديث لكل نقطة بيع
    const salesPoints = getSalesPoints();
    salesPoints.forEach(point => {
        const lastUpdate = new Date(point.lastUpdate);
        const now = new Date();
        const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
        
        if (hoursSinceUpdate >= 1) {
            // إرسال تذكير لنقطة البيع
            notifySalesPoint(point);
            
            // إذا كان التأخير أكثر من ساعتين، أخبر المراقب
            if (hoursSinceUpdate >= 2) {
                notifySupervisor(point);
                
                // إذا كان التأخير أكثر من 3 ساعات، أخبر الأدمن
                if (hoursSinceUpdate >= 3) {
                    notifyAdmin(point);
                }
            }
        }
    });
}

function notifySalesPoint(point) {
    showToast(`تذكير: يرجى تحديث بيانات نقطة البيع ${point.name}`, 'warning');
}

function notifySupervisor(point) {
    showToast(`تنبيه: نقطة البيع ${point.name} لم تحدث بياناتها منذ أكثر من ساعتين`, 'warning');
}

function notifyAdmin(point) {
    showToast(`تحذير: نقطة البيع ${point.name} لم تحدث بياناتها منذ أكثر من 3 ساعات`, 'error');
}

function showToast(message, type = 'info') {
    Toastify({
        text: message,
        duration: 5000,
        gravity: "top",
        position: 'right',
        backgroundColor: type === 'error' ? '#EF3340' : 
                        type === 'warning' ? '#FFA500' : 
                        '#7AB547',
    }).
