# পুরানবাজার (PuranBazar) - Native Android Application (Bilingual: বাংলা ও English)

এই প্রোজেক্টটি পুরানবাজার অনলাইন মার্কেটপ্লেসের অফিসিয়াল **Native Android Studio App**। এটি **Android 9.0 (API Level 28) এবং এর ওপরের সকল Android ভার্সন (Android 10, 11, 12, 13, 14, 15)** সমর্থন করে এবং **Google Play Store Console**-এ সরাসরি আপলোড করার জন্য সম্পূর্ণ প্রস্তুত।

---

## 🌐 দ্বিভাষিক সাপোর্ট (Bilingual Support - BN / EN):
- অ্যাপের ভেতর বাংলা ও ইংরেজি (BN / EN) ভাষা পরিবর্তনের সুবিধা সংযুক্ত।
- ব্যবহারকারীর পছন্দ অনুযায়ী স্বয়ংক্রিয়ভাবে লোকাল স্টোরেজ ও ওয়েবভিউ সিঙ্ক হয়।
- Android Native `res/values/strings.xml` (বাংলা) এবং `res/values-en/strings.xml` (English) উভয়ই অন্তর্ভুক্ত।

---

## 📱 প্রধান স্পেসিফিকেশন:
- **Package Name**: `com.puranbazar.marketplace`
- **Min SDK**: API 28 (Android 9.0 Pie)
- **Target SDK**: API 34 (Android 14)
- **Compile SDK**: API 34
- **Language**: Kotlin

---

## 🚀 যেভাবে সাইনড AAB তৈরি করবেন (Play Store-এর জন্য):
1. Keystore তৈরি করুন:
   ```bash
   ./generate_keystore.sh
   ```
2. রিলিজ AAB ফাইল তৈরি করুন:
   ```bash
   ./gradlew bundleRelease
   ```
   ফাইল পাবেন: `app/build/outputs/bundle/release/app-release.aab`
