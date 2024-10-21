var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
console.log("JavaScript файл загружен и выполняется");
var API_URL = 'http://localhost:3000/api';
// Получение структуры файлов
function fetchFileStructure() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Получение структуры файлов');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/files"))];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Ошибка сети при получении структуры файлов');
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log('Структура файлов:', data); // Логируем данные для проверки
                    renderFileTree(data);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Ошибка при получении структуры файлов:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Функция для отображения дерева файлов
function renderFileTree(treeData, parentElement) {
    if (parentElement === void 0) { parentElement = document.getElementById('fileTree'); }
    parentElement.innerHTML = ''; // Очищаем дерево перед повторной отрисовкой
    console.log('Рендеринг дерева файлов...');
    treeData.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item.name;
        li.className = item.type === 'folder' ? 'folder' : 'file';
        li.dataset.path = parentElement.dataset.path ? "".concat(parentElement.dataset.path, "/").concat(item.name) : item.name;
        // Добавляем иконки в зависимости от типа элемента
        var icon = document.createElement('img');
        icon.src = item.type === 'folder' ? './icons/folder.svg' : './icons/file.svg';
        icon.alt = item.type === 'folder' ? 'Folder Icon' : 'File Icon';
        icon.style.width = '16px';
        icon.style.height = '16px';
        icon.style.marginRight = '5px';
        li.prepend(icon); // Вставляем иконку перед текстом
        parentElement.appendChild(li);
        // Если элемент - папка, создаем вложенный список и добавляем обработчик для открытия/закрытия
        if (item.type === 'folder') {
            var ul_1 = document.createElement('ul');
            ul_1.style.display = 'none'; // По умолчанию вложенные элементы скрыты
            li.appendChild(ul_1);
            if (item.children && item.children.length > 0) {
                renderFileTree(item.children, ul_1);
            }
            // Добавляем обработчик клика, чтобы открывать/закрывать папку
            li.addEventListener('click', function (e) {
                e.stopPropagation(); // Останавливаем всплытие события
                // Снимаем выделение с предыдущего элемента
                var previouslySelected = document.querySelector('.selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }
                // Выделяем текущий элемент
                li.classList.add('selected');
                var icon = li.querySelector('img');
                if (ul_1.style.display === 'none') {
                    ul_1.style.display = 'block';
                    icon.src = './icons/folder_open.svg'; // Меняем иконку на открытую папку
                }
                else {
                    ul_1.style.display = 'none';
                    icon.src = './icons/folder.svg'; // Меняем иконку на закрытую папку
                }
            });
        }
        // Для файлов добавляем функцию открытия содержимого по клику и выделение
        else if (item.type === 'file') {
            li.addEventListener('click', function (e) {
                e.stopPropagation();
                // Снимаем выделение с предыдущего элемента
                var previouslySelected = document.querySelector('.selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }
                // Выделяем текущий элемент
                li.classList.add('selected');
                var filePath = li.dataset.path;
                if (filePath) {
                    fetchFileContent(filePath);
                }
            });
            // Добавить возможность редактирования файла по двойному клику
            li.addEventListener('dblclick', function (e) {
                e.stopPropagation();
                // Получаем путь к файлу
                var filePath = li.dataset.path;
                if (filePath) {
                    // Вызов функции для редактирования содержимого файла
                    editFileContent(filePath);
                }
            });
        }
    });
}
// Функция для обработки загружаемых файлов
function uploadFile() {
    return __awaiter(this, void 0, void 0, function () {
        var input;
        var _this = this;
        return __generator(this, function (_a) {
            console.log("Функция загрузки файла вызвана");
            input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.webkitdirectory = true; // Позволяет выбирать папки
            input.onchange = function () { return __awaiter(_this, void 0, void 0, function () {
                var files, formData_1, response, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            files = input.files;
                            if (!(files && files.length > 0)) return [3 /*break*/, 4];
                            formData_1 = new FormData();
                            Array.from(files).forEach(function (file) {
                                // Передаем путь относительно выбранной папки
                                var relativePath = file.webkitRelativePath;
                                formData_1.append('files', file, relativePath);
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fetch("".concat(API_URL, "/upload"), {
                                    method: 'POST',
                                    body: formData_1,
                                })];
                        case 2:
                            response = _a.sent();
                            if (response.ok) {
                                alert('Файлы успешно загружены');
                                fetchFileStructure(); // Обновить структуру файлов
                            }
                            else {
                                alert('Ошибка при загрузке файлов');
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error('Ошибка при загрузке файлов:', error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); };
            input.click();
            return [2 /*return*/];
        });
    });
}
// Функция для редактирования содержимого файла
function editFileContent(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var newContent, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newContent = prompt('Введите новое содержимое файла:');
                    if (!(newContent !== null)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/edit-file"), {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ filePath: filePath, content: newContent }),
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        alert('Файл успешно обновлен');
                        fetchFileContent(filePath); // Обновить отображение содержимого
                    }
                    else {
                        alert('Ошибка при обновлении файла');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Ошибка при обновлении файла:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Функция для получения содержимого файла и отображения его
function fetchFileContent(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var response, content, contentViewer, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/file-content?path=").concat(encodeURIComponent(filePath)))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    content = _a.sent();
                    contentViewer = document.getElementById('contentViewer');
                    if (contentViewer) {
                        contentViewer.dataset.filePath = filePath; // Сохраняем путь к файлу
                    }
                    displayFileContent(content);
                    return [3 /*break*/, 4];
                case 3:
                    alert('Ошибка при загрузке содержимого файла');
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    console.error('Ошибка при загрузке содержимого файла:', error_4);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Функция для отображения и редактирования содержимого файла в окне
function displayFileContent(content) {
    var _this = this;
    var contentViewer = document.getElementById('contentViewer');
    if (contentViewer) {
        // Создаем элемент для редактирования текста
        var editableContent_1 = document.createElement('div');
        editableContent_1.contentEditable = "true"; // Делаем текст редактируемым
        editableContent_1.innerHTML = "<pre>".concat(content, "</pre>");
        editableContent_1.style.border = "1px solid #ccc";
        editableContent_1.style.padding = "10px";
        // Добавляем обработчик для автоматического сохранения при изменении текста
        editableContent_1.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
            var newContent, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newContent = editableContent_1.textContent;
                        if (!(newContent !== null)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, saveFileContent(contentViewer.dataset.filePath, newContent)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Ошибка при сохранении изменений:', error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Очищаем и вставляем редактируемый элемент
        contentViewer.innerHTML = '';
        contentViewer.appendChild(editableContent_1);
    }
}
// Функция для автоматического сохранения содержимого файла
function saveFileContent(filePath, content) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/edit-file"), {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ filePath: filePath, content: content }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Ошибка при сохранении файла');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error('Ошибка при автоматическом сохранении файла:', error_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Функция для создания папки
function createFolder() {
    return __awaiter(this, void 0, void 0, function () {
        var folderName, response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Создание папки');
                    folderName = prompt('Введите имя папки:');
                    if (!folderName) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/folder"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ folderName: folderName }),
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        alert('Папка создана');
                        fetchFileStructure(); // Обновить структуру файлов
                    }
                    else {
                        alert('Ошибка создания папки');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    console.error('Ошибка при создании папки:', error_7);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Функция для удаления элемента (папка или файл)
function deleteItem(itemPath) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("\u0412\u044B \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C ".concat(itemPath, "?"))) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/item"), {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ itemPath: itemPath }),
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        alert('Элемент удален');
                        fetchFileStructure(); // Обновить структуру файлов
                    }
                    else {
                        alert('Ошибка при удалении элемента');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    console.error('Ошибка при удалении элемента:', error_8);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Функция для переименования элемента (папка или файл)
function renameItem(oldPath) {
    return __awaiter(this, void 0, void 0, function () {
        var newName, response, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newName = prompt('Введите новое имя:');
                    if (!newName) return [3 /*break*/, 4];
                    if (!confirm("\u0412\u044B \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u043F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u0442\u044C ".concat(oldPath, " \u0432 ").concat(newName, "?"))) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/rename"), {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ oldPath: oldPath, newPath: newName }),
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        alert('Элемент переименован');
                        fetchFileStructure(); // Обновить структуру файлов
                    }
                    else {
                        alert('Ошибка при переименовании элемента');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_9 = _a.sent();
                    console.error('Ошибка при переименовании:', error_9);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Устанавливаем обработчики и загружаем структуру файлов
document.addEventListener('DOMContentLoaded', function () {
    fetchFileStructure(); // Загружаем структуру файлов
    var createFolderBtn = document.getElementById('createFolder');
    var deleteItemBtn = document.getElementById('deleteFile');
    var renameItemBtn = document.getElementById('renameFile');
    var uploadFileBtn = document.getElementById('uploadFile');
    if (createFolderBtn) {
        createFolderBtn.addEventListener('click', function () {
            console.log("Кнопка 'Создать папку' была нажата");
            createFolder();
        });
    }
    if (deleteItemBtn) {
        deleteItemBtn.addEventListener('click', function () {
            var selectedItem = document.querySelector('.selected');
            if (selectedItem) {
                var itemPath = selectedItem.dataset.path;
                if (itemPath) {
                    deleteItem(itemPath);
                }
            }
            else {
                alert('Пожалуйста, выберите элемент для удаления');
            }
        });
    }
    if (renameItemBtn) {
        renameItemBtn.addEventListener('click', function () {
            var selectedItem = document.querySelector('.selected');
            if (selectedItem) {
                var oldPath = selectedItem.dataset.path;
                if (oldPath) {
                    renameItem(oldPath);
                }
            }
            else {
                alert('Пожалуйста, выберите элемент для переименования');
            }
        });
    }
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', function () {
            console.log("Кнопка 'Загрузить файл' была нажата");
            uploadFile();
        });
    }
});
