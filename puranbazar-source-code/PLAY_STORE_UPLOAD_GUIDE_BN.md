# 📱 গুগল প্লে স্টোরে পুরানবাজার (PuranBazar) অ্যান্ড্রয়েড অ্যাপ আপলোড গাইড (বাংলা ও English)

## 📋 প্রাক-প্রস্তুতি ও প্রয়োজনীয় বিষয়সমূহ
1. **Android Studio** (Hedgehog বা তার পরবর্তী ভার্সন)
2. **Google Play Console অ্যাকাউন্ট** ($25 এককালীন ফি)
3. **কিস্টোর ফাইল (`.jks`)**
4. **গ্রাফিক অ্যাসেটসমূহ**:
   - অ্যাপ আইকন: 512x512 px (PNG)
   - ফিচার গ্রাফিক্স ব্যানার: 1024x500 px (PNG/JPEG)
   - মোবাইল স্ক্রিনশট: ২ থেকে ৮টি (1080x1920 বা 1080x2400 px)

---

## ধাপ ১: কিস্টোর জেনারেট করা
`android` ফোল্ডারে টার্মিনালে রান করুন:
```bash
./generate_keystore.sh
```
*(Windows-এ `generate_keystore.bat` ডাবল ক্লিক করুন)*

## ধাপ ২: Android App Bundle (.aab) তৈরি করা
```bash
./gradlew bundleRelease
```
বিল্ড শেষ হলে ফাইল পাবেন:
`android/app/build/outputs/bundle/release/app-release.aab`

## ধাপ ৩: দ্বিভাষিক স্টোর লিস্টিং (BN / EN)

### বাংলা (Default):
- **App Name:** পুরানবাজার - সেকেন্ডহ্যান্ড কেনাবেচা
- **Short Description:** ব্যবহৃত মোবাইল, বাইক, ল্যাপটপ ও গৃহস্থালি পণ্য কিনুন ও বিক্রি করুন নিরাপদে।

### English (Translations Tab):
- **App Name:** PuranBazar - Buy & Sell Used Goods
- **Short Description:** Buy and sell used mobile phones, bikes, laptops and household goods safely.

## ধাপ ৪: রিলিজ ও সাবমিট
Play Console-এ **Production > Create new release**-এ গিয়ে `.aab` ফাইল আপলোড করে সাবমিট করুন। ১-৩ কার্যদিবসে গুগল রিভিউ শেষে লাইভ হয়ে যাবে।
