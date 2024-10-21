import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';

const app = express();
const PORT = 3000;

// Путь к директории, содержащей статические файлы (index.html, css, js и т.д.)
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ROOT_DIR = path.join(process.cwd(), 'project_files');

// Создание папки `project_files`, если она отсутствует
if (!fs.existsSync(ROOT_DIR)) {
    fs.mkdirSync(ROOT_DIR);
}

app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// Настройка multer для загрузки файлов с сохранением путей
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const relativePath = path.dirname(file.originalname);
        const uploadPath = path.join(ROOT_DIR, relativePath);

        // Создание папки, если она не существует
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, path.basename(file.originalname));
    }
});
const upload = multer({ storage });

// Маршрут для загрузки файлов
app.post('/api/upload', upload.array('files'), (req, res) => {
    if (req.files && req.files.length > 0) {
        res.status(200).send('Файлы успешно загружены');
    } else {
        res.status(400).send('Ошибка при загрузке файлов');
    }
});

// Маршрут для получения структуры папок и файлов
app.get('/api/files', (req, res) => {
    const getDirectoryStructure = (dirPath) => {
        const structure = [];
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const fullPath = path.join(dirPath, file);
            const isDirectory = fs.statSync(fullPath).isDirectory();
            structure.push({
                name: file,
                type: isDirectory ? 'folder' : 'file',
                children: isDirectory ? getDirectoryStructure(fullPath) : []
            });
        });
        return structure;
    };

    try {
        const structure = getDirectoryStructure(ROOT_DIR);
        res.json(structure);
    } catch (error) {
        console.error('Ошибка при получении структуры файлов:', error);
        res.status(500).send('Ошибка при получении структуры файлов');
    }
});


// Маршрут для загрузки файлов
app.post('/api/upload', upload.array('files'), (req, res) => {
    if (req.files && req.files.length > 0) {
        res.status(200).send('Файлы успешно загружены');
    } else {
        res.status(400).send('Ошибка при загрузке файлов');
    }
});

// Маршрут для создания новой папки
app.post('/api/folder', (req, res) => {
    const { parentPath = '', folderName } = req.body;
    const newFolderPath = path.join(ROOT_DIR, parentPath, folderName);

    if (!fs.existsSync(newFolderPath)) {
        try {
            fs.mkdirSync(newFolderPath, { recursive: true });
            res.status(201).send('Папка создана');
        } catch (error) {
            console.error('Ошибка при создании папки:', error);
            res.status(500).send('Ошибка при создании папки');
        }
    } else {
        res.status(400).send('Папка уже существует');
    }
});

// Маршрут для удаления папки или файла
app.delete('/api/item', (req, res) => {
    const { itemPath } = req.body;
    const fullPath = path.join(ROOT_DIR, itemPath);

    if (fs.existsSync(fullPath)) {
        try {
            fs.rmSync(fullPath, { recursive: true, force: true });
            res.status(200).send('Элемент удален');
        } catch (error) {
            console.error('Ошибка при удалении элемента:', error);
            res.status(500).send('Ошибка при удалении элемента');
        }
    } else {
        res.status(404).send('Элемент не найден');
    }
});

// Маршрут для переименования папки или файла
app.put('/api/rename', (req, res) => {
    const { oldPath, newPath } = req.body;
    const oldFullPath = path.join(ROOT_DIR, oldPath);
    const newFullPath = path.join(ROOT_DIR, path.dirname(oldPath), newPath);

    if (fs.existsSync(oldFullPath)) {
        try {
            fs.renameSync(oldFullPath, newFullPath);
            res.status(200).send('Элемент переименован');
        } catch (error) {
            console.error('Ошибка при переименовании элемента:', error);
            res.status(500).send('Ошибка при переименовании элемента');
        }
    } else {
        res.status(404).send('Элемент не найден');
    }
});

// Маршрут для получения содержимого файла
app.get('/api/file-content', (req, res) => {
    const { path: filePath } = req.query;
    const fullPath = path.join(ROOT_DIR, filePath);

    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            res.send(content);
        } catch (error) {
            console.error('Ошибка при чтении файла:', error);
            res.status(500).send('Ошибка при чтении файла');
        }
    } else {
        res.status(404).send('Файл не найден');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
