/* main.ts */
console.log("JavaScript файл загружен и выполняется");

const API_URL = 'http://localhost:3000/api';

// Получение структуры файлов
async function fetchFileStructure() {
    console.log('Получение структуры файлов');
    try {
        const response = await fetch(`${API_URL}/files`);
        if (!response.ok) {
            throw new Error('Ошибка сети при получении структуры файлов');
        }
        const data = await response.json();
        console.log('Структура файлов:', data); // Логируем данные для проверки
        renderFileTree(data);
    } catch (error) {
        console.error('Ошибка при получении структуры файлов:', error);
    }
}

// Создание папки
async function createFolder() {
    console.log('Создание папки');
    const folderName = prompt('Введите имя папки:');
    if (folderName) {
        try {
            const response = await fetch(`${API_URL}/folder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ parentPath: '', folderName }),
            });
            if (response.ok) {
                alert('Папка создана');
                fetchFileStructure(); // Обновить структуру файлов
            } else {
                alert('Ошибка создания папки');
            }
        } catch (error) {
            console.error('Ошибка при создании папки:', error);
        }
    }
}

// Загрузка файла
async function uploadFile() {
    console.log("Функция загрузки файла вызвана");
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async () => {
        const file = input.files ? input.files[0] : null;
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    alert('Файл успешно загружен');
                    fetchFileStructure(); // Обновить структуру файлов
                } else {
                    alert('Ошибка при загрузке файла');
                }
            } catch (error) {
                console.error('Ошибка при загрузке файла:', error);
            }
        }
    };
    input.click();
}

// Скачивание файла
async function downloadFile() {
    console.log("Функция скачивания файла вызвана");
    const filename = prompt('Введите имя файла для скачивания:');
    if (filename) {
        try {
            const response = await fetch(`${API_URL}/download/${filename}`);
            if (response.ok) {
                // Создание ссылки для скачивания файла
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert('Ошибка при скачивании файла');
            }
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
        }
    }
}

// Удаление элемента
async function deleteItem() {
    console.log('Удаление элемента');
    const itemPath = prompt('Введите путь элемента для удаления (например, bin):');
    if (itemPath) {
        if (confirm(`Вы действительно хотите удалить ${itemPath}?`)) {
            try {
                const response = await fetch(`${API_URL}/item`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemPath }),
                });
                if (response.ok) {
                    alert('Элемент удален');
                    fetchFileStructure(); // Обновить структуру файлов
                } else {
                    alert('Ошибка при удалении элемента');
                }
            } catch (error) {
                console.error('Ошибка при удалении элемента:', error);
            }
        }
    }
}

// Переименование элемента
async function renameItem() {
    console.log('Переименование элемента');
    const oldPath = prompt('Введите текущий путь элемента для переименования (например, bin):');
    const newPath = prompt('Введите новое имя:');
    if (oldPath && newPath) {
        try {
            const response = await fetch(`${API_URL}/rename`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPath, newPath }),
            });
            if (response.ok) {
                alert('Элемент переименован');
                fetchFileStructure(); // Обновить структуру файлов
            } else {
                alert('Ошибка при переименовании элемента');
            }
        } catch (error) {
            console.error('Ошибка при переименовании:', error);
        }
    }
}

// Функция для отображения дерева файлов с поддержкой раскрытия папок
function renderFileTree(treeData: any[], parentElement: HTMLElement = document.getElementById('fileTree')!) {
    parentElement.innerHTML = ''; // Очищаем дерево перед повторной отрисовкой
    if (treeData.length === 0) {
        parentElement.innerHTML = '<p>Нет доступных файлов или папок</p>';
        return;
    }
    treeData.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        li.className = item.type === 'folder' ? 'folder' : 'file';

        parentElement.appendChild(li);

        if (item.type === 'folder' && item.children && item.children.length > 0) {
            const ul = document.createElement('ul');
            ul.style.display = 'none'; // По умолчанию вложенные элементы скрыты
            li.appendChild(ul);
            renderFileTree(item.children, ul);

            // Добавляем обработчик клика для раскрытия или закрытия папки
            li.addEventListener('click', (e) => {
                e.stopPropagation(); // Останавливаем всплытие события
                ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
            });
        }

        // Добавление обработчика для выбора файла
        if (item.type === 'file') {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                alert(`Файл выбран: ${item.name}`);
                // Здесь можно добавить логику для отображения содержимого файла
            });
        }
    });
}

// Подключение событий к кнопкам
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка структуры файлов при загрузке страницы
    console.log('DOM полностью загружен');
    fetchFileStructure();

    // Привязка событий к кнопкам
    const createFolderBtn = document.getElementById('createFolder');
    const deleteFileBtn = document.getElementById('deleteFile');
    const renameFileBtn = document.getElementById('renameFile');
    const uploadFileBtn = document.getElementById('uploadFile');
    const downloadFileBtn = document.getElementById('downloadFile');

    if (createFolderBtn) {
        createFolderBtn.addEventListener('click', () => {
            console.log("Кнопка 'Создать папку' была нажата");
            createFolder();
        });
    }

    if (deleteFileBtn) {
        deleteFileBtn.addEventListener('click', () => {
            console.log("Кнопка 'Удалить файл' была нажата");
            deleteItem();
        });
    }

    if (renameFileBtn) {
        renameFileBtn.addEventListener('click', () => {
            console.log("Кнопка 'Переименовать файл' была нажата");
            renameItem();
        });
    }

    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', () => {
            console.log("Кнопка 'Загрузить файл' была нажата");
            uploadFile();
        });
    }

    if (downloadFileBtn) {
        downloadFileBtn.addEventListener('click', () => {
            console.log("Кнопка 'Скачать файл' была нажата");
            downloadFile();
        });
    }
});

