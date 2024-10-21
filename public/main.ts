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

// Функция для отображения дерева файлов
function renderFileTree(treeData: any[], parentElement: HTMLElement = document.getElementById('fileTree')!) {
    parentElement.innerHTML = ''; // Очищаем дерево перед повторной отрисовкой
    console.log('Рендеринг дерева файлов...');

    treeData.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        li.className = item.type === 'folder' ? 'folder' : 'file';
        li.dataset.path = parentElement.dataset.path ? `${parentElement.dataset.path}/${item.name}` : item.name;

        // Добавляем иконки в зависимости от типа элемента
        const icon = document.createElement('img');
        icon.src = item.type === 'folder' ? './icons/folder.svg' : './icons/file.svg';
        icon.alt = item.type === 'folder' ? 'Folder Icon' : 'File Icon';
        icon.style.width = '16px';
        icon.style.height = '16px';
        icon.style.marginRight = '5px';

        li.prepend(icon); // Вставляем иконку перед текстом

        parentElement.appendChild(li);

        // Если элемент - папка, создаем вложенный список и добавляем обработчик для открытия/закрытия
        if (item.type === 'folder') {
            const ul = document.createElement('ul');
            ul.style.display = 'none'; // По умолчанию вложенные элементы скрыты
            li.appendChild(ul);

            if (item.children && item.children.length > 0) {
                renderFileTree(item.children, ul);
            }

            // Добавляем обработчик клика, чтобы открывать/закрывать папку
            li.addEventListener('click', (e) => {
                e.stopPropagation(); // Останавливаем всплытие события

                // Снимаем выделение с предыдущего элемента
                const previouslySelected = document.querySelector('.selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }

                // Выделяем текущий элемент
                li.classList.add('selected');

                const icon = li.querySelector('img') as HTMLImageElement;
                if (ul.style.display === 'none') {
                    ul.style.display = 'block';
                    icon.src = './icons/folder_open.svg'; // Меняем иконку на открытую папку
                } else {
                    ul.style.display = 'none';
                    icon.src = './icons/folder.svg'; // Меняем иконку на закрытую папку
                }
            });
        }

        // Для файлов добавляем функцию открытия содержимого по клику и выделение
        else if (item.type === 'file') {
            li.addEventListener('click', (e) => {
                e.stopPropagation();

                // Снимаем выделение с предыдущего элемента
                const previouslySelected = document.querySelector('.selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }

                // Выделяем текущий элемент
                li.classList.add('selected');

                const filePath = li.dataset.path;
                if (filePath) {
                    fetchFileContent(filePath);

                    // Показать кнопку скачивания
                    const downloadZipBtn = document.getElementById('downloadZip');
                    if (downloadZipBtn) {
                        downloadZipBtn.style.display = 'block';
                    }
                }
            });
        }
    });
}





// Функция для обработки загружаемых файлов
async function uploadFile() {
    console.log("Функция загрузки файла вызвана");
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.webkitdirectory = true; // Позволяет выбирать папки
    input.onchange = async () => {
        const files = input.files;
        if (files && files.length > 0) {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                // Передаем путь относительно выбранной папки
                const relativePath = file.webkitRelativePath;
                formData.append('files', file, relativePath);
            });
            try {
                const response = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    alert('Файлы успешно загружены');
                    fetchFileStructure(); // Обновить структуру файлов
                } else {
                    alert('Ошибка при загрузке файлов');
                }
            } catch (error) {
                console.error('Ошибка при загрузке файлов:', error);
            }
        }
    };
    input.click();
}

// Функция для редактирования содержимого файла
async function editFileContent(filePath: string) {
    const newContent = prompt('Введите новое содержимое файла:');
    if (newContent !== null) {
        try {
            const response = await fetch(`${API_URL}/edit-file`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filePath, content: newContent }),
            });
            if (response.ok) {
                alert('Файл успешно обновлен');
                fetchFileContent(filePath); // Обновить отображение содержимого
            } else {
                alert('Ошибка при обновлении файла');
            }
        } catch (error) {
            console.error('Ошибка при обновлении файла:', error);
        }
    }
}


// Функция для получения содержимого файла и отображения его
async function fetchFileContent(filePath: string) {
    try {
        const response = await fetch(`${API_URL}/file-content?path=${encodeURIComponent(filePath)}`);
        if (response.ok) {
            const content = await response.text();
            const contentViewer = document.getElementById('contentViewer');
            if (contentViewer) {
                contentViewer.dataset.filePath = filePath; // Сохраняем путь к файлу
            }
            displayFileContent(content);
        } else {
            alert('Ошибка при загрузке содержимого файла');
        }
    } catch (error) {
        console.error('Ошибка при загрузке содержимого файла:', error);
    }
}

