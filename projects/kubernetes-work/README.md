# Kubernetes Work - لاب Kubernetes للمبتدئين

تاسك عملي صغير لتعلّم أساسيات Kubernetes عن طريق تشغيل صفحة Nginx محلية، ثم فحصها وتوسعتها وتحديثها.

## هتتعلم إيه؟

- Namespace لعزل موارد التطبيق.
- ConfigMap لتقديم صفحة HTML مخصصة.
- Deployment لتشغيل وإدارة نسخ التطبيق.
- Service لربط التطبيق داخل الـcluster.
- فحص الـPods والـlogs والـevents.
- التوسعة وتحديث التطبيق والتأكد من تعافي Kubernetes عند حذف Pod.

## المتطلبات

- Docker Desktop على macOS أو Windows، أو Docker على Linux.
- Kubernetes cluster محلي واحد من الاختيارات التالية:
  - Kubernetes المدمج في Docker Desktop: افتح Docker Desktop ثم **Settings > Kubernetes > Enable Kubernetes** وانتظر حتى تصبح الحالة جاهزة.
  - Minikube: ثبّت Minikube و`kubectl` حسب [دليل Minikube الرسمي](https://minikube.sigs.k8s.io/docs/start/)، ثم شغّل `minikube start`.
- مساحة إنترنت عند أول تشغيل لتنزيل صورة Nginx.

تأكد أن `kubectl` متصل بالـcluster:

```bash
kubectl config current-context
kubectl cluster-info
```

لو اخترت Minikube، تأكد أنه يعمل:

```bash
minikube status
```

## تشغيل التask

من جذر المستودع:

```bash
cd projects/kubernetes-work
kubectl apply -f k8s/
kubectl get all -n kubernetes-work
```

انتظر حتى تصبح نسختا التطبيق جاهزتين:

```bash
kubectl rollout status deployment/web -n kubernetes-work
kubectl get pods -n kubernetes-work
```

افتح التطبيق محليًا باستخدام port-forward:

```bash
kubectl port-forward service/web 8080:80 -n kubernetes-work
```

اترك الأمر يعمل، وافتح <http://localhost:8080>. لإيقاف الاتصال اضغط `Ctrl+C` في نفس الطرفية. الـService هنا من نوع `ClusterIP`؛ هذا اللاب لا يفتح الخدمة على الإنترنت.

## التمارين

نفّذ التمارين بالترتيب:

1. افحص الموارد والعناوين:

   ```bash
   kubectl get namespace kubernetes-work
   kubectl get deployment,replicaset,pods,service -n kubernetes-work -o wide
   ```

2. اعرف لماذا Pod معيّن يعمل أو يفشل، واستعرض سجلاته:

   ```bash
   kubectl describe pod -l app=kubernetes-work-web -n kubernetes-work
   kubectl logs deployment/web -n kubernetes-work
   kubectl get events -n kubernetes-work --sort-by=.metadata.creationTimestamp
   ```

3. وسّع التطبيق إلى 3 نسخ، وتأكد أن كل النسخ جاهزة:

   ```bash
   kubectl scale deployment/web --replicas=3 -n kubernetes-work
   kubectl get pods -n kubernetes-work
   ```

4. اعرض أسماء الـPods:

   ```bash
   kubectl get pods -l app=kubernetes-work-web -n kubernetes-work
   ```

   احذف اسم Pod واحد من النتيجة بدلًا من `<pod-name>`، ثم راقب Deployment وهو ينشئ بديلًا تلقائيًا:

   ```bash
   kubectl delete pod <pod-name> -n kubernetes-work --wait=false
   kubectl get pods -n kubernetes-work --watch
   ```

   أوقف متابعة `--watch` باستخدام `Ctrl+C`.

5. حدّث صورة Nginx وتابع عملية التحديث:

   ```bash
   kubectl set image deployment/web nginx=nginx:1.28-alpine -n kubernetes-work
   kubectl rollout status deployment/web -n kubernetes-work
   kubectl get deployment/web -n kubernetes-work
   ```

6. **تحدي اختياري:** عدّل `k8s/10-configmap.yaml` لتغيير نص الصفحة، ثم طبّق التغيير وتأكد من ظهوره في المتصفح:

   ```bash
   kubectl apply -f k8s/10-configmap.yaml
   kubectl rollout restart deployment/web -n kubernetes-work
   kubectl rollout status deployment/web -n kubernetes-work
   ```

## معاني الملفات

- `00-namespace.yaml`: مساحة أسماء مستقلة للاب.
- `10-configmap.yaml`: محتوى الصفحة التي يعرضها Nginx.
- `20-deployment.yaml`: نسختان من Nginx مع readiness probe وموارد CPU/RAM محددة.
- `30-service.yaml`: عنوان داخلي ثابت يوجّه الطلبات إلى نسخ التطبيق الجاهزة.

## التنظيف

احذف موارد اللاب بعد الانتهاء:

```bash
kubectl delete -f k8s/
```

أو احذف الـNamespace بالكامل:

```bash
kubectl delete namespace kubernetes-work
```

## ملاحظات

- هذا لاب تعليمي محلي، وليس إعدادًا إنتاجيًا.
- لا يحتاج المشروع إلى تطبيق Node.js أو SQL Server؛ الهدف هنا تعلّم أساسيات Kubernetes أولًا.
- بيانات الـConfigMap ليست مناسبة لتخزين كلمات المرور أو الأسرار.
