# خطوات ازاي تشغلو المشروع

قبل اي حاجة لازم تعملوا كلون للريبو
هتفتحوا كوماند وتكتبوا

```bash
git clone https://github.com/DWN11311/safe-bites-node.git
```

ولازم بردو تعملوا برانش ليكو

```bash
git branch <اسم البرانش>
git checkout <اسم البرانش>
```

ولازم يكون مفيش اي فايل modified عشان يتعمل برانش وتغيروها

## ١. اول حاجة مكتبات نود

افتحوا التيرمينال واكتبوا:

```bash
npm install
```

## ٢. هتعملوا ملف .env

اعملوا ملف `.env` في الروت وضيفوا فيه:

```
PORT=8282
DATABASE=mongodb://localhost:27017/اسم_داتابيس_مونجو
SECRETKEY=اي كلمة سر


## ٣. عشان تشغلوه في طريقتين

اول طريقة:

```bash
node server.js
```

تاني طريقة:
لازم تسطبوا nodemon بس جلوبال

```bash
npm install nodemon -g
nodemon server.js
```
