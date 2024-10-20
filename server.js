/* server.js */
import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

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

// Маршрут для корневого URL, который будет отдавать index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Маршрут для получения структуры папок и файлов
app.get('/api/files', (req, res) => {
    console.log('Запрос на получение структуры файлов'); // Лог, который покажет, что запрос пришел
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
        if (!fs.existsSync(ROOT_DIR)) {
            fs.mkdirSync(ROOT_DIR);
        }
        const structure = getDirectoryStructure(ROOT_DIR);
        console.log('Отправка структуры файлов:', structure); // Лог для проверки отправляемых данных
        res.json(structure);
    } catch (error) {
        console.error('Ошибка при получении структуры файлов:', error);
        res.status(500).send('Ошибка при получении структуры файлов');
    }
});


// Маршрут для создания папки
app.post('/api/folder', (req, res) => {
    const { parentPath, folderName } = req.body;
    const newFolderPath = path.join(ROOT_DIR, parentPath, folderName);
    if (!fs.existsSync(newFolderPath)) {
        fs.mkdirSync(newFolderPath);
        res.status(201).send('Папка создана');
    } else {
        res.status(400).send('Папка уже существует');
    }
});

// Удаление папки или файла
app.delete('/api/item', (req, res) => {
    const { itemPath } = req.body;
    const fullPath = path.join(ROOT_DIR, itemPath);
    if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        res.status(200).send('Элемент удален');
    } else {
        res.status(404).send('Элемент не найден');
    }
});

app.put('/api/rename', (req, res) => {
    const { oldPath, newPath } = req.body;
    const oldFullPath = path.join(ROOT_DIR, oldPath);
    const newFullPath = path.join(ROOT_DIR, newPath);

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


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});