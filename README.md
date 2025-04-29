
## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ayushthakurrrr/YT-Backend.git
cd YT-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create `.env` file in the root of the project and add below text in it:

```env
PORT = 8000
MONGODB_URI = mongodb+srv://ayt1232:1232dbhere@cluster0.p2u3vzh.mongodb.net
CORS_ORIGIN = *

ACCESS_TOKEN_SECRET=nsjdncjeJNCENCnncunUNUSCNCUNcnncuewinUNUEunecoiewojNCNue3923n323h2
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=cjdncIJEIck782873hgG66t6gYGvcgtdygdeg66cgvgVGcvdcdchccscsd
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME = ayush-ka-cloud
CLOUDINARY_API_KEY =825947119959933

CLOUDINARY_API_SECRET = 2bda18KWfcgK9KDQMGLjArHZ6rg

NODE_ENV = development
```

### 4. Start the Server

```bash
npm run dev
```
