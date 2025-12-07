# 📱 PhoneBookCase — React Native Contacts App

PhoneBookCase, kullanıcıların rehberini yöneten, sunucudan kişi verileri çeken ve cihaz rehberi ile senkronize çalışan basit bir **React Native telefon rehberi uygulamasıdır**.

## 🚀 Özellikler

- API üzerinden kişi listesi çekme
- Yeni kişi ekleme, düzenleme ve silme
- Cihaz rehberi ile entegre çalışma
- Kayıtlı olup olmadığını tespit etme
- Telefon rehberine kişi ekleme ve silme
- Arama geçmişi (Search Story)

---

# 🔧 Kurulum

Aşağıdaki adımlarla projeyi bilgisayarınızda çalıştırabilirsiniz.

## 1️⃣ Projeyi klonla

```sh
git clone https://github.com/frantico1/PhoneBookCase.git
cd PhoneBookCase
```

## 2️⃣ Bağımlılıkları yükle

```sh
npm install
# veya
yarn install
```

## 3️⃣ Metro başlat

```sh
npm start
```

## 4️⃣ Android çalıştırma

```sh
npm run android
```

## 5️⃣ iOS çalıştırma (macOS) (Şu an ios desteklemiyor)

```sh
cd ios
pod install
cd ..
npm run ios
```

---

# 📦 APK oluşturma

Debug APK:

```sh
cd android
./gradlew assembleDebug
```

Çıktı:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Release APK:

```sh
cd android
./gradlew assembleRelease
```

---

# 🧪 Çevresel Gereksinimler

- Node.js 16+
- JDK 17
- Android Studio / Xcode
- React Native CLI ortamı kurulmuş olmalı

React Native ortam kurulumu:
https://reactnative.dev/docs/environment-setup

---
