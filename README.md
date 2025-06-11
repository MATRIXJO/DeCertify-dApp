
# 🎓 deCertify – Blockchain-Based Certificate Verification System

## 🚩 Problem Statement

In the current education and employment ecosystem, verifying the authenticity of academic or professional certificates remains a **slow, manual, and error-prone** process:

- ❌ Organizations often struggle to determine if a certificate is legitimate or forged.
- 🕒 Manual verification or physical visits can take **weeks**.
- 📄 Physical documents are **insecure, inefficient**, and easily **misplaced**.
- 🔐 There is **no seamless way** to verify certificates across institutions in a trusted and decentralized manner.

---

## ✅ deCertify: The Solution

**deCertify** provides a **decentralized platform** for certificate issuance and verification using the **Celo Alfajores Testnet Blockchain** and **IPFS**. It ensures that certificates are:

- Tamper-proof
- Easily verifiable
- Stored and shared in a secure and decentralized way

---

## ✨ Features

- 🔗 **Blockchain Integration:** Uses Celo Alfajores Testnet for decentralized certificate hash recording.
- 🧑‍🎓 **Student Requests:** Students can request e-certificates from organizations via a WebApp.
- 🏢 **Organization Dashboard:** Institutions can view, approve, and upload verified documents.
- 📦 **IPFS Storage:** Certified documents are embedded with a QR Code seal and stored on IPFS.
- 💰 **Optional Fees:** Institutions may set issuance or verification charges.
- ✅ **Decentralized Verification:** Verifiers can compare QR code hashes with those on the blockchain.
- 📱 **Verifier App (Upcoming):** Allows quick document verification via QR scanning.

---

## 🔁 How deCertify Works

### 👨‍🎓 Student – WebApp
- Requests a certificate from an organization.
- Pays optional certification charges (if applicable).

### 🏫 Organization – WebApp
- Views certificate requests (pending/approved).
- Uploads documents with a **QR seal of verification** to IPFS.
- Records the certificate hash on blockchain.

### 🔍 Verifier – App (Planned)
- Scans the **QR code** on any submitted document.
- Compares with the blockchain-stored hash.
- **Reports violations** for mismatched or fake documents.

---

## 🔐 Tech Stack

- 🌐 **Frontend:** React.js (CRA)
- ⚙️ **Backend:** Node.js + Express
- 🧾 **Blockchain:** Celo (Alfajores Testnet)
- 📂 **Storage:** IPFS (via Pinata)
- 🧠 **QR Code:** Embedded directly into PDFs as a seal of verification
- 🗃️ **Optional:** MongoDB for managing user and request metadata

---


## 🙌 Future Work

- Build a fully functional **Verifier Mobile App**
- Add multi-user organization support (Admins, Reviewers)
- Extend to **mainnet deployment**
- Multi-language support
