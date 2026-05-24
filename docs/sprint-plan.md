# Sprint 1 — Auth, İşletme, Masa ve Ürün Altyapısı

**Başlangıç:** 2026-05-24  
**Hedef:** Sistemin temel varlıklarını oluşturmak

---

## 🎯 Sprint Hedefleri

- [x] Proje iskeletini anla ve belgele
- [x] Veritabanı şemasını belgele
- [x] Git branch stratejisini belirle
- [ ] Prisma schema yaz
- [ ] Backend Auth modülü
- [ ] Backend Tables/Orders/Payments modülleri
- [x] **Görev 1: Login entegrasyonu** ← Baki İmsal
- [ ] Görev 2: Admin layout (Sidebar + Header)
- [ ] Görev 3: Dashboard ana ekranı
- [x] **Görev 2: Masa ekranı frontend** ← Baki İmsal
- [ ] Görev 5: Sipariş ekranı
- [ ] Görev 6: Ödeme ekranı
- [ ] Görev 7: Raporlama ekranı

---

## 📋 Baki İmsal — Sprint 1 Görev Detayları

### ✅ Görev 1: Login Entegrasyonu
**Branch:** `feature/admin-layout`  
**Durum:** TAMAMLANDI

| Dosya | Durum |
|-------|-------|
| `src/types/index.ts` | ✅ Yazıldı |
| `src/lib/api.ts` | ✅ Yazıldı |
| `src/lib/auth.ts` | ✅ Yazıldı |
| `src/app/globals.css` | ✅ Yazıldı |
| `src/app/layout.tsx` | ✅ Yazıldı |
| `src/app/page.tsx` | ✅ Yazıldı |
| `src/app/login/page.tsx` | ✅ Yazıldı |
| `src/app/login/login.module.css` | ✅ Yazıldı |

**Ne yapıldı:**
- Tüm TypeScript tipleri veritabanı şemasına göre yazıldı
- `api.ts`: Token yönetimi, tüm domain API çağrıları, 401 → otomatik logout
- `auth.ts`: login/logout/fetchCurrentUser, rol kontrolü (hasRole/isAdmin/isCashier)
- Login formu: glassmorphism tasarım, şifre toggle, loading spinner, hata shake animasyonu
- Global CSS: design token sistemi, dark theme, özel scrollbar

---

### 🔲 Görev 2: Admin Layout (Sidebar + Header)
**Branch:** `feature/admin-layout`  
**Durum:** BEKLEMEDE

---

### 🔲 Görev 3: Dashboard
**Branch:** `feature/dashboard`  
**Durum:** BEKLEMEDE

---

### 🔲 Görev 4: Masa Yönetim Ekranı
**Branch:** `feature/tables-page`  
**Durum:** BEKLEMEDE

---

### 🔲 Görev 5: Sipariş Ekranı
**Branch:** `feature/orders-page`  
**Durum:** BEKLEMEDE

---

### 🔲 Görev 6: Ödeme Ekranı
**Branch:** `feature/payments-page`  
**Durum:** BEKLEMEDE

---

### 🔲 Görev 7: Raporlama Ekranı
**Branch:** `feature/reports-page`  
**Durum:** BEKLEMEDE