// Функция для скачивания файла в формате ZIP
async function downloadFileAsZip(filePath: string) {
    try {
        const response = await fetch(`${API_URL}/download-zip?path=${encodeURIComponent(filePath)}`);
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filePath.split('/').pop()}.zip`; // Имя файла с расширением .zip
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert('Ошибка при скачивании файла');
        }
    } catch (error) {
        console.error('Ошибка при скачивании файла:', error);
    }
}



// Функция для отображения и редактирования содержимого файла в окне
function displayFileContent(content: string) {
    const contentViewer = document.getElementById('contentViewer');
    if (contentViewer) {
        // Создаем элемент для редактирования текста
        const editableContent = document.createElement('div');
        editableContent.contentEditable = "true"; // Делаем текст редактируемым
        editableContent.innerHTML = `<pre>${content}</pre>`;
        editableContent.style.border = "1px solid #ccc";
        editableContent.style.padding = "10px";

        // Добавляем обработчик для автоматического сохранения при изменении текста
        editableContent.addEventListener('input', async () => {
            const newContent = editableContent.textContent;
            if (newContent !== null) {
                try {
                    await saveFileContent(contentViewer.dataset.filePath!, newContent);
                } catch (error) {
                    console.error('Ошибка при сохранении изменений:', error);
                }
            }
        });

        // Очищаем и вставляем редактируемый элемент
        contentViewer.innerHTML = '';
        contentViewer.appendChild(editableContent);
    }
}

// Функция для автоматического сохранения содержимого файла
async function saveFileContent(filePath: string, content: string) {
    try {
        const response = await fetch(`${API_URL}/edit-file`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath, content }),
        });

        if (!response.ok) {
            throw new Error('Ошибка при сохранении файла');
        }
    } catch (error) {
        console.error('Ошибка при автоматическом сохранении файла:', error);
    }
}


// Функция для создания папки
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
                body: JSON.stringify({ folderName }),
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

// Функция для удаления элемента (папка или файл)
async function deleteItem(itemPath: string) {
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

// Функция для переименования элемента (папка или файл)
async function renameItem(oldPath: string) {
    const newName = prompt('Введите новое имя:');
    if (newName) {
        if (confirm(`Вы действительно хотите переименовать ${oldPath} в ${newName}?`)) {
            try {
                const response = await fetch(`${API_URL}/rename`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ oldPath, newPath: newName }),
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
}


// Устанавливаем обработчики и загружаем структуру файлов
document.addEventListener('DOMContentLoaded', () => {
    fetchFileStructure(); // Загружаем структуру файлов

    const createFolderBtn = document.getElementById('createFolder');
    const deleteItemBtn = document.getElementById('deleteFile');
    const renameItemBtn = document.getElementById('renameFile');
    const uploadFileBtn = document.getElementById('uploadFile');
const downloadZipBtn = document.getElementById('downloadZip');

if (downloadZipBtn) {
    downloadZipBtn.addEventListener('click', () => {
        const selectedItem = document.querySelector('.selected') as HTMLElement;
        if (selectedItem && selectedItem.dataset.path) {
            downloadFileAsZip(selectedItem.dataset.path);
        } else {
            alert('Пожалуйста, выберите файл для скачивания');
        }
    });
}


    if (createFolderBtn) {
        createFolderBtn.addEventListener('click', () => {
            console.log("Кнопка 'Создать папку' была нажата");
            createFolder();
        });
    }

    if (deleteItemBtn) {
        deleteItemBtn.addEventListener('click', () => {
            const selectedItem = document.querySelector('.selected') as HTMLElement;
            if (selectedItem) {
                const itemPath = selectedItem.dataset.path;
                if (itemPath) {
                    deleteItem(itemPath);
                }
            } else {
                alert('Пожалуйста, выберите элемент для удаления');
            }
        });
    }

    if (renameItemBtn) {
        renameItemBtn.addEventListener('click', () => {
            const selectedItem = document.querySelector('.selected') as HTMLElement;
            if (selectedItem) {
                const oldPath = selectedItem.dataset.path;
                if (oldPath) {
                    renameItem(oldPath);
                }
            } else {
                alert('Пожалуйста, выберите элемент для переименования');
            }
        });
    }

    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', () => {
            console.log("Кнопка 'Загрузить файл' была нажата");
            uploadFile();
        });
    }
});
