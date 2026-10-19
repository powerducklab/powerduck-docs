---
title: "اكتشاف خطأ في التنفيذ باختبارات العقد"
description: "اكتشاف خطأ في التنفيذ باختبارات العقد"
---

# اكتشاف خطأ في التنفيذ باختبارات العقد

يستخدم هذا المثال منفّذ MCP للمطورين، مع دعم التحقق من مخطط الاستجابة منذ الإصدار 0.7.6. يتطلب Node.js 22.12.0 أو أحدث. يستخدم بيانات افتراضية وخادمًا خلفيًا يستمع على واجهة الاسترجاع المحلي فقط؛ بعد تثبيت التبعيات لا يلزم حساب أو نموذج أو API عامة.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

الاستجابة هي `{"total":"42"}` بينما يتطلب المخطط عددًا. يُبلغ المدقق الحقيقي عن `/total must be number` ويخرج بالرمز 1.

```sh
node examples/contract-total/verify.mjs --correct
```

يعيد الخادم الخلفي الآن `{"total":42}`؛ فينجح الفحص نفسه ويخرج بالرمز 0. لإصلاح التنفيذ بنفسك، عدّل التعبير `total` في `examples/contract-total/server.mjs` ليعيد عددًا. لا تُضعف العقد لإخفاء الخطأ.

يخصص كل تشغيل منفذًا محليًا متاحًا ثم يوقف خادمه عند الانتهاء. الملفات والأوامر موجودة في [مشروع المثال](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total). تغطي فحوص المخطط حاليًا استجابات JSON، دون التحقق من التنسيقات أو جلب المخططات البعيدة. إذا تطلب نوع محتوى غير مدعوم التحقق من المخطط، يُبلَّغ عن القيد بدل تمريره بصمت.

يفحص هذا خادمًا خلفيًا حقيقيًا. نجاح طلب Mock يوضح سير المثال فقط. يمكن لوكيل برمجة، اختياريًا، استخدام `run_contract_tests` مع `baseUrl` صريح لإجراء التحقق نفسه؛ راجع التصحيح قبل تطبيقه.

[تنزيل تطبيق سطح المكتب](https://www.powerduck.com/download.html) · [البدء السريع](https://www.powerduck.com/docs/ar-SA/overview/quickstart/)
