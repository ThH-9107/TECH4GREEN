# 🌱 Precision Agriculture with Drone + AI

A full-stack web application demonstrating precision agriculture technology for tea field monitoring in Tà Xùa, Sơn La, Vietnam.

![Demo Screenshot](https://img.shields.io/badge/Status-Demo-green) ![Node](https://img.shields.io/badge/Node.js-v14+-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎯 Project Overview

This demo application showcases how drone surveillance combined with AI can revolutionize agricultural monitoring:

- **🚁 Drone Image Upload:** Simulate aerial surveillance of tea fields
- **🤖 AI Classification:** Automated detection of plant health (Healthy, Mild Infection, Severe Infection)
- **📊 Data Storage:** Save results to CSV or Google Sheets
- **📈 Dashboard:** Real-time visualization of field conditions and statistics
- **🌍 Sustainability Focus:** Reduce pesticide use by 20-50% through targeted application

---

## ✨ Features

### Frontend
- 📱 Responsive React application with Tailwind CSS
- 🎨 Modern, clean UI with drag-and-drop file upload
- 📊 Real-time dashboard showing analysis results
- 📈 Statistics cards (Total Scans, Healthy Plants, Issues Detected)
- 🖼️ Image preview and classification results

### Backend
- ⚡ Express.js REST API
- 📤 Image upload handling with Multer
- 🤖 Mock AI classification (simulates disease detection)
- 💾 Dual storage: CSV files + Google Sheets (optional)
- 🔒 Input validation and error handling
- 📡 CORS enabled for cross-origin requests

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Create project directory
mkdir precision-agriculture-demo
cd precision-agriculture-demo

# Copy server.js and package.json from artifacts
# Then install dependencies
npm install
```

### 2. Run the Server

```bash
npm start
```

Server will run on `http://localhost:5000`

### 3. Access the Frontend

Open the React artifact in Claude to test the demo immediately, or integrate into your own React app.

### 4. Upload and Analyze

1. Drag and drop a tea field image (or any image)
2. Wait for AI analysis (2 seconds)
3. View classification result
4. Check dashboard for history and statistics

---

## 📚 Documentation

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for:
- Detailed installation guide
- Google Sheets integration setup
- Deployment instructions
- Troubleshooting tips

---

## 🗂️ Project Structure

```
precision-agriculture-demo/
├── server.js                 # Express backend
├── package.json              # Dependencies
├── .env                      # Environment config (create from .env.example)
├── .env.example              # Environment template
├── credentials.json          # Google API credentials (optional)
├── analysis_results.csv      # Stored results (auto-generated)
├── uploads/                  # Uploaded images (auto-generated)
└── README.md                 # This file
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Upload & analyze image |
| GET | `/api/results` | Get all analysis results |
| GET | `/api/statistics` | Get summary statistics |
| DELETE | `/api/results` | Clear all results (testing) |

---

## 💡 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Multer** - File upload handling
- **Google APIs** - Sheets integration
- **CSV Writer** - CSV file operations

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Modern ES6+** - JavaScript features

---

## 🌍 Real-World Impact

This system aims to address critical challenges in Vietnamese agriculture:

### Problems Solved:
- ❌ **Blanket pesticide spraying** → ✅ **Targeted application**
- ❌ **Manual monitoring** → ✅ **Automated drone surveillance**
- ❌ **Late disease detection** → ✅ **Early warning system**
- ❌ **Environmental pollution** → ✅ **20-50% reduction in chemicals**

### Expected Results:
- 🌿 20-50% reduction in pesticide usage
- 💧 40-50% water savings
- 📈 12-20% increase in crop yield
- ♻️ Sustainable farming practices
- 🏆 Higher quality tea products

---

## 🎓 Educational Use

This project is perfect for:
- 📚 **Student projects** - Learn full-stack development
- 🏆 **Hackathons** - Demo precision agriculture
- 🎤 **Presentations** - Show real-world tech applications
- 🌱 **Agricultural tech demos** - Showcase IoT + AI solutions

---

## 🔮 Future Enhancements

- [ ] Real AI model integration (TensorFlow.js, PyTorch)
- [ ] GPS coordinates for field mapping
- [ ] Heatmap visualization of infected areas
- [ ] Weather data integration
- [ ] Email/SMS alerts for severe infections
- [ ] Historical trend analysis
- [ ] Multi-language support (Vietnamese, English)
- [ ] Mobile app (React Native)
- [ ] Drone control integration
- [ ] Real-time video streaming

---

## 🤝 Contributing

Contributions are welcome! This is an educational demo project.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Built for the Tà Xùa Tea Fields Precision Agriculture Initiative

---

## 🙏 Acknowledgments

- Tà Xùa farming community in Bắc Yên, Sơn La
- Research on precision agriculture and drone technology
- Open-source community for amazing tools and libraries

---

## 📞 Support

For questions or issues:
1. Check [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
2. Review server logs for errors
3. Check browser console for frontend issues

---

**Built with ❤️ for sustainable agriculture**