# 🚀 DevOps Monitoring Academy: Nginx & WordPress Stacks

مشروع سيناريوهات المراقبة ورصد الأداء (**DevOps Monitoring & Observability**) باستخدام **Prometheus**, **Grafana**, و **Alertmanager**.

يوفر المشروع بيئتين مستقلتين كاملتين للاستخدام والتعليم:
1. **🌐 Nginx Web Server Monitoring Stack**: بيئة سيرفر Nginx + النواقل Nginx Prometheus Exporter.
2. **📝 WordPress & MySQL Monitoring Stack**: بيئة WordPress + MySQL 8.0 + النواقل MySQL Prometheus Exporter.

---

## 🗂️ هيكل المشروعات (Architecture)

```
docker-work/
├── docker-compose.yml              # البيئة الافتراضية (Nginx Web Server + Monitoring)
├── docker-compose.nginx.yml        # كود Nginx Standalone Monitoring
├── docker-compose.wordpress.yml    # كود WordPress + MySQL 8.0 Monitoring
├── nginx/
│   └── nginx.conf                  # إعدادات Nginx وتفعيل /stub_status للمقاييس
├── docker/
│   ├── prometheus/
│   │   ├── prometheus-nginx.yml    # إعدادات Prometheus لبيئة Nginx
│   │   ├── prometheus-wordpress.yml# إعدادات Prometheus لبيئة WordPress & MySQL
│   │   ├── alert.rules.nginx.yml   # قواعد الإنذارات لسيرفر Nginx
│   │   └── alert.rules.wordpress.yml# قواعد الإنذارات لداتابيز MySQL و WordPress
│   ├── alertmanager/
│   │   └── alertmanager.yml        # إعدادات توجيه التنبيهات والإنذارات
│   └── grafana/
│       └── provisioning/
│           ├── datasources/
│           │   └── prometheus.yml  # الربط التلقائي لـ Prometheus مع Grafana
│           └── dashboards/
│               ├── dashboards.yml  # التجهيز التلقائي للداشبوردات
│               ├── nginx-dashboard.json     # داشبورد أداء Nginx
│               └── wordpress-dashboard.json # داشبورد أداء WordPress & MySQL
└── public/
    └── presentation.html           # العرض التقديمي الشامل وشهادة التخرج
```

---

## ⚡ 1. تشغيل بيئة Nginx Web Server Monitoring

بيئة مستقلة لمراقبة سيرفر Nginx وحركة المرور (Active Connections, RPS, Traffic status).

### أمر التشغيل:
```bash
docker compose -f docker-compose.nginx.yml up -d
```
*(أو `docker compose up -d` لتشغيل البيئة الافتراضية)*

### الروابط والمنافذ:
* 🌐 **Nginx Web Server:** [http://localhost](http://localhost)
* 📈 **Grafana Nginx Dashboard:** [http://localhost:3001](http://localhost:3001) *(User: `admin` / Password: `admin_secret`)*
* 🚨 **Alertmanager UI:** [http://localhost:9093](http://localhost:9093)
* 📊 **Prometheus UI:** [http://localhost:9090](http://localhost:9090)
* ⚙️ **Nginx Exporter Metrics:** [http://localhost:9113/metrics](http://localhost:9113/metrics)

---

## ⚡ 2. تشغيل بيئة WordPress & MySQL Monitoring

بيئة لمراقبة موقع WordPress وداتابيز MySQL 8.0 وحجم الاستعلامات والاستجابة.

### أمر التشغيل:
```bash
docker compose -f docker-compose.wordpress.yml up -d
```

### الروابط والمنافذ:
* 📝 **WordPress Site:** [http://localhost:8000](http://localhost:8000)
* 📈 **Grafana WordPress & MySQL Dashboard:** [http://localhost:3001](http://localhost:3001) *(User: `admin` / Password: `admin_secret`)*
* 🚨 **Alertmanager UI:** [http://localhost:9093](http://localhost:9093)
* 📊 **Prometheus UI:** [http://localhost:9090](http://localhost:9090)
* ⚙️ **MySQL Exporter Metrics:** [http://localhost:9104/metrics](http://localhost:9104/metrics)

---

## 🧪 اختبار التنبيهات والإنذارات (Chaos & Alert Testing)

لاختبار نظام التنبيهات في **Alertmanager**:

1. لإيقاف داتابيز MySQL تجريبياً:
   ```bash
   docker stop taskflow_mysql_db
   ```
   * افتح [http://localhost:9093](http://localhost:9093) ستشاهد إنذار أحمر 🚨 `MySQLDown`.

2. لإعادة تشغيل الداتابيز:
   ```bash
   docker start taskflow_mysql_db
   ```
   * يرجع النظام تلقائياً للوضع التمام 🟢 (`No alert groups found`).

---

## 🛑 إيقاف البيئات وتنظيف الموارد

إيقاف بيئة Nginx:
```bash
docker compose -f docker-compose.nginx.yml down -v
```

إيقاف بيئة WordPress:
```bash
docker compose -f docker-compose.wordpress.yml down -v
```
